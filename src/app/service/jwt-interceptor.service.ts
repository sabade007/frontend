import { Injectable } from "@angular/core";
import { PopoverController } from "@ionic/angular";

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpClient,
} from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs"; // only need to import from rxjs
// import 'rxjs/add/operator/do';
import { tap } from "rxjs/operators";
import { SessionExpiredComponent } from "../components/modalpage/session-expired/session-expired.component";
import { environment } from "src/environments/environment.prod";
import { SessionTimeoutComponent } from "../components/modalpage/session-timeout/session-timeout.component";
import { FileuploadErrorComponent } from "../components/modalpage/fileupload-error/fileupload-error.component";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class JwtInterceptorService implements HttpInterceptor {
  popover: any;
  refreshToken: any;
  isLogin: any;
  isRefreshToken = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly http: HttpClient,
    private popoverController: PopoverController,
    private localService: LocalService
  ) {
    this.refreshToken = this.localService.getJsonValue(localData.refreshToken);
    console.log("refreshToken", this.refreshToken);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log(event.headers);

            let aboutToExpire = event.headers.get("isRefreshToken") === "true";
            if (!this.isRefreshToken && aboutToExpire) {
              this.isRefreshToken = true;
              //call refresh token ;
              this.refreshTokens();
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.sessionTimeOut();
              // this.router.navigate(["/login"]);
              // this.popoverController.dismiss();
              // this.localService.clearToken();
              // sessionStorage.clear();
              // setTimeout(() => {
              //   location.reload();
              // }, 1000);
            }
            if (err.status === 404) {
              this.router.navigate(["/login"]);
              this.popoverController.dismiss();
              this.localService.clearToken();
              sessionStorage.clear();
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
            if (err.status === 413) {
              this.fileUploadError();
            }
            if (err.status === 502) {
              this.router.navigate(["/login"]);
              this.popoverController.dismiss();
              this.localService.clearToken();
              sessionStorage.clear();
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
            if (err.status === 503 || err.status === 504) {
              this.router.navigate(["/login"]);
              this.popoverController.dismiss();
              this.localService.clearToken();
              sessionStorage.clear();
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          }
        }
      )
    );
  }
  async sessionExpire() {
    this.popover = await this.popoverController.create({
      component: SessionTimeoutComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
  }

  async fileUploadError() {
    this.popover = await this.popoverController.create({
      component: FileuploadErrorComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
  }

  refreshTokens() {
    console.log("token generation started");
    this.http
      .post<any>(API_URL + "auth/re-generate", {
        refreshToken: this.localService.getJsonValue(localData.refreshToken),
      })
      .subscribe((result: any) => {
        setTimeout(() => {
          if (result.responseCode == 200) {
            this.localService.setJsonValue(localData.refreshToken, result.newRefreshToken);
            this.localService.setJsonValue(localData.token, result.newJwtToken);
            console.log("token generated");

            this.isRefreshToken = false;
          }
          this.popoverController.dismiss();
        }, 500);
      });
  }

  async sessionTimeOut() {
    this.popover = await this.popoverController.create({
      component: SessionExpiredComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      // this.timerSubscription.unsubscribe();
    });
  }

}