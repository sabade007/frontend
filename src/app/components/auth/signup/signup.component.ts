import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "./../../../service/common.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MatCheckbox } from "@angular/material/checkbox";
import { environment } from "src/environments/environment.prod";
import * as forge from "node-forge";
import { CoreEnvironment } from "@angular/compiler/src/compiler_facade_interface";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const valid = regex.test(control.value);
    return valid ? null : error;
  };
}

function passwordMatchValidator(control: AbstractControl) {
  const password: string = control.get("password").value;
  const confirmPassword: string = control.get("confirmPassword").value;
  if (password !== confirmPassword) {
    control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
  }
}
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  popover: any;
  invalidDetails: boolean = false;
  agreeChecked: boolean = false;
  agreeError: any;
  hide: boolean = true;
  checkbox: any;
  selected: boolean = false;
  submitted: boolean = false;
  allowSignup: any;
  useremail = sessionStorage.getItem("userEmail");
  @ViewChild("privatUserCheckbox") privatUserCheckbox: ElementRef;
  privacyPolicy: any = environment.privacyPolicy;
  eula: any = environment.eula;
  productName = environment.productname;
  mobile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private NgxService: NgxUiLoaderService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private localService: LocalService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.localService.clearToken();
    this.allowPage();
    this.signupForm = this.fb.group({
      fullName: new FormControl("", [
        Validators.required,
        Validators.pattern("[A-Za-z _-]+"),
      ]),
      userName: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9-_]+"),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        ),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("[0-9]+"),
        Validators.minLength(10),
      ]),
    });
    if (window.innerWidth <= 1199) {
      this.mobile = true;
    }
    window.onresize = () => (this.mobile = window.innerWidth <= 1199);
  }

  get signupFormControls() {
    return this.signupForm.controls;
  }

  allowPage() {
    this.commonService.allowPage().subscribe((result: any) => {
      this.allowSignup = result;
      if (!this.allowSignup) {
        this.router.navigate(["/"]);
      }
      this.localService.setJsonValue(localData.allowSignUp, result);
    });
  }

  alertWithSuccess() {
    Swal.fire(
      "Thank you...",
      "You have registered successfully! Verification link has been sent to your email ID",
      "success"
    );
    this.signupForm.reset();
  }

  Onagree(checkbox: MatCheckbox) {
    this.invalidDetails = false;
    if (checkbox.checked === false) {
      this.agreeChecked = true;
      const ele = document.getElementById("checkbox") as HTMLInputElement;
      ele.checked = true;
      if (ele.checked === true) {
        this.agreeError = " ";
      }
    } else {
      this.agreeChecked = false;
      const ele = document.getElementById("checkbox") as HTMLInputElement;
      ele.checked = false;
      if (ele.checked === false) {
        this.agreeError = "Please Agree with the terms of use";
      }
    }
  }

  signup() {
    if (this.agreeChecked === false) {
      this.agreeError = "Please Agree with the terms of use";
      this.toastr.error("Please fill all required fields");
      return;
    } else if (this.signupForm.value.phone === "0000000000") {
      this.toastr.error("Please enter a vaild phone number");
      return;
    } else {
      this.agreeError = " ";
    }
    //this.ngxService.start();
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.NgxService.stop();
      this.toastr.error("Please fill all required fields");
      return;
    } else {
      var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
      var encryptedpassword = window.btoa(
        rsa.encrypt(this.signupForm.value.password)
      );
      this.signupForm.value.password = encryptedpassword;
      let data = {
        email: this.signupForm.value.email,
        userName: this.signupForm.value.userName,
        password: this.signupForm.value.password,
        phone: this.signupForm.value.phone,
        fullName: this.signupForm.value.fullName,
      };
      this.commonService.signUp(data).subscribe(
        (data: any) => {
          if (data["responseCode"] == 200) {
            this.NgxService.stop();
            this.signupForm.reset();
            //this.alertWithSuccess();
            this.toastr.success("Account created successfully");
            this.toastr.success(
              "Verification link has been sent to your email ID"
            );
            this.router.navigate(["login"]);
            sessionStorage.removeItem("userEmail");
          } else if (data["responseCode"] == 406) {
            this.NgxService.stop();
            this.invalidDetails = true;
            // this.privatUserCheckbox['checked'] = false;
            this.signupForm.value.password = "";
          }
        },
        (error) => {
          if (error.status === 400) {
            this.privatUserCheckbox["checked"] = false;
            this.toastr.error("Full name or Username must be valid");
            this.invalidDetails = false;
          }
          this.NgxService.stop();
          this.signupForm.reset();
          this.privatUserCheckbox["checked"] = false;
        }
      );
    }
  }

  gotoLogin() {
    this.router.navigate(["login"]);
  }

  onFocusInEvent() {
    this.invalidDetails = false;
  }

  gotoSignIn() {
    this.privatUserCheckbox["checked"] = false;
    this.invalidDetails = false;
    this.agreeError = " ";
    this.signupForm.reset();
    this.router.navigate(["/login"]);
  }
}
