import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";
import { ChangePasswordComponent } from "../../auth/change-password/change-password.component";
import { ContactAdminComponent } from "../../auth/contact-admin/contact-admin.component";
import { PopoverController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { FilesService } from "src/app/service/files.service";

//taiga changes
import { Inject, TemplateRef } from "@angular/core";

import { PreviewDialogService } from "@taiga-ui/addon-preview";
import { clamp, TuiSwipe } from "@taiga-ui/cdk";
import { TuiDialogContext, TuiNotificationsService } from "@taiga-ui/core";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { saveAs } from "file-saver";
import { environment } from "src/environments/environment.prod";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
const API_URL = environment.apiUrl;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  userDetails: any = [];
  storageResult: any = [];
  totalSpace: any;
  usedSpaceInBytes: any;
  usedSpaceInPercentage: any;
  units: string[];
  freeSpace: any;
  userName: string;
  fullName: any;
  phoneNumber: any;
  popover: any;
  contactImgSrc: any;
  imageSrcUpdate: string = "";
  fileUpdate: any = '';
  remove: any = false;
  nameError: any;
  disableTextbox: boolean = true;
  disabled: boolean = true;
  enable: boolean = false;
  newarr: any;
  allowSignup: boolean;
  showSignup: boolean;
  userStore: any;
  allowPage: any;
  hideChangePassword: boolean = false;
  productName = environment.productname;
  constructor(
    private fb: FormBuilder,
    private filesService: FilesService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private popoverController: PopoverController,
    private localService: LocalService,
    @Inject(PreviewDialogService)
    private readonly previewService: PreviewDialogService,
    public _d: DomSanitizer
  ) {
    route.params.subscribe((val) => {
      this.getUserDetail();
    });
    this.commonService.storeHeader("Settings / Profile Info");
    this.userName =this.localService.getJsonValue(localData.username);
  }

  ngOnInit() {
    this.allowPage =this.localService.getJsonValue(localData.allowPage);
  }

  // get user details
  getUserDetail() {
    //this.ngxService.start();
    this.commonService.userDetails().subscribe((result: any) => {
      this.ngxService.stop();
      this.userDetails = result.users;
      this.fullName = this.userDetails["fullName"];
      if(this.userDetails["phone"] == "null"){
        this.phoneNumber = "";
      }
      else{
        this.phoneNumber = this.userDetails["phone"];
      }
      this.userStore = result.users.userStore;
      if(this.userStore == 'LDAP_USER'){
        this.hideChangePassword = false;
        // this.disableTextbox = true;
      }
      else{
        this.hideChangePassword = true;
        // this.disableTextbox = false;
      }

      if (
        this.commonService.base64regex.test(this.userDetails.displayPicture) ==
        true
      ) {
        this.contactImgSrc =
          "data:image/png;base64," + this.userDetails.displayPicture;
      } else {
        this.contactImgSrc = this.userDetails.displayPicture;
      }
    });
  }

  async changePassword() {
    if(this.showSignup || this.userStore == 'SELF' || this.userStore == 'BY_ADMIN'){
    this.popover = await this.popoverController.create({
      component: ChangePasswordComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
    } else if(!this.showSignup || this.userStore == 'LDAP_USER') {
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

  //Update image
  fileChangeUpdate(e) {
    this.fileUpdate = e.srcElement.files[0];
    this.contactImgSrc = window.URL.createObjectURL(this.fileUpdate);
  }

  removeImg(){
    this.remove = true;
    this.contactImgSrc = ""; 
  }

  // Update profile
  OnUpdateProfile() {
    //this.ngxService.start();
    console.log("fileUpdate", this.fileUpdate);
    if(this.fileUpdate == ''){
      this.fileUpdate = "";
    }
    if (this.fullName == "") {
      this.nameError = "Full Name is Required";
      this.ngxService.stop();
      return;
    }
    else if(this.phoneNumber == "0000000000"){
      this.toastr.error("Please enter a valid phone number")
      return
    }
    let payload = new FormData();
    payload.append("phone", this.phoneNumber);
    payload.append("fullName", this.fullName);
    payload.append("remove", this.remove);
    payload.append("file", this.fileUpdate);
    this.commonService.updateProfile(payload).subscribe(
      (data: any) => {
        this.ngxService.stop();
        this.nameError = "";
        this.toastr.success("Profile Updated Successfully");
        this.disableTextbox = true;
        this.disabled = true;
        this.enable = false;
        // this.commonService.storeClick('click');
        this.commonService.storeUpdates("true");
        // setTimeout(() => {
        //   this.getUserDetail();
        // }, 1000);
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
  }

  OnEditProfile() {
    // this.disableTextbox = false;
    if(this.userStore == 'LDAP_USER'){
      this.disableTextbox = true;
    }
    else{
      this.hideChangePassword = true;
      this.disableTextbox = false;
    }
    this.disabled = false;
    this.enable = true;
  }
  openimage() {
    this.previewService.open(this.preview).subscribe({
      complete: () => console.info("complete"),
    });
  }
  get previewContent(): PolymorpheusContent {
    return this.contactImgSrc;
  }
}
