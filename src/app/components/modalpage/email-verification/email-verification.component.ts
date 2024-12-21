import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { PopoverController } from "@ionic/angular";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { ToastrService } from "ngx-toastr";
import { MatCheckbox } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-email-verification",
  templateUrl: "./email-verification.component.html",
  styleUrls: ["./email-verification.component.scss"],
})
export class EmailVerificationComponent implements OnInit {
  emailID : any;
  showMe: boolean = false;
  resendbtn: boolean = true;
  emailUpdateForm: FormGroup;
  emailVerified: any;
  userDetails: any = [];
  sentbtn: boolean = false;
  token =this.localService.getJsonValue(localData.token)
  productName = environment.productname;
  
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private localService: LocalService
  ) {}

  ngOnInit() {
    this.emailUpdateForm = this.fb.group({
      newEmail: new FormControl("", [Validators.required, Validators.email]),
    });
    this.getUserDetail();
  }

  get emailUpdateFormControls() {
    return this.emailUpdateForm.controls;
  }

  sendEmail() {
    //this.ngxService.start();
    this.commonService.emailVerification().subscribe((result: any) => {
      if (result["responseCode"] === 200) {
        this.toastr.success(result["message"]);
        this.ngxService.stop();
        this.sentbtn = true;
        this.resendbtn = false;
        // this.closepopup();
      } else if (result["responseCode"] === 203) {
        this.ngxService.stop();
        this.sentbtn = true;
        this.resendbtn = false;
        console.log("sentbtn", this.sentbtn)
        // this.closepopup();
        this.toastr.error(result["message"]);
      }
    });
  }

  OnSelect(checkbox: MatCheckbox) {
    if (checkbox.checked === false) {
      this.showMe = true;
      this.resendbtn = false;
    } else if (checkbox.checked === true) {
      this.showMe = false;
      this.resendbtn = true;
      this.emailUpdateForm.reset();
    }
  }

  changeEmail() {
    //this.ngxService.start();
    if (this.emailUpdateForm.invalid) {
      //this.ngxService.start();
      return;
    } else {
      this.commonService
        .emailUpdate(this.emailUpdateForm.value)
        .subscribe((result: any) => {
          if (result["responseCode"] === 200) {
            this.ngxService.stop();
            this.toastr.success(result["message"]);
            this.AllselectCheckbox["checked"] = false;
            this.showMe = false;
            this.emailUpdateForm.reset();
            this.getUserDetail();
          } else if (result["responseCode"] === 406) {
            this.ngxService.stop();
            this.toastr.error(result["message"]);
          }
        });
    }
  }

  getUserDetail(){
    this.commonService.userDetails().subscribe((result: any) => {
      this.ngxService.stop();
      this.userDetails = result.users;
      this.emailID = this.userDetails.email;
      console.log("email", this.emailID)
    });
  }

  checkverify() {
    this.commonService.userDetails().subscribe((result: any) => {
      this.ngxService.stop();
      this.userDetails = result.users;
      if(this.userDetails.emailVerified == false){
        this.toastr.warning("Please Verify your Email ID")
      }
      if(this.userDetails.emailVerified == true){
        this.closepopup();
        this.commonService.storetourguide(true);
        // if (this.commonService.refreshCount == 1) {
        //   setTimeout(() => {
        //     location.reload();
        //     this.ngxService.stop();
        //   }, 100);
        // }
      }
    });
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  back(){
    this.AllselectCheckbox["checked"] = false;
    this.emailUpdateForm.reset();
    this.showMe = false;
  }

  logout() {
    this.closepopup();
    this.localService.clearToken();
    // this.router.navigate(["login"]);
    //this.ngxService.start();
    let data = {
      expiry: 0,
      jwtToken: this.token,
    };
    this.commonService.signOut(data).subscribe((res) => {
      this.closepopup();
      this.localService.clearToken();
      this.router.navigate(["login"]);
      setTimeout(() => {
        location.reload();
      }, 1000);
      this.ngxService.stop();
    });
  }
}
