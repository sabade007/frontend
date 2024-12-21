import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { CommonService } from "../../../service/common.service";

@Component({
  selector: "app-session-timeout",
  templateUrl: "./session-timeout.component.html",
  styleUrls: ["./session-timeout.component.scss"],
})
export class SessionTimeoutComponent implements OnInit {

  token =this.localService.getJsonValue(localData.token)

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private localService: LocalService,
  ) {}

  ngOnInit() {
    // this.sessionTimeOut();
  }

  logout() {
    this.closepopup();
    this.localService.clearToken();
    sessionStorage.clear();
    let data = {
      expiry: 0,
      jwtToken: this.token,
    };
    this.commonService.signOut(data).subscribe((res) => {
      this.closepopup();
      this.localService.clearToken();
      sessionStorage.clear();
      this.router.navigate(["login"]);
      setTimeout(() => {
        location.reload();
      }, 1000);
      this.ngxService.stop();
    });
  }

  closepopup() {
    let refreshtoken = this.localService.getJsonValue(localData.refreshToken);
    let data = {
      refreshToken: refreshtoken,
    };
    if(refreshtoken == null){
      this.router.navigate(["/login"]);
      this.popoverController.dismiss();
      this.localService.clearToken();
      sessionStorage.clear();
    }
    else{
      this.commonService.getrefereshtoken(data).subscribe((result: any) => {
        setTimeout(() => {
          if(result.responseCode == 200) {
            this.localService.setJsonValue(localData.refreshToken, result.newRefreshToken);
            this.localService.setJsonValue(localData.token, result.newJwtToken);
          }
          this.popoverController.dismiss();
        }, 500);
      });
    }
  }

  // sessionTimeOut() {
  //   this.commonService.sessionTimeOut().subscribe((result: any) => {});
  // }

}
