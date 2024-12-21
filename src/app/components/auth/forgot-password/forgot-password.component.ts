import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup;
  mobile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private NgxService: NgxUiLoaderService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.forgotpasswordForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
    if (window.innerWidth <= 1199) {
      this.mobile = true;
    }
    window.onresize = () => (this.mobile = window.innerWidth <= 1199);
  }

  get forgotpasswordFormControls() {
    return this.forgotpasswordForm.controls;
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  forgotpassword() {
    if (this.forgotpasswordForm.invalid) {
      this.NgxService.stop();
      this.toastr.error("Please enter valid email");
    } else {
      let data = {
        mailId: this.forgotpasswordForm.value.email,
      };
      this.commonService.forgotpassword(data).subscribe((data: any) => {
        if (data["code"] == 200) {
          this.popoverController.dismiss();
          this.toastr.success(data["message"]);
        } else if (data["code"] == 204) {
          this.toastr.error(data["message"]);
        }
      });
    }
  }
}
