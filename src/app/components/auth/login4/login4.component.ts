import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { CommonService } from "../../../service/common.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as forge from "node-forge";
import { environment } from "src/environments/environment.prod";
import { ServerMaintenanceComponent } from "../../modalpage/server-maintenance/server-maintenance.component";
import { CookieService } from "ngx-cookie-service";
import { ContactAdminComponent } from "../contact-admin/contact-admin.component";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const publickey = environment.LOGIN_PUB_KEY;

@Component({
  selector: "app-login4",
  templateUrl: "./login4.component.html",
  styleUrls: ["./login4.component.scss"],
})
export class Login4Component implements OnInit {
  productName = environment.productname;
  loginForm: FormGroup;
  popover: any;
  submitted: boolean = false;
  invalidDetails: boolean = false;
  hide: boolean = true;
  images: any;
  captchaId: number;
  version: string;
  allowSignup: any;
  showSignup: boolean = true;
  captcha: any;
  serverMaintenanceData: any;
  showBanner: boolean = false;
  mobile: boolean = false;
  sdesktop: boolean = false;

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private toastr: ToastrService,
    private commonService: CommonService,
    private cookieService: CookieService,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: new FormControl("", [this.noWhitespaceValidator]),
      password: new FormControl("", [Validators.required]),
      captcha: new FormControl("", [this.noWhitespaceValidator]),
    });
    this.getcaptcha();
    this.allowPage();
    this.getServerMaintenance();
    if (window.innerWidth <= 1199) {
      this.mobile = true;
    }
    window.onresize = () => (this.mobile = window.innerWidth <= 1199);
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  getcaptcha() {
    this.commonService.captcha().subscribe(
      (result: any) => {
        if (result.responseCode == 204) {
          this.workInProgress();
        }

        this.captchaId = result["captchaId"];
        this.images = "data:image/png;base64," + result.captchaString;
        this.version = result["version"];
      },
      (err) => {
        this.workInProgress();
      }
    );
  }

  allowPage() {
    this.commonService.allowPage().subscribe((result: any) => {
      this.allowSignup = result;
      this.localService.setJsonValue(localData.allowPage, this.allowSignup);
      this.localService.setJsonValue(localData.allowSignUp, result);
      if (this.allowSignup == true) {
        this.showSignup = true;
      } else {
        this.showSignup = false;
      }
    });
  }

  gotoSignUp() {
    this.router.navigate(["/create-account"]);
    this.loginForm.reset();
  }

  alertWithSuccess() {
    Swal.fire("Thank you...", "You Login Successfully!", "success");
  }

  submit() {
    //this.ngxService.start();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.ngxService.stop();
      this.toastr.error("Please fill all required fields");
      return;
    } else {
      var rsa = forge.pki.publicKeyFromPem(publickey);
      var encryptedpassword = window.btoa(
        rsa.encrypt(this.loginForm.value.password)
      );
      this.loginForm.value.password = encryptedpassword;
      let data = {
        captchaId: this.captchaId,
        captchaValue: this.loginForm.value.captcha,
        password: this.loginForm.value.password,
        username: this.loginForm.value.username,
      };
      this.commonService.userSignIn(data).subscribe(
        (data) => {
          if (data["responseCode"] === 200) {
            this.ngxService.stop();
            this.commonService.savetoken(data.token);
            this.localService.setJsonValue(localData.token, data.token);
            this.localService.setJsonValue(localData.parentId, data.parentId);
            this.localService.setJsonValue(localData.email, data.email);
            this.localService.setJsonValue(localData.username, data.username);
            this.localService.setJsonValue(
              localData.refreshToken,
              data.refreshToken
            );
            this.localService.setJsonValue(
              localData.firstLogin,
              data.firstLogin
            );
            this.localService.setJsonValue(
              localData.docsEditor,
              data.docsEditor
            );
            this.localService.setJsonValue(
              localData.changePassword,
              data.changePassword
            );
            this.localService.setJsonValue(localData.isLogin, "true");
            this.localService.setJsonValue(localData.chatId, data.chatId);
            this.localService.setJsonValue(localData.chatToken, data.chatToken);
            this.cookieService.set("rc_token", data.chatToken);
            this.cookieService.set("rc_uid", data.chatId);
            this.loginForm.reset();
            this.router.navigate(["/user/dashboard"]);
          } else if (data["responseCode"] === 401) {
            this.ngxService.stop();
            var privateKey = forge.pki.privateKeyFromPem(
              environment.PRIVATE_KEY
            );
            this.loginForm.value.password = privateKey.decrypt(
              forge.util.decode64(this.loginForm.value.password)
            );
            this.toastr.error(data["message"]);
            this.loginForm.controls["captcha"].reset();
            this.getcaptcha();
          }
        },
        (error) => {
          this.loginForm.reset();
          this.ngxService.stop();
        }
      );
    }
  }

  forgetPassword() {
    this.forgotPass();
  }

  async forgotPass() {
    if (this.showSignup) {
      this.popover = await this.popoverController.create({
        component: ForgotPasswordComponent,
        componentProps: {},
        keyboardClose: false,
        translucent: true,
        backdropDismiss: false,
        cssClass: "custom-popupclass",
      });
      return this.popover.present();
    } else {
      this.popover = await this.popoverController.create({
        component: ContactAdminComponent,
        componentProps: {},
        keyboardClose: false,
        translucent: true,
        backdropDismiss: false,
        cssClass: "custom-popupclass",
      });
      return this.popover.present();
    }
  }

  getServerMaintenance() {
    var data = {
      description: "",
      fromDateTime: "",
      toDateTime: "",
      maintenance: "",
      orgId: 0,
      totalDuration: "",
    };

    this.commonService.getServerMaintenance(data).subscribe((result) => {
      console.log(result);
      if (result.status == 200 && result.value != "" && result.value != null) {
        this.serverMaintenanceData = JSON.parse(result.value);
        this.showBanner = true;
        this.isBannerClosed();
      } else if (result.status == 200 && result.value == null) {
        this.showBanner = false;
      }
    });
  }

  closeBanner() {
    this.showBanner = false;
    this.localService.getJsonValue(localData.bannerHidden);
  }

  formatDate(dt) {
    var options: any = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    var today = new Date(dt);

    return today.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
  }

  isBannerClosed() {
    var id = this.serverMaintenanceData.description.replace(/\s+/g, "");
    id =
      this.serverMaintenanceData?.fromDateTime +
      id +
      this.serverMaintenanceData?.toDateTime;
    var encodedString = btoa(id);
    // var decodedString = atob(encodedString);
    var getLocalBannerId = sessionStorage.getItem(localData.bannerId);
    if (getLocalBannerId == encodedString) {
      this.localService.getJsonValue(localData.bannerHidden) == "true"
        ? (this.showBanner = false)
        : (this.showBanner = true);
    } else {
      sessionStorage.removeItem(localData.bannerId);
      sessionStorage.setItem(localData.bannerId, encodedString);
      this.localService.setJsonValue(localData.bannerHidden, "false");
      console.log(id, "id", encodedString);
      this.showBanner = true;
    }
  }

  async workInProgress() {
    this.popover = await this.popoverController.create({
      component: ServerMaintenanceComponent,
      componentProps: {},
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
  }
}
