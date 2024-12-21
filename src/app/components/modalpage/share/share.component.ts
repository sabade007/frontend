import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PopoverController, NavParams } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { FilesService } from "src/app/service/files.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { environment } from "src/environments/environment.prod";
import { MatCheckbox } from "@angular/material/checkbox";
import { COMMA, E, ENTER, F } from "@angular/cdk/keycodes";
import * as moment from "moment";
import * as forge from "node-forge";
import { CommonService } from "src/app/service/common.service";
import { GeneratelinkComponent } from "../generatelink/generatelink.component";
import { EditpubliclinkComponent } from "../editpubliclink/editpubliclink.component";
import { DisablAllPublicLinksComponent } from "../disabl-all-public-links/disabl-all-public-links.component";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const API_URL = environment.apiUrl;

interface Permissions {
  value: string;
  viewValue: string;
}

interface Userpermission {
  value: string;
  viewValue: string;
}

interface UserPermissions {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {

  restrictedForm: FormGroup;
  selecteduser: any[] = [];
  selectedGroup: any[] =[];
  sharePermission: ["Viewer", "Commenter", "Editors", "Make Over", "Remove"];
  permission: Permissions[] = [
    { value: "Viewer", viewValue: "Viewer" },
    { value: "Editor", viewValue: "Editor" },
  ];
  Userpermission: Userpermission[] = [
    { value: "CAN_VIEW", viewValue: "Viewer" },
    { value: "CAN_EDIT", viewValue: "Editor" },
    { value: "Remove", viewValue: "Remove Access" },
  ];
  UserPermissions: UserPermissions[] = [];
  selectedOption = "Viewer";
  pubselectedOption;
  UserSelectedOption = [];
  fileid: any = [];
  userDatas: any = {};
  userNames: any;
  userInput: any = "";
  message: any;
  usersNames: any = [];
  editPermission: boolean = false;
  isDownload: boolean = false;
  isReshare: boolean = false;
  Download: boolean = true;
  @ViewChild("username") username: ElementRef<HTMLInputElement>;
  @ViewChild("Restrictedbox") Restrictedbox: ElementRef;
  userLists: any = [];
  groupLists: any = [];
  sharedType: any;
  filePermissions: string = "CAN_VIEW";
  Accesstype: any;
  getLink: any = "";
  pubLinkData: any = {};
  showRestricted: boolean = false;
  showEmail: boolean = false;
  publicData: any;
  publicPermissions: any = "CAN_VIEW";
  passwordValue: any;
  contactemail: any;
  hide: boolean = false;
  public separatorKeysCodes = [ENTER, COMMA];
  public emailList = [];
  removable = true;
  emailsValues: any = [];
  minDate = new Date();
  expiryTime: any;
  selectedDate: any;
  password: any;
  getLinkAccess: boolean = true;
  passwordStatus: any = "CREATE_PSWD";
  title: any;
  endTime: any;
  dt: Date;
  openLock: boolean = true;
  closeLock: boolean = false;
  restrictedDatePermission: any;
  selectedfileLength: any;
  productName = environment.productname;
  isEnable: boolean = true;
  sendmail: boolean = true;
  groupDatas: any = [];
  groupId: any = [];
  userName: any = [];
  sharedlist: any;
  contactsList : any = [];
  contactCount : any;
  groupName : any;
  comment = "Hello popover !!";
  reShare: any;

  passwordLenght: Number = 12;
  newPassword: any;
  lowercase: Boolean = true;
  uppercase: Boolean = true;
  numbers: Boolean =  true;
  sharedListDeleted: boolean = false;
  dictionary: Array<String>;
  showInternalShare : boolean = true;
  showPublicLink : boolean = false;
  fileIds: any;
  allPublicLinks: any = [];
  linksCount: any;
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
  allowfileUpload: boolean = false;
  setexpiry: boolean = false;
  hideDownload: boolean = false;
  sharedLinkId: any;
  filePermissonLink: any = "CAN_VIEW";
  showNote: any;
  note: any;
  popover: any;
  loginUserName = this.localService.getJsonValue(localData.username);
  tempPermission: any;

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private toastr: ToastrService,
    private filesService: FilesService,
    private navParams: NavParams,
    private commonService: CommonService,
    private localService: LocalService,
  ) {}

  ngOnInit() {
    this.fileid = this.navParams.data["id"];
    this.fileIds = this.navParams.data["id"];
    this.sharedType = this.navParams.data["sharedType"];
    this.Accesstype = this.navParams.data["Accesstype"];
    this.title = this.navParams.data["title"];
    this.reShare = this.navParams.data["reShare"];
    this.fileTypes = this.navParams.data["fileTypes"];
    this.selectedfileLength = this.navParams.data["selectedfileLength"];
    if (this.Accesstype == "internal") {
      this.OnsharedFilesUsersList();
    } else if (this.Accesstype == "public") {
      this.OngetPublicStatus();
    }
    this.restrictedForm = this.fb.group({
      emails: this.fb.array([], [this.validateArrayNotEmpty]),
    });
  }

  onFocusInEvent(event: any) {
    this.closeLock = false;
    this.openLock = true;
  }

  onFocusOutEvent(event: any) {
    this.closeLock = true;
    this.openLock = false;
  }

  get restrictedFormControls() {
    return this.restrictedForm.controls;
  }

  setInputField(data) {
    this.userInput = data;
    this.OnfindUsers();
  }

  OnfindUsers() {
    let userData = {
      userNames: this.userInput,
    };
    this.filesService.OnFindUsers(userData).subscribe((result: any) => {
      this.userDatas = result.contacts;
      this.groupDatas = result.groups;
      
      // if(this.userDatas == ""){
      //   this.toastr.warning("You can add only " + this.productName + " users",'', { timeOut: 1000 });
      // }
      // else{
        for (let i = 0; i < this.userDatas.length; i++) {
          this.usersNames.push(this.userDatas[i].username);
          console.log("usersNames", this.usersNames)
        }
      // }
    });
  }

  OnselectPermission(value) {
    if (value == "Editor") {
      this.editPermission = true;
      this.filePermissions = "CAN_EDIT";
    }
    if (this.Accesstype == "public") {
      this.updatePublicPermission();
    }
  }

  getPerDownload() {
    this.isDownload = true;
    if (this.isDownload) {
      this.Download = false;
    } else {
      this.Download = true;
    }
  }

  getPerReshare() {
    this.isReshare = true;
  }

  OnSendMail(isEnable){
    if(isEnable === true) {
      this.sendmail = false;
      console.log("OnSendMail", this.sendmail)
    }
    else if (isEnable === false) {
      this.sendmail = true;
      console.log("OnSendMail", this.sendmail)
    }
  }

  //on select user
  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event );
    this.selecteduser.push(event.option.value[0]);
    
    if(event.option.value[1] == 'user'){
      this.userName.push(event.option.value[0].userName);
      this.userName =  [...new Set(this.userName)];
    }
    else{
      this.groupId.push(event.option.value[0].groupId);
      this.groupId =  [...new Set(this.groupId)];
    }
    console.log(this.selecteduser)
    this.username.nativeElement.value = "";
   
    this.selecteduser =  this.selecteduser.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.userName === value.userName && t.groupId === value.groupId
      ))
    )
  }

  remove(user: any): void {
    const index = this.selecteduser.indexOf(user);
    if (index >= 0) {
      this.selecteduser.splice(index, 1);
    }
    const index1 = this.groupId.indexOf(user.groupId);
    if (index1 >= 0) {
      this.groupId.splice(index, 1);
    }
    console.log(index1);
    const index2 = this.userName.indexOf(user.userName);
    if (index2 >= 0) {
      this.userName.splice(index, 1);
    }
    console.log(index2);
  }

  OnShareDoc() {
    if (this.selecteduser.length <= 0) {
      this.toastr.error("Add at-least one " + this.productName + " users");
    } 
    else if(this.userDatas.length == 0 && this.groupDatas.length == 0  && this.userInput.length > 0 && this.selecteduser.length > 0){
      this.toastr.error("You can add only " + this.productName + " users");
    }
    else if (this.selecteduser.length > 0) {
      if (this.fileid.length > 0) {
        this.fileid = this.fileid;
      } else {
        this.fileid = [this.fileid];
      }
      console.log("selected user", this.selecteduser)
      console.log("selected grup", this.selectedGroup)
      let sharedData = {
        editing: this.editPermission,
        expiryTime: 1625635967,
        fileIds: this.fileid,
        hideDownload: false,
        note: this.message,
        reSharing: this.reShare,
        userNames: this.userName,
        viewing: true,
        filePermissions: this.filePermissions,
        sendMail: this.sendmail,
        groupId: this.groupId
      };
      this.filesService.OnSharedDocs(sharedData).subscribe(
        (result: any) => {
          if(result.code   == 200){
            this.ngxService.stop();
            this.toastr.success(result.message);
            setTimeout(() => {
              this.popoverController.dismiss();
            }, 500);
          }
          else if(result.responseCode == 205){
            this.toastr.error(result.message);
          }
          else if(result.responseCode == 208){
            this.toastr.error(result.message);
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
    }
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  OnsharedFilesUsersList() {
    if (this.fileid.length > 0) {
      this.fileid = this.fileid;
    } else {
      this.fileid = [this.fileid];
    }
    let Data = {
      fileId: this.fileid,
      reSharing: false,
      sharedFile: true,
    };
    this.filesService.sharedFilesUsersList(Data).subscribe((result: any) => {
      this.ngxService.stop();
      this.sharedlist = result;
      this.userLists = result.userLists;
      console.log("userLists", result.userLists)
      this.groupLists = result.groupLists;
      console.log("groupLists", result.groupLists)
      if(this.selectedfileLength >= 2){
        this.userLists = [];
      }
      else{
        this.userLists = result;
      }
      if(result.userLists.length > 0){
        for (let i = 0; i < this.sharedlist.userLists.length; i++) {
          console.log("inside for", this.sharedlist.userLists.length)
          this.UserSelectedOption[i] = this.sharedlist.userLists[i].permissions;
          if (this.sharedlist.userLists[i].permissions == "CAN_VIEW") {
            console.log("permissions", this.sharedlist.userLists[i].permissions)
            this.sharedlist.userLists[i].viewValue = "Viewer";
          } else if (this.sharedlist.userLists[i].permissions == "CAN_EDIT") {
            console.log("permissions", this.sharedlist.userLists[i].permissions)
            this.sharedlist.userLists[i].viewValue = "Editor";
          }
        }
      }
      
      for (let i = 0; i < this.sharedlist.groupLists.length; i++) {
        this.UserSelectedOption[i] = this.sharedlist.groupLists[i].permissions;
        if (this.sharedlist.groupLists[i].permissions == "CAN_VIEW") {
          console.log("permissions", this.sharedlist.groupLists[i].permissions)
          this.sharedlist.groupLists[i].viewValue = "Viewer";
        } else if (this.sharedlist.groupLists[i].permissions == "CAN_EDIT") {
          console.log("permissions", this.sharedlist.groupLists[i].permissions)
          this.sharedlist.groupLists[i].viewValue = "Editor";
        }
      }
      if(this.sharedType == 'shares' && this.sharedListDeleted == true && result.userLists.length == 0 && this.sharedlist.groupLists.length == 0){
        this.closepopup();
      }
    });
  }

  updateTempPermission(permissions){
    this.tempPermission = permissions;
  }

  OnupdatePermissions(value, username, groupId, permissions) {
    console.log("permissions---", permissions)
    if (this.fileid.length > 0) {
      this.fileid = this.fileid;
    } else {
      this.fileid = [this.fileid];
    }
    if (value != "Remove") {
      let data = {
        expiryTime: 1626352678190,
        fileId: this.fileid,
        filePermissions: value,
        hideDownload: true,
        reSharing: true,
        username: username,
        groupId: groupId,
      };
      this.filesService.updatePermissions(data).subscribe((result: any) => {
        // if (result.code === 200) {
        //   this.toastr.success(result.message);
        // }
        // setTimeout(() => {
        //   this.popoverController.dismiss();
        // }, 500);
        this.OnsharedFilesUsersList();
        if(username == this.loginUserName && value == "CAN_VIEW"){
          console.log("Remove user");
           setTimeout(() => {
            this.popoverController.dismiss();
          }, 500);
        }
      });
    } else if (value == "Remove") {
      
      let data = {
        fileId: this.fileid,
        username: username,
        groupId: groupId,
        permission: this.tempPermission
      };
      this.filesService.removeFileUsers(data).subscribe((result: any) => {
        // this.toastr.success(result.message);
        // setTimeout(() => {
        //   this.popoverController.dismiss();
        // }, 500);
        if(result.code == 200){
          this.sharedListDeleted = true;
        }
        if(username == this.loginUserName){
          console.log("Remove user");
           setTimeout(() => {
            this.popoverController.dismiss();
          }, 500);
        }
        this.OnsharedFilesUsersList();
      });
    }
  }

  //Public sharing

  OngetPublicStatus() {
    let data = {
      fileId: this.fileid,
    };
    this.filesService.getPublicLinkStatus(data).subscribe((result: any) => {
      if (result.code === 204) {
        this.pubLinkData.password = null;
        this.getLinkAccess = false;
      } else {
        this.OngetPublicLink();
      }
    });
  }

  OnUpdateStatus(getLinkAccess) {
    if (getLinkAccess === true) {
      let data = {
        sharingId: this.pubLinkData.sharing.id,
      };
      this.filesService.getPublicLinkDisabled(data).subscribe((result: any) => {
        if (result.code == 203) {
          this.openLock = true;
          this.closeLock = false;
          this.toastr.success(result["message"]);
        }
      });
    } else if (getLinkAccess === false) {
      this.OngetPublicLink();
    }
  }

  OngetPublicLink() {
    let data = {
      fileId: this.fileid,
      filePermissions: "CAN_VIEW",
      sharingType: "EVERYONE",
    };
    this.filesService.getPublicLink(data).subscribe((result: any) => {
      this.pubLinkData = result;
      this.getLink = result.accessLink;
      this.pubLinkData.sharing.password;
      this.newPassword = this.pubLinkData.sharing.password;
      if (this.pubLinkData.sharing.password != "") {
        this.passwordValue = this.pubLinkData.sharing.password;
      }
      this.showEmail = false;
      this.emailList = [];
      if (this.pubLinkData.sharing.filePermissions === "CAN_VIEW") {
        this.pubselectedOption = "Viewer";
      } else if (this.pubLinkData.sharing.filePermissions === "CAN_EDIT") {
        this.pubselectedOption = "Editor";
      }
      if (result.secured == true) {
        this.showRestricted = true;
        this.Restrictedbox["checked"] = true;
      } else {
        this.showRestricted = false;
        this.Restrictedbox["checked"] = false;
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
        this.closeLock = true;
        var privateKey = forge.pki.privateKeyFromPem(environment.PRIVATE_KEY);
        this.newPassword = privateKey.decrypt(
          forge.util.decode64(this.pubLinkData.sharing.password)
        );
      } else {
        this.openLock = true;
      }
    });
  }

  OnRestricted(checkbox: MatCheckbox) {
    if (checkbox.checked === false) {
      this.showRestricted = true;
      console.log("checked")
    } else if (checkbox.checked === true) {
      console.log("unchecked")
      this.restrictedDatePermission = checkbox.checked;
      this.passwordValue = "";
      this.passwordStatus = "REMOVE_PSWD";
      this.newPassword = "";
      this.endTime = "";
      this.pubLinkData.sharing.password = "";
      this.expiryTime = null;
      this.dt = null;
      this.updatePublicLinkPermissions();
      this.showRestricted = false;
    }
  }

  OnEmailSend(passwordcheckbox: MatCheckbox) {
    if (passwordcheckbox.checked === false) {
      this.showEmail = true;
    } else if (passwordcheckbox.checked === true) {
      this.showEmail = false;
    }
  }

  copyInputMessage(inputElement){
    let len = inputElement.value.length;
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(len, len);
  }

  OnPasswordValue($event) {
    if ($event.target.value != "") {
      var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
      var encryptedpassword = window.btoa(rsa.encrypt($event.target.value));
      this.passwordValue = encryptedpassword;
      this.updatePublicLinkPermissions();
    } else if ($event.target.value === "") {
      this.passwordValue = "";
      this.passwordStatus = "REMOVE_PSWD";
      this.updatePublicLinkPermissions();
    }
  }

  OnPasswordValue1($event) {
    if (this.newPassword != "") {
      console.log("targetValue123",this.newPassword)
      var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
      var encryptedpassword = window.btoa(rsa.encrypt(this.newPassword));
      this.passwordValue = encryptedpassword;
      this.updatePublicLinkPermissions();
    }
  }  

  updatePublicPermission() {
    this.publicData = {
      expiryTime: this.expiryTime,
      fileId: [this.fileid],
      filePermissions: this.filePermissions,
      password: this.passwordValue,
      passwordStatus: this.passwordStatus,
    };
    this.filesService
      .updatePermissions(this.publicData)
      .subscribe((result: any) => {});
  }

  OnsendPublicLink() {
    if (this.emailsValues.length <= 0) {
      this.toastr.error("Please enter user email");
    } else if (this.emailsValues.length > 0) {
      let emailData = {
        mailIds: this.emailsValues,
        sharingId: this.pubLinkData.sharing.id,
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

  removeEmail(data: any): void {
    if (this.emailList.indexOf(data) >= 0) {
      this.emailList.splice(this.emailList.indexOf(data), 1);
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

  getExpiryTime(event) {
    this.selectedDate = event;
    this.endTime = moment(event).format("MMM DD YYYY 23:59:59");
    this.expiryTime = event * 1;
    this.updatePublicLinkPermissions();
  }

  getGroupInfo(groupId, permissions){
    console.log("hover---", groupId)
    let data = {
      groupId : groupId,
      fileId : this.fileid[0],
      permissions: permissions
    }
    this.filesService.getGroupInfo(data).subscribe((data: any) => {
      this.groupName = data.groupName;
      this.contactCount = data.contactCount;
      this.contactsList = data.contactsList;
    });
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

  OnInternalShare(){
    this.showInternalShare = true;
    this.showPublicLink = false;
  }

  OnPublicLink(){
    this.showPublicLink = true;
    this.showInternalShare = false;
    this.getAllCreatedLink();
  }

  async generateNewLink(){
    // let data = {
    //   fileId: this.fileIds,
    //   filePermissions: "CAN_VIEW",
    //   sharingType: "EVERYONE",
    // };
    // this.commonService.newPublicLink(data).subscribe((data: any) => {
    //   this.getAllCreatedLink();
    // });
    this.popover = await this.popoverController.create({
      componentProps: {
        fileId: this.fileIds,
        fileTypes: this.fileTypes,
      },
      component: GeneratelinkComponent,
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.getAllCreatedLink();
    });
  }

  getAllCreatedLink(){
    let data = {
      pageSize: 100,
      pageNumber: 1,
      sortBy:"createdAt",
      ascending: true,
      fileId: this.fileIds
    };
    this.commonService.getAllPublicLinks(data).subscribe((data: any) => {
      this.allPublicLinks = data.publicLink;
      this.linksCount = data.linksCount;
      // this.permissionList();
      console.log("data")
    });
  }

  getLinkDetails(id){
    this.sharedLinkId = id;
    console.log("link details", id)
  }

  // permissionList(){
  //   this.commonService.permissionList(this.fileTypes).subscribe((data: any) => {
  //     console.log("permissionList", data)
  //     this.checkboxRep = data.c;
  //     this.allowUpload = this.checkboxRep['Allow Upload'];
  //     this.hidedownlod1 = this.checkboxRep['Hide Download'];
  //     this.passwordSecure = this.checkboxRep['Password Secured'];
  //     this.expiryDate = this.checkboxRep['EXPIRY_DATE'];
  //     console.log("allowUpload", this.allowUpload)
  //     this.radioboxRep = data.r;
  //     this.allowEdit = this.radioboxRep['Allow Editing'];
  //     this.UploadOnly = this.radioboxRep['File Drop(Upload Only)'];
  //     this.readOnly = this.radioboxRep['View Only']
  //   });
  // }

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

  OnHideDownload(checkbox2: MatCheckbox){
    if (checkbox2.checked === false) {
      this.hideDownload = false;
      this.updatePublicLinkPermissions();
      console.log("OnHideDownload", this.hideDownload)
    } else if (checkbox2.checked === true) {
      this.hideDownload = true;
      // this.updatePublicPermission();
      this.updatePublicLinkPermissions();
      console.log("OnHideDownload", this.hideDownload)
    }
  }

  OnAllowUpload(checkbox3: MatCheckbox){
    if (checkbox3.checked === false) {
      this.allowfileUpload = false;
      this.updatePublicLinkPermissions();
    } else if (checkbox3.checked === true) {
      this.allowfileUpload = true;
      // this.updatePublicPermission();
      this.updatePublicLinkPermissions();
    }
  }

  updatePermissions(val: any){
    this.filePermissonLink = val;
    this.updatePublicLinkPermissions();
    console.log("updatePermissions", val)
  }

  OnNoteSend(checkbox4: MatCheckbox){
    if (checkbox4.checked === false) {
      this.showNote = true;
    } else if (checkbox4.checked === true) {
      this.showNote = false;
    }
  }

  onAddNote(noteToRecipient){
    if(noteToRecipient != ''){
      this.note = noteToRecipient;
      this.updatePublicLinkPermissions();
    }
  }

  updatePublicLinkPermissions(){
    let data = {  
      sharedId: this.sharedLinkId,
      label: "Testing",
      noteToRecipients: this.note,
      fileType: this.fileTypes,
      expiryTime: this.expiryTime,
      password: this.passwordValue,
      hideDownload: this.hideDownload,
      allowUpload: this.allowfileUpload,
      filePermissions: this.filePermissonLink
    }
    this.commonService.updatePulicLinkPermission(data).subscribe((data: any) => {
      console.log("data")
    });
  }

  async editPublicLinkPermission(id){
    this.popover = await this.popoverController.create({
      componentProps: {
        fileId: this.fileIds,
        fileTypes: this.fileTypes,
        sharedId: id,
      },
      component: EditpubliclinkComponent,
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.getAllCreatedLink();
    });
  }

  copyToken(){
    this.toastr.success("Link copied")
  }

  async disableAllLinks(){
    this.popover = await this.popoverController.create({
      componentProps: {
        fileId: this.fileIds,
      },
      component: DisablAllPublicLinksComponent,
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.getAllCreatedLink();
    });
  }

}
