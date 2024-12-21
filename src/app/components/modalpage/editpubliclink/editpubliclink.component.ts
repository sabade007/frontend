import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { NavParams, PopoverController } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';
import * as forge from "node-forge";
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormControl } from '@angular/forms';
import * as moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { FilesService } from 'src/app/service/files.service';
import { COMMA, E, ENTER, F } from "@angular/cdk/keycodes";
import { DeletePublicLinkComponent } from '../delete-public-link/delete-public-link.component';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Component({
  selector: 'app-editpubliclink',
  templateUrl: './editpubliclink.component.html',
  styleUrls: ['./editpubliclink.component.scss'],
})
export class EditpubliclinkComponent implements OnInit {
 
  fileIds: any;
  getLink: any = "";
  showRestricted: boolean = false;
  restrictedDatePermission: any;
  passwordValue: any;
  passwordStatus = "REMOVE_PSWD";
  newPassword : any;
  endTime: any;
  expiryTime: any;
  dt: Date;
  passwordLenght: Number = 12;
  lowercase: Boolean = true;
  uppercase: Boolean = true;
  numbers: Boolean =  true;
  sharedListDeleted: boolean = false;
  dictionary: Array<String>;
  loginUserName = this.localService.getJsonValue(localData.username);
  fileTypes: any;
  checkboxRep: any = [];
  radioboxRep: any = [];
  allowUpload: any;
  hidedownlod1: any;
  passwordSecure: any;
  expiryDate: any;
  allowEdit: any;
  UploadOnly: any;
  readOnly:any;
  readOnly1: boolean = false;
  allowEdit1: boolean = false;
  UploadOnly1: boolean = false;
  allowfileUpload: boolean = false;
  hideDownload: boolean = false;
  showEmail: boolean = false;
  restrictedForm: any;
  public emailList = [];
  linkDetaialForm: any;
  sharedLinkId: any;
  filePermissonLink: any = "CAN_VIEW";
  note: any;
  selectedDate: any;
  emailsValues: any = [];
  removable = true;
  sharedId : any;
  pubLinkData: any ={};
  label: any;
  download: any;
  upload: any;
  minDate = new Date();
  setexpiry: boolean = false;
  hide: boolean = true;
  popover: any;
  @ViewChild("Restrictedbox") Restrictedbox: ElementRef;
  @ViewChild("DownloadHide") DownloadHide: ElementRef;
  @ViewChild("UploadAllow") UploadAllow: ElementRef;
  public separatorKeysCodes = [ENTER, COMMA];

  checkboxes = [
    {
      id: 'lowercase',
      label: 'a-z',
      library: 'abcdefghijklmnopqrstuvwxyz',
      checked: true,
    },
    {
      id: 'uppercase',
      label: 'A-Z',
      library: 'ABCDEFGHIJKLMNOPWRSTUVWXYZ',
      checked: true,
    },
    {
      id: 'numbers',
      label: '0-9',
      library: '0123456789',
      checked: true,
    },
  ];


  constructor(private navParams: NavParams,
              private commonService: CommonService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private filesService: FilesService,
              private localService: LocalService,
              private popoverController: PopoverController,) {}

  ngOnInit() {
    this.fileIds = this.navParams.data["fileId"];
    this.fileTypes = this.navParams.data["fileTypes"];
    this.sharedId = this.navParams.data["sharedId"]
    this.publicLinkDetails();
    this.permissionList();
    this.restrictedForm = this.fb.group({
      emails: this.fb.array([], [this.validateArrayNotEmpty]),
      note: new FormControl(""),
    });
    this.linkDetaialForm = this.fb.group({
      label: new FormControl(""),
    })
  }

  removeEmail(data: any): void {
    if (this.emailList.indexOf(data) >= 0) {
      this.emailList.splice(this.emailList.indexOf(data), 1);
    }
  }

  addEmails(event): void {
    if (event.value) {
      if (this.validateEmail(event.value)) {
        this.emailList.push({ value: event.value, invalid: false });
        for (let i = 1; i < this.emailList.length; i++) {
          let j = i - 1;
          if (this.emailList[j].value == event.value) {
            this.removeEmail(this.emailList[j]);
            this.toastr.error(event.value + " " + "is already exist");
          }
        }
        this.emailsValues.push(event.value);
      } else {
        this.emailList.push({ value: event.value, invalid: true });
        this.restrictedForm.controls["emails"].setErrors({
          incorrectEmail: true,
        });
      }
    }
    if (event.input) {
      event.input.value = "";
    }
  }

  private validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false },
      };
    }
    return null;
  }

  private validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  publicLinkDetails(){
    let data = {
      fileId: this.fileIds,
      shareId: this.sharedId
    };
    this.commonService.publicLinkDetails(data).subscribe((data: any) => {
      this.pubLinkData = data;
      this.getLink = data.accessLink;
      this.pubLinkData.sharing.password;
      this.label = this.pubLinkData.sharing.label;
      this.filePermissonLink = this.pubLinkData.sharing.filePermissions
      // this.note = this.pubLinkData.sharing.note;
      this.linkDetaialForm.patchValue({
        label: this.pubLinkData.sharing.label,
      })
      // this.restrictedForm.patchValue({
      //   note: this.pubLinkData.sharing.note
      // })
      this.newPassword = this.pubLinkData.sharing.password;
      this.download = this.pubLinkData.sharing.hideDownload;
      this.upload = this.pubLinkData.sharing.allowUpload;
      if (this.pubLinkData.sharing.password != "") {
        this.passwordValue = this.pubLinkData.sharing.password;
      }
      this.showEmail = false;
      this.emailList = [];
      if (data.secured == true) {
        this.showRestricted = true;
        this.Restrictedbox["checked"] = true;
      } else {
        this.showRestricted = false;
        this.Restrictedbox["checked"] = false;
      }
      if(this.download == true){
        this.hideDownload = true;
      }
      else {
        this.hideDownload = false;
      }
      if(this.upload == true){
        this.allowfileUpload = true;
      }
      else {
        this.allowfileUpload = false;
      }
      if(this.pubLinkData.sharing.filePermissions == "CAN_VIEW"){
      this.readOnly1 = true; 
      }
      else if(this.pubLinkData.sharing.filePermissions == "CAN_EDIT"){
        this.allowEdit1 = true;
      }
      else if(this.pubLinkData.sharing.filePermissions == "CAN_UPLOAD_ONLY"){
        this.UploadOnly1 = true;
      }
      if (this.pubLinkData.sharing.expriation != null) {
        this.selectedDate = this.pubLinkData.sharing.expriation;
        this.dt = new Date(this.selectedDate);
        this.dt.setDate(this.dt.getDate() - 1);
        let event: any = this.dt;
        this.expiryTime = event * 1;
      } else if (this.pubLinkData.sharing.expriation == null) {
        this.dt = null;
      }
      if (this.pubLinkData.sharing.password != null) {
        var privateKey = forge.pki.privateKeyFromPem(environment.PRIVATE_KEY);
        this.newPassword = privateKey.decrypt(
          forge.util.decode64(this.pubLinkData.sharing.password)
        );
      }
    });
  }

  OnRestricted(checkbox: MatCheckbox) {
    if (checkbox.checked === false) {
      this.showRestricted = true;
      this.generatePassword();
      console.log("checked")
    } else if (checkbox.checked === true) {
      console.log("unchecked")
      this.restrictedDatePermission = checkbox.checked;
      this.passwordValue = "";
      this.passwordStatus = "REMOVE_PSWD";
      this.newPassword = "";
      this.endTime = "";
      this.pubLinkData.sharing.password = "";
      console.log("passwordValue", this.passwordValue)
      this.expiryTime = null;
      this.dt = null;
      // this.updatePublicLinkPermissions();
      this.showRestricted = false;
    }
  }

  OnExpirySet(checkbox1: MatCheckbox){
    if (checkbox1.checked === false) {
      this.setexpiry = true;
      console.log("checked")
    } else if (checkbox1.checked === true) {
      console.log("unchecked")
      this.restrictedDatePermission = checkbox1.checked;
      this.expiryTime = null;
      this.endTime = ""
      this.dt = null;
      // this.updatePublicPermission();
      this.updatePublicLinkPermissions();
      this.setexpiry = false;
    }
  }


  updatePermissions(val: any){
    this.filePermissonLink = val;
    if(val == "CAN_UPLOAD_ONLY"){
      this.allowfileUpload = true;
      this.UploadAllow["checked"] = true;
    }
    // this.updatePublicLinkPermissions();
    console.log("updatePermissions", val)
  }

  generatePassword() {
    if (this.lowercase === false && this.uppercase === false && this.numbers === false) {
      return this.newPassword = "...";
    }

    this.dictionary = [].concat(
      this.lowercase ? this.checkboxes[0].library.split('') : [],
      this.uppercase ? this.checkboxes[1].library.split('') : [],
      this.numbers ? this.checkboxes[2].library.split('') : []
    );
    var newPassword = "";
    for (var i = 0; i < this.passwordLenght; i++) {
      newPassword += this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
    }
    this.newPassword = newPassword;
    this.OnPasswordValue1(this.newPassword);
  }

  addLabel($event){
    this.linkDetaialForm.label = $event.target.value;
    // this.updatePublicLinkPermissions();
  }

  addNote($event){
    this.restrictedForm.note = $event.target.value;
    // this.updatePublicLinkPermissions();
  }


  OnPasswordValue($event) {
    if ($event.target.value != "") {
      var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
      var encryptedpassword = window.btoa(rsa.encrypt($event.target.value));
      this.passwordValue = encryptedpassword;
      // this.updatePublicLinkPermissions();
    } else if ($event.target.value === "") {
      this.passwordValue = "";
      this.passwordStatus = "REMOVE_PSWD";
      // this.updatePublicLinkPermissions();
    }
  }

  OnPasswordValue1($event) {
    if (this.newPassword != "") {
      console.log("targetValue123",this.newPassword)
      var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
      var encryptedpassword = window.btoa(rsa.encrypt(this.newPassword));
      this.passwordValue = encryptedpassword;
      // this.updatePublicLinkPermissions();
    }
  }

  copyInputMessage(inputElement){
    let len = inputElement.value.length;
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(len, len);
  }

  getExpiryTime(event) {
    this.selectedDate = event;
    this.endTime = moment(event).format("MMM DD YYYY 23:59:59");
    this.expiryTime = event * 1;
    // this.updatePublicLinkPermissions();
  }
  
  permissionList(){
    this.commonService.permissionList(this.fileTypes).subscribe((data: any) => {
      console.log("permissionList", data)
      this.checkboxRep = data.c;
      this.allowUpload = this.checkboxRep['Allow Upload'];
      this.hidedownlod1 = this.checkboxRep['Hide Download'];
      this.passwordSecure = this.checkboxRep['Password Secured'];
      this.expiryDate = this.checkboxRep['EXPIRY_DATE'];
      console.log("allowUpload", this.allowUpload)
      this.radioboxRep = data.r;
      this.allowEdit = this.radioboxRep['Allow Editing'];
      this.UploadOnly = this.radioboxRep['File Drop(Upload Only)'];
      this.readOnly = this.radioboxRep['View Only']
    });
  }

  OnHideDownload(checkbox2: MatCheckbox){
    if (checkbox2.checked === false) {
      this.hideDownload = true;
      // this.updatePublicLinkPermissions();
      console.log("OnHideDownload", this.hideDownload)
    } else if (checkbox2.checked === true) {
      this.hideDownload = false;
      // this.updatePublicLinkPermissions();
      console.log("OnHideDownload", this.hideDownload)
    }
  }

  OnAllowUpload(checkbox3: MatCheckbox){
    if(this.filePermissonLink == "CAN_UPLOAD_ONLY"){
      this.allowfileUpload = true;
      this.UploadAllow["checked"] = false;
    }
    if (checkbox3.checked === false) {
      this.allowfileUpload = true;
      // this.updatePublicLinkPermissions();
      console.log("allowfileUpload", this.allowfileUpload)
      console.log("OnHideDownload", this.hideDownload)
    } else if (checkbox3.checked === true) {
      this.allowfileUpload = false;
      // this.updatePublicLinkPermissions();
      console.log("allowfileUpload", this.allowfileUpload)
      console.log("OnHideDownload", this.hideDownload)
    }
  }

  OnEmailSend(passwordcheckbox: MatCheckbox) {
    console.log("linkDetaialForm", this.label)
      if (passwordcheckbox.checked === false) {
        this.showEmail = true;
        let data = {  
          sharedId: this.sharedLinkId,
          label: this.linkDetaialForm.label,
          noteToRecipients: this.restrictedForm.note,
          fileType: this.fileTypes,
          expiryTime: this.expiryTime,
          password: this.passwordValue,
          hideDownload: this.hideDownload,
          allowUpload: this.allowfileUpload,
          filePermissions: this.filePermissonLink
        }
        this.commonService.updatePulicLinkPermission(data).subscribe((data: any) => {
         
        });
      } else if (passwordcheckbox.checked === true) {
        this.showEmail = false;
      }
    // }
  }

  updatePublicLinkPermissions(){
    if(this.linkDetaialForm.value.label == null || this.linkDetaialForm.value.label == '' || this.label == '' || this.label == ''){
      this.toastr.error("Please add label");
      return;
    }
    else{
      let data = {  
        sharedId: this.sharedId,
        label: this.linkDetaialForm.value.label,
        noteToRecipients: this.restrictedForm.value.note,
        fileType: this.fileTypes,
        expiryTime: this.expiryTime,
        password: this.passwordValue,
        hideDownload: this.hideDownload,
        allowUpload: this.allowfileUpload,
        filePermissions: this.filePermissonLink
      }
      this.commonService.updatePulicLinkPermission(data).subscribe((data: any) => {
        if(data.code == 200){
          this.toastr.success(data.message);
          setTimeout(() => {
            this.popoverController.dismiss();
          }, 500);
        }
      });
    }
  }

  updatelinkPermissions(){
    if(this.linkDetaialForm.value.label == null || this.linkDetaialForm.value.label == '' || this.label == '' || this.label == ''){
      this.toastr.error("Please add label");
      return;
    }
    else{
      let data = {  
        sharedId: this.sharedId,
        label: this.linkDetaialForm.value.label,
        noteToRecipients: this.restrictedForm.value.note,
        fileType: this.fileTypes,
        expiryTime: this.expiryTime,
        password: this.passwordValue,
        hideDownload: this.hideDownload,
        allowUpload: this.allowfileUpload,
        filePermissions: this.filePermissonLink
      }
      this.commonService.updatePulicLinkPermission(data).subscribe((data: any) => {
        
      });
    }
  }

  sendPulicLink() {
    if(this.linkDetaialForm.value.label == null || this.linkDetaialForm.value.label == '' || this.label == '' || this.label == ''){
      this.toastr.error("Please add label");
      return;
    }
    else if (this.emailsValues.length <= 0) {
      this.toastr.error("Please enter user email");
      return;
    } else if (this.emailsValues.length > 0) {
      // this.updatelinkPermissions();
      let emailData = {
        mailIds: this.emailsValues,
        sharingId: this.sharedId,
      };
      this.filesService.publinkSend(emailData).subscribe((result: any) => {
        this.toastr.success(result.value);
        this.emailsValues = [];
        setTimeout(() => {
          this.popoverController.dismiss();
        }, 500);
        this.emailList = [];
        this.restrictedForm.reset();
      });
    }
  }

  // sendPulicLink(){
  //   if (this.linkDetaialForm.invalid || this.linkDetaialForm.label == null || this.linkDetaialForm.label == '') {
  //     this.toastr.error("Please add label");
  //     return;
  //   }
  //   else if (this.emailsValues.length <= 0) {
  //     this.toastr.error("Please enter user email");
  //   } else if (this.emailsValues.length > 0) {
  //     let emailData = {
  //       mailIds: this.emailsValues,
  //       sharingId: this.sharedLinkId,
  //     };
  //     this.filesService.publinkSend(emailData).subscribe((result: any) => {
  //       this.toastr.success(result.value);
  //       this.emailsValues = [];
  //       setTimeout(() => {
  //         this.popoverController.dismiss();
  //       }, 500);
  //       this.emailList = [];
  //       this.restrictedForm.reset();
  //     });
  //   }
  // }

  OnsendPublicLink() {
    if(this.linkDetaialForm.value.label == null || this.linkDetaialForm.value.label == '' || this.label == '' || this.label == ''){
      this.toastr.error("Please add label");
      return;
    }
    else{
      let data = {  
        sharedId: this.sharedId,
        label: this.linkDetaialForm.value.label,
        noteToRecipients: this.restrictedForm.value.note,
        fileType: this.fileTypes,
        expiryTime: this.expiryTime,
        password: this.passwordValue,
        hideDownload: this.hideDownload,
        allowUpload: this.allowfileUpload,
        filePermissions: this.filePermissonLink
      }
      this.commonService.updatePulicLinkPermission(data).subscribe((data: any) => {
        if(data.code == 200){
          this.sendPulicLink();
        }
      });
    }
  }

  close(){
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  async deleteLink(){
    this.popover = await this.popoverController.create({
      componentProps: {
        id: this.sharedId,
      },
      component: DeletePublicLinkComponent,
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      if(data.data.closePopup === true){
        console.log(data)
        setTimeout(() => {
          this.popoverController.dismiss();
        }, 500);
      } 
    });
  }

}
