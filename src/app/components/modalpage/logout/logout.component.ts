import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { CookieService } from "ngx-cookie-service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ChatService } from "src/app/service/chat.service";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { CommonService } from "../../../service/common.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"],
})
export class LogoutComponent implements OnInit {
  token =this.localService.getJsonValue(localData.token)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private commonService: CommonService,
    private chatService: ChatService,
    private localService: LocalService,
    private cookie: CookieService
  ) {}

  ngOnInit() {}

  logout() {
    this.closepopup();
    this.cookie.deleteAll();
    this.localService.clearToken();
    sessionStorage.clear();
    // this.router.navigate(["login"]);
    //this.ngxService.start();
    let data = {
      expiry: 0,
      jwtToken: this.token,
    };
    this.commonService.signOut(data).subscribe((res) => {
      // this.chatService.ws.closs();
      this.closepopup();
      this.localService.clearToken();
      window.sessionStorage.clear();
      this.router.navigate(["login"]);
      setTimeout(() => {
        location.reload();
      }, 1000);
      this.ngxService.stop();
    });
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }
}
