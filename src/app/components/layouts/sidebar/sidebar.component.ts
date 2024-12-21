import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Renderer2,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute, NavigationEnd, Router, Event } from "@angular/router";
import { MatMenuTrigger } from "@angular/material/menu";
import { PopoverController } from "@ionic/angular";
import { CommonService } from "src/app/service/common.service";
import { LogoutComponent } from "./../../modalpage/logout/logout.component";
import { FilesService } from "src/app/service/files.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as moment from "moment";
import { EmailVerificationComponent } from "../../modalpage/email-verification/email-verification.component";
import { ToastrService } from "ngx-toastr";
import { ChangePasswordComponent } from "../../auth/change-password/change-password.component";
import { Subscription } from "rxjs";
import { interval as observableInterval } from "rxjs";
import { takeWhile, scan, tap } from "rxjs/operators";
import { NotificationModelComponent } from "../../modalpage/notification-model/notification-model.component";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { environment } from "src/environments/environment.prod";
import { DailogPopUpComponent } from "../../modalpage/dailog-pop-up/dailog-pop-up.component";
import { localData, mimetypes } from "src/environments/mimetypes";
import { ChatComponent } from "../../chat/chat.component";
import { ChatService } from "src/app/service/chat.service";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { Howl, Howler } from "howler";
import { CookieService } from "ngx-cookie-service";
export interface FileName {
  name: string;
}
import { MatDialog } from "@angular/material/dialog";
import { ContactAdminComponent } from "../../auth/contact-admin/contact-admin.component";
import { LocalService } from "src/environments/local.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @ViewChild(ChatComponent) chatcomponent: ChatComponent;

  name: any = "123";
  popover: any;
  userName: string;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  screenWidth: number;
  screenHeight: number;
  hideMobileMode: boolean;
  islogo = true;
  showSubMenu;
  showPhotoMenu: boolean = false;
  mimes = mimetypes;
  UpgradeStorage =  environment.upgradeStorage;
  productName = environment.productname;
  newFolder: boolean = false;
  newTextDoc: boolean = false;
  newDoc: boolean = false;
  newSpreadsheet = false;
  newPresentation = false;
  newFolderName: any;
  public selectedFile: any = File;
  parentId = this.localService.getJsonValue(localData.parentId);
  email = this.localService.getJsonValue(localData.email);
  uploadedFile: any = [];
  uploadedFolder: any = [];
  uploadedDocuments: any = [];
  uploadedDocumentsLength: any;
  uploadedFolderLength: any;
  changePassword: any;

  allnotifications: any = [];
  userDetails: any = [];
  // emailVerified: boolean;
  dissmissNoti: any = [];
  allnotificationsLength: any;
  deviceMode: boolean;
  storageResult: any = [];
  totalSpace: any;
  readableTotalSpace: any;
  usedSpaceInBytes: any;
  usedSpaceInPercentage: any;
  units: string[];
  freeSpace: any;
  subscription: Subscription;
  subscriptionUpdates: Subscription;
  subscriptionRoomId: Subscription;
  notificationValue: any;
  notificationCount: any;
  subscriptionHeader: Subscription;
  subScriptionBackVal: Subscription;
  subscriptionUploadData: Subscription;
  subscriptionStorageinfo: Subscription;
  header: any;
  searchValue: any = "";
  currentPath: string;
  emptySearch: boolean = true;
  empty: any;
  searchedFile: any[];
  pageSize: number = 5;
  pageNumber: number = 1;
  countFileLength: any = [];
  loadMore: boolean = true;
  contactImgSrc: string;
  multiUploadedFiles: any = [];
  showFiller = false;
  uploadLoader: boolean = false;
  dropUploadLoader: boolean = false;
  UploadProgress: boolean = false;
  Uploadcompleted: boolean = false;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  dropUploadedFiles: any = [];
  OntogglePopup: boolean = true;
  usedspace: any;
  SpaceUsed: any;
  linkForm: FormGroup;
  linklist: boolean = true;
  cretelink: boolean = false;
  applist: any = [];
  edit: boolean = false;
  bookmarkLength: any;
  favicon: any = [];
  iconsrc: any;
  storageObject: any = [];
  storageValueInPercentage: any;
  storageValueInNumber: any;
  spaceinpercent: any;
  openMenu: boolean = false;
  openNotification: boolean = false;
  readableUsedSpace: any;
  prosTotalStorage: any;
  prosUsedStorage: any;
  prosValue: number;
  fullName: any;
  showBanner: boolean = false;
  serverMaintenanceData: any;
  orgId: any;
  userId: string;
  userToken: string;
  token: string;
  chatLists: any;
  groupList: any;
  subId: any;
  roomIds: any;
  tune: any;
  tune2: any;
  listener: any;
  // premiumSubscription: any = environment.premium_subscription;
  premiumSubscription: boolean = true;
  workSpaceEnable: any = environment.workSpaceEnable;
  showUpgradeStorage : boolean;
  allowPage: any;
  showNotificationDropdown: boolean = false;
  userStore: any;
  showChat: boolean = false;
  maintananceConfigName: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    public dialog: MatDialog,
    private filesService: FilesService,
    private popoverController: PopoverController,
    private commonService: CommonService,
    private toastr: ToastrService,
    public chatService: ChatService,
    private renderer: Renderer2,
    private cookieService: CookieService,
    private localService: LocalService
  ) {
    // router.events.subscribe((event: Event)=>{
    //   if (event instanceof NavigationEnd) {
    //     // this.getRoomIds();
    //     // this.subscribeToChats();
    //     this.connectOnRoutChange();
    //   }
    // });
    route.params.subscribe((val) => {
      this.getUserDetail();
      this.getStorageInfo();
      this.userId = this.localService.getJsonValue(localData.chatId);
      this.userToken = this.localService.getJsonValue(localData.chatToken);
      this.token =this.localService.getJsonValue(localData.token);

      if (this.premiumSubscription == true) {
        this.premiumComponents();
      }
      // this.getNotification();
      // this.multiUploadedFiles.push(this.commonService.getUploadProgress());

      // if (this.multiUploadedFiles.length != 0) {
      //   for (let i = 0; i < this.multiUploadedFiles.length; i++) {
      //     if (this.multiUploadedFiles[i].percentDone > 0 || this.multiUploadedFiles[i].percentDone == 100) {
      //       this.uploadLoader = true;
      //     }
      //     if (this.multiUploadedFiles[i].percentDone < 100) {
      //       this.headerUploadProgress = true;
      //       this.headerUploadcompleted = false;
      //     } else if (this.multiUploadedFiles[i].percentDone == 100) {
      //       this.headerUploadcompleted = true;
      //       this.headerUploadProgress = false;
      //     }
      //   }
      // }

      // this.dropUploadedFiles.push(this.commonService.getdragnDropProgress());
      // if (this.dropUploadedFiles.length != 0) {
      //   for (let i = 0; i < this.dropUploadedFiles.length; i++) {
      //     if (this.dropUploadedFiles[i].percentDone > 0 || this.dropUploadedFiles[i].percentDone == 100) {
      //       this.dropUploadLoader = true;
      //     }
      //     if (this.dropUploadedFiles[i].percentDone < 100) {
      //       this.headerUploadProgress = true;
      //       this.headerUploadcompleted = false;
      //     } else if (this.dropUploadedFiles[i].percentDone == 100) {
      //       this.headerUploadcompleted = true;
      //       this.headerUploadProgress = false;
      //     }
      //   }
      // }
      // if (this.commonService.getCancelProgress() == 'true') {
      //   this.dropUploadLoader = false;
      //   this.dropUploadedFiles = [];
      //   this.uploadLoader = false;
      //   this.multiUploadedFiles = [];
      // }
    });

    this.subscription = this.commonService
      .getNotification()
      .subscribe((message) => {
        this.notificationValue = message;
      });
    this.subscriptionHeader = this.commonService
      .getHeader()
      .subscribe((headerValue) => {
        this.header = headerValue;
        // this.getNotification();
      });

    this.subscriptionStorageinfo = this.commonService
      .getStorageinfo()
      .subscribe(() => {
        this.getStorageInfo();
      });

    this.subScriptionBackVal = this.commonService
      .getBackBtnVal()
      .subscribe((val) => {
        if (val == "true") {
          this.showSubMenu = "";
        }
      });

    this.subscription = this.commonService.getClick().subscribe((message) => {
      if (message == "click") {
        document.getElementById("searchDiv").style.display = "none";
        this.searchValue = "";
        this.searchedFile = [];
        this.countFileLength = [];
      }
    });

    this.subscriptionUpdates = this.commonService
      .getUpdates()
      .subscribe((message) => {
        this.getUserDetail();
      });
    this.allowPage =this.localService.getJsonValue(localData.allowPage);

    this.subscriptionRoomId = this.commonService.getRoomId().subscribe(() => {
      this.connectOnRoutChange();
    });

  }

  ngOnInit() {
    this.getNotification();
    this.getDashboardInfo();
    if(this.UpgradeStorage == false){
      this.showUpgradeStorage = false;
    }
    else if(this.UpgradeStorage == true){
      this.showUpgradeStorage = true;
    }
    this.linkForm = this.fb.group({
      link: new FormControl("", [Validators.required]),
      URL: new FormControl("", [Validators.required]),
    });

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.mobileMode();
    // this.getStorageInfo();
    this.getbookmarks();
    this.userName = this.localService.getJsonValue(localData.username);
    this.usedspace = this.localService.getJsonValue(localData.usedSpaceInBytes)
    // this.getStorageInfo();
    if (this.premiumSubscription == true) {
      this.establishChatConnection();
    }
    this.allowPage = this.localService.getJsonValue(localData.allowPage)
  }
  premiumComponents() {
    console.log(this.premiumSubscription, environment.premium_subscription);
    this.addListener();
    this.getRoomIds();
    this.subscribeToChats();
  }

  addListener() {
    this.listener = this.renderer.listen(document, "click", (event) => {
      const targetEl = event.target as HTMLElement;
      const clickedOutside =
        targetEl.innerHTML.search("reconnect") > 0 ? true : false;
      clickedOutside ? console.log("click") : this.connectOnRoutChange();
    });
  }

  connectOnRoutChange() {
    let metaData = {
      userId: this.userId,
      userToken: this.userToken,
      toId: "",
      messages: "",
      roomId: "",
      searchName: "",
      fileName: "",
      path: "",
    };
    if (this.localService.getJsonValue(localData.isLogin)) {
      this.chatService.getAllRoomId(metaData).subscribe((result: any) => {
        this.roomIds = result;
        this.subscribeToChats();
      });
    }
  }

  establishChatConnection() {
    this.chatService.ws = new SockJS(environment.apiUrl+'ichat');
    this.chatService.stompClient = Stomp.over(this.chatService.ws);
    let that = this;
    this.chatService.stompClient.connect({}, function (frame) {
      that.subscribeToChats();
      console.log("connected",frame);
    });
  }
  getRoomIds() {
    let metaData = {
      userId: this.userId,
      userToken: this.userToken,
      toId: "",
      messages: "",
      roomId: "",
      searchName: "",
      fileName: "",
      path: "",
    };
    this.chatService.getChatList(metaData).subscribe((result: any) => {
      this.chatLists = result;
      console.log("chatLists", this.chatLists)
    });
    this.chatService.getAllGroup(metaData).subscribe((result: any) => {
      this.groupList = result;
    });
    this.chatService.getAllRoomId(metaData).subscribe((result: any) => {
      this.roomIds = result;
    });
  }

  get linkFormControls() {
    return this.linkForm.controls;
  }

  subscribeToChats() {
    this.roomIds?.forEach((id) => {
      var subscribed = this.chatService.subscribedRoomIds.includes(id);
      if (!subscribed) {
        this.openSocket(id);
        this.chatService.subscribedRoomIds.push(id);
        console.log(id);
      }
    });
  }

  openSocket(roomId) {
    if (true) {
      this.subId = this.chatService.stompClient.subscribe(
        "/channel/" + roomId,
        (message) => {
          let messageResult: any = JSON.parse(message.body);
          if (
            messageResult.roomId !== this.chatService.roomId &&
            messageResult.message != "..." 
          ) {
            console.log("notifi");
            this.chatService.tune1.play();
            this.showNotification(message);
            this.chatService.sendMessage(message);
          } else if (
            messageResult.roomId == this.chatService.roomId &&
            messageResult.message != "..."
          ) {
            console.log("msg", message);
            this.chatService.tune2.play();
            this.chatService.sendMessage(message);
          } else if (
            messageResult.message == "..." &&
            messageResult.userId != this.userId
          ) {
            console.log(messageResult.userId + " is typing");
            this.chatService.sendTypingIndicator(true);
          }
        }
      );
    }
  }
  // this.chatService.stompClient.unsubscribe(
  //   "/channel/sdnihduisjh");
  showNotification(message: any) {
    console.log("not1")
    var notifiTo;
    let messageResult: any = JSON.parse(message.body);
    console.log("notification", messageResult)
    this.chatLists.find(function (item, i) {
      if (item.toId === messageResult.userId) {
        console.log("sender name", item.name)
        notifiTo = item.name;
      }
    });
    console.log(messageResult.userId);
    if (!notifiTo) {
      this.groupList.find(function (item, i) {
        if (item.toId === message.userId) {
          notifiTo = item.fname;
        }
      });
    }
    let metaData = {
      userId: this.userId,
      userToken: this.userToken,
      toId: "",
      messages: "",
      roomId: "",
      searchName: "",
      fileName: "",
      path: "",
    };
    this.chatService.getChatList(metaData).subscribe((result: any) => {
      this.chatLists = result;
      this.chatService.storeChatList("true");
      console.log("chatLists", this.chatLists)
    });
    console.log(notifiTo);
    if(this.showChat == false){
      this.toastr.success("New message from " + notifiTo);
      // this.toastr.info("New message from " + notifiTo);
    }
  }

  OnClickFunction() {
    document.getElementById("searchDiv").style.display = "none";
    this.commonService.storeClick("click");
    this.searchValue = "";
  }

  OnClickPath() {
    this.commonService.storePath("path");
  }

  @ViewChild(MatMenuTrigger) ddTrigger: MatMenuTrigger;
  @ViewChild("sidenav") sidenav: MatSidenav;

  @HostListener("window:onresize", ["$event"])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.mobileMode();
  }

  mobileMode() {
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
    } else if (this.screenWidth <= 1024) {
      this.hideMobileMode = true;
    } else {
      this.hideMobileMode = false;
    }
  }

  toggleMobileMenu() {
    this.hideMobileMode = !this.hideMobileMode;
    this.deviceMode = !this.deviceMode;
    if (this.screenWidth <= 770) {
      !this.isExpanded;
    } else {
      this.isExpanded = !this.isExpanded;
    }
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
      this.islogo = false;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
      this.islogo = true;
    }
  }

  toggleMenu(val: string) {
    if (val == "file") {
      this.showSubMenu = "file";
    } else if (val == "photo") {
      this.showSubMenu = "photo";
    } else {
      this.showSubMenu = "";
    }
  }

  toggleFiles() {
    var menu = document.getElementById("subFiles");
    if (menu.style.display === "none") {
      this.showSubMenu = true;
      menu.style.display = "block";
    } else {
      this.showSubMenu = false;
      menu.style.display = "none";
      this.router.navigate(["/user/dashboard"]);
    }
  }

  goToDashboard() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/dashboard"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/dashboard"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoAllFiles() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/files/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/files/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoFavoriteFiles() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/files/favorite"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/files/favorite"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoAllPhotos() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/photos/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/photos/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoFavoritePhotos() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/photos/favorite"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/photos/favorite"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoShared() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/shared/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/shared/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoActivity() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/activity/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/activity/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoContacts() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/contacts"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/contacts"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  gotoWorkSpace(){
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/workSpace"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/workSpace"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }
  
  gotoTrash() {
    this.showChat = false;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(["/user/trash/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(["/user/trash/all"]);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

  togglePhotos() {
    var menu = document.getElementById("subphotos");
    if (menu.style.display === "none") {
      this.showSubMenu = true;
      menu.style.display = "block";
    } else {
      this.showSubMenu = false;
      menu.style.display = "none";
      this.router.navigate(["/user/dashboard"]);
    }
  }

  settings() {
    this.router.navigate(["dashboard/profile"]);
  }

  logout() {
    this.sessionExpire();
  }

  emailVerications() {
    this.emailVerication();
  }

  scrollToElement(el): void {
    const duration = 600;
    const interval = 5;
    const moveEl = (el.scrollTop * interval) / duration;

    observableInterval(interval)
      .pipe(
        scan((acc, curr) => acc - moveEl, el.scrollTop),
        tap((position) => (el.scrollTop = position)),
        takeWhile((val) => val > 0)
      )
      .subscribe();
  }

  scrollTop(el) {
    el.scrollTop = 0;
  }

  dontClose() {
    this.sidenav.disableClose = true;
    setTimeout(() => (this.sidenav.disableClose = false));
  }

  async sessionExpire() {
    this.popover = await this.popoverController.create({
      component: LogoutComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
  }

  async emailVerication() {
    this.popover = await this.popoverController.create({
      component: EmailVerificationComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
  }

  async changepassword() {
    this.popover = await this.popoverController.create({
      component: ChangePasswordComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    return this.popover.present();
  }

  viewAllNotification() {
    this.router.navigate(["/user/allnotifications"]);
    this.showNotificationDropdown = false;
  }
  // get user details
  getUserDetail() {
    //this.ngxService.start();
    this.commonService.userDetails().subscribe((result: any) => {
      console.log("sidebarprofiles");
      this.ngxService.stop();
      this.orgId = result.orgId;
      this.userDetails = result.users;
      this.fullName = result.users.fullName;
      this.userStore = result.users.userStore;
      this.localService.setJsonValue(localData.userStore, this.userStore)

      if (
        this.commonService.base64regex.test(this.userDetails.displayPicture) ==
        true
      ) {
        this.contactImgSrc =
          "data:image/png;base64," + this.userDetails.displayPicture;
      } else {
        this.contactImgSrc = this.userDetails.displayPicture;
      }

      // this.contactImgSrc = result.users.displayPictureThumbNail;
      this.localService.setJsonValue(localData.email, this.userDetails.email);
      this.changePassword = this.localService.getJsonValue(localData.changePassword);
      this.getServerMaintenance();
      if (this.userDetails.emailVerified == false) {
        this.emailVerication();
      } else if (
        this.userDetails.emailVerified == true &&
        this.changePassword == true
      ) {
        this.changepassword();
        console.log("---changePassword---");
      }
    });
  }

  // Get All notification
  getNotification() {
    this.commonService.getNotifications().subscribe((result: any) => {
      this.showNotificationDropdown = true;
      this.allnotifications = result;
      this.allnotificationsLength = this.allnotifications.length;
      for (let i = 0; i < this.allnotifications.length; i++) {
        this.allnotifications[i].timestamp = moment(
          this.allnotifications[i].timestamp
        ).format("DD/M/YYYY hh:mm A");
      }
      this.subscription = this.commonService
        .getNotification()
        .subscribe((message) => {
          this.notificationValue = message;
        });
      this.getDashboardInfo();
    });
  }

  ChatFeature: string;

  // Get  Storage info
  getDashboardInfo() {
    this.commonService.getDashboardInfos().subscribe((result: any) => {
      let dashboardResult = result;
      // sessionStorage.setItem(localData.uploadedFileLimit, result.limit);
      this.ChatFeature = result.features[0]['Chat'];
      if(this.ChatFeature === 'Enabled'){
        this.premiumSubscription = true;
      }else{
        this.premiumSubscription = false;
      }
      this.localService.setJsonValue(localData.chatFeature, this.ChatFeature);
      console.log("ChatFeature", this.ChatFeature);
      this.commonService.storeNotification(
        dashboardResult.numberOfNotifications
      );
    });
  }

  //Dissmiss All Notification
  clearAllNotification() {
    //this.ngxService.start();
    this.commonService.dismissAllNotifications().subscribe((result: any) => {
      if (result["code"] == 200) {
        this.ngxService.stop();
        this.toastr.success(result["message"]);
        this.getNotification();
      }
      this.ngxService.stop();
    });
  }

  //Dissmiss Notification By ID
  async dismissAllNotificationById(items, id, value, objectType) {
    this.popover = await this.popoverController.create({
      component: NotificationModelComponent,
      componentProps: {
        message: items.message,
        status: items.status,
        subject: items.subject,
      },
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.dissmissNoti = {
        id: id,
        status: value,
      };
      //this.ngxService.start();
      this.commonService
        .dismissAllNotificationById(this.dissmissNoti)
        .subscribe((result: any) => {
          this.ngxService.stop();
          if (result["code"] == 200) {
            this.ngxService.stop();
            if (value === "VIEWED_AND_READ" && objectType === "FILE_SHARED") {
              this.router.navigate(["/user/shared/all"]);
            } else if (value === "DELETED") {
              this.toastr.success(result["message"]);
            }
            this.getNotification();
            this.ngxService.stop();
          }
        });
    });
  }

  getConvertGb(bytes, decimals = 2) {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) / k + " GB";
  }

  getConvert(bytes, decimals = 2) {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) / k;
  }

  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // Get  Storage info
  getStorageInfo() {
    //this.ngxService.start();
    this.commonService.getStorageInfos().subscribe((result: any) => {
      this.ngxService.stop();
      this.storageResult = result;
      this.readableTotalSpace = result.readableTotalSpace;
      this.readableUsedSpace = result.readableUsedSpace;
      this.prosTotalStorage = result.totalSpace;
      this.prosUsedStorage = result.usedSpaceInBytes;
      this.prosValue = this.prosUsedStorage / this.prosTotalStorage;
      this.SpaceUsed = this.getConvert(this.storageResult.totalSpace);
      this.freeSpace =
        this.storageResult.totalSpace - this.storageResult.usedSpaceInBytes;
      this.freeSpace = this.getReadableFileSizeString(this.freeSpace);
      this.totalSpace = this.getConvertGb(this.storageResult.totalSpace);
      this.storageResult.totalSpace = this.totalSpace;

      this.usedSpaceInBytes = this.getReadableFileSizeString(
        this.storageResult.usedSpaceInBytes
      );
      this.storageResult.usedSpaceInBytes = this.usedSpaceInBytes;
      var totalSpace1 = this.totalSpace;
      var trimTotalSpace = totalSpace1.match(/\d/g).join("");

      //Getting storage values
      this.usedSpaceInPercentage =
        this.storageResult.usedSpaceInPercentage.toFixed(1);
      this.storageResult.usedSpaceInPercentage = this.usedSpaceInPercentage;
      this.storageValueInNumber = (
        parseInt(this.usedSpaceInBytes) / 1024
      ).toFixed(1);
      this.storageValueInPercentage = this.usedSpaceInPercentage;
    });
  }
  getshowAllFiles(parentId) {
    //this.ngxService.start();
    this.commonService.getshowAllFiles(parentId).subscribe((result: any) => {
      this.ngxService.stop();
      this.uploadedFile = result.childern;
      this.uploadedFolderLength = this.uploadedFolder.length;
      this.uploadedDocumentsLength = this.uploadedDocuments.length;
      for (let i = 0; i < this.uploadedDocuments.length; i++) {
        this.uploadedDocuments[i].icon =
          "data:image/png;base64," + this.uploadedDocuments[i].icon;
      }
      for (let i = 0; i < this.uploadedFolder.length; i++) {
        this.uploadedFolder[i].modifiedAt = moment(
          this.uploadedFolder[i].modifiedAt
        ).format("DD MMM YYYY");
      }
    });
  }

  OnSearchValue(searchValue) {
    this.searchValue = searchValue;
    if (searchValue.length >= 2) {
      this.emptySearch = false;
      let data = {
        fileTitle: searchValue,
        pageNb: this.pageNumber,
        step: this.pageSize,
      };
      this.commonService.gobalSearch(data).subscribe(
        (data: any) => {
          this.searchedFile = data;
          document.getElementById("searchDiv").style.display = "block";
          for (let i = 0; i < this.searchedFile.length; i++) {
            // if (
            //   this.commonService.base64regex.test(this.uploadedFile[i].icon) ==
            //   true
            // ) {
            //   this.uploadedFile[i].icon =
            //     "data:image/png;base64," + this.uploadedFile[i].icon;
            // }
            this.searchedFile[i].modifiedAt = moment(
              this.searchedFile[i].modifiedAt
            ).fromNow();
            let mimeType = this.searchedFile[i].mimeType;
            if (!mimetypes[mimeType]) {
              this.searchedFile[i].mimeType = "UNKNOWN";
            }
          }
          if (data.code == 406) {
            document.getElementById("searchDiv").style.display = "none";
          }
        },
        (error) => {
          if (error.status == 500) {
            this.emptySearch = false;
            this.searchedFile.length = 0;
          }
        }
      );
    } else {
      this.pageSize = 5;
      this.emptySearch = true;
      this.searchedFile = [];
      this.countFileLength = [];
      document.getElementById("searchDiv").style.display = "none";
    }
  }

  OncancelSearch() {
    this.pageSize = 5;
    this.emptySearch = true;
    this.searchedFile = [];
    this.countFileLength = [];
    document.getElementById("searchDiv").style.display = "none";
  }

  OngetMoreFiles() {
    this.pageSize += 5;
    document.getElementById("searchDiv").style.display = "block";
    this.OnSearchValue(this.searchValue);
    for (let i = 0; i < this.countFileLength.length; i++) {
      if (this.countFileLength[i] == this.searchedFile.length) {
        this.loadMore = false;
      }
    }
    this.countFileLength.push(this.searchedFile.length);
  }

  openSearchedFile(value) {
    this.router.navigate(["/user/searched-results"]);
    this.localService.setJsonValue(localData.searchedId, value);
    this.commonService.storeSearchedValue(value);
    document.getElementById("searchDiv").style.display = "none";
    this.searchValue = "";
    this.searchedFile = [];
    this.countFileLength = [];
  }

  OnCloseSearchedDiv() {
    document.getElementById("searchDiv").style.display = "none";
    this.searchValue = "";
    this.searchedFile = [];
    this.countFileLength = [];
  }

  OnClickAdd() {
    this.linklist = false;
    this.cretelink = true;
  }

  back() {
    this.linklist = true;
    this.cretelink = false;
    this.edit = false;
    this.linkForm.reset();
  }

  save() {
    let data = {
      url: this.linkForm.value.URL,
      linkName: this.linkForm.value.link,
      mimeType: "link",
      parentId: this.parentId,
    };
    this.commonService.createbookmarks(data).subscribe((result: any) => {
      if (result["responseCode"] == 201) {
        this.getbookmarks();
        this.linklist = true;
        this.cretelink = false;
        this.edit = false;
        this.linkForm.reset();
      }
    });
  }

  getbookmarks() {
    this.commonService.getbookmarks().subscribe((result: any) => {
      this.applist = result.content;
      this.bookmarkLength = result.totalElements;
      for (let i = 0; i < this.applist.length; i++) {
        this.favicon = result.content[i].icon;
        this.applist[i].iconsrc = result.content[i].icon;
      }
      this.edit = false;
    });
  }

  OnClearbookmark(id: any) {
    this.commonService.deletebookmarks(id).subscribe((result: any) => {
      if (result.responseCode == 200) {
        this.getbookmarks();
        this.toastr.success(result.message);
      }
    });
  }

  getbook() {
    this.edit = false;
    console.log("frorm reset-----")
    if(this.linkForm.invalid && (this.linkForm.value.link == "" || this.linkForm.value.link == null) && (this.linkForm.value.URL == "" || this.linkForm.value.URL == null)){
      console.log("frorm reset-----")
      this.cretelink = false;
      this.linklist = true;
      this.linkForm.reset();
    }
  }

  OnEdit() {
    this.edit = true;
  }

  //storage color changer function
  storageColorChanger() {
    if (this.prosValue <= 0.9) {
      return "primary";
    } else {
      return "danger";
    }
  }

  showDialog() {
    this.upgradeStorage();
  }

 async upgradeStorage() {
    if(this.allowPage == 'true'){
      this.popover = await this.popoverController.create({
        component: DailogPopUpComponent,
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

  openSettings() {
    this.router.navigate(["/user/settings/profile"]);
    this.openMenu = false;
  }

  //   openChatModel() {
  //     const dialogRef = this.dialog.open(ChatComponent, {
  //       maxWidth: "100vw",
  //       maxHeight: "100vh",
  //       height: "100%",
  //       width: "100%",
  //       panelClass: "full-screen-modal",
  //       backdropClass: "cdk-overlay-dark-backdrop",
  //       disableClose: true,
  //     });
  //   }

  closeBanner() {
    this.showBanner = false;
    this.maintananceConfigName = true;
    this.localService.setJsonValue(localData.bannerHidden, "true");
    this.localService.setJsonValue(localData.maintenance, "false");
  }

  getServerMaintenance() {
    var data = {
      description: "",
      fromDateTime: "",
      toDateTime: "",
      maintenance: "",
      orgId: this.orgId,
      totalDuration: "",
    };

    this.commonService.getServerMaintenance(data).subscribe((result) => {
      console.log("result", result);
      if (result.status == 200 && result.value != "") {
        if(result.configName == ""){
          this.maintananceConfigName = false;
          this.localService.setJsonValue(localData.maintenance, "false");
        }
        else {
          this.localService.setJsonValue(localData.maintenance, "true");
        }
        this.serverMaintenanceData = JSON.parse(result.value);
        // this.showBanner = this.serverMaintenanceData.maintenance;
        this.isBannerClosed();
      } else {
        this.showBanner = false;
      }
    });
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
    if(this.serverMaintenanceData != null){
      var id = this.serverMaintenanceData.description.replace(/\s+/g,'');
      id = this.serverMaintenanceData?.fromDateTime+id+this.serverMaintenanceData?.toDateTime;
      var encodedString = btoa(id);
      // var decodedString = atob(encodedString);
      var getLocalBannerId =sessionStorage.getItem(localData.bannerId);
      if (getLocalBannerId == encodedString) {
        this.localService.getJsonValue('4b1c6ff6-108f-4810-b20a-8c73fdab6f8b') == "true"
          ? (this.showBanner = false)
          : (this.showBanner = true);
      } else {
        sessionStorage.removeItem(localData.bannerId);
        this.localService.setJsonValue(localData.bannerId, encodedString);
        this.localService.setJsonValue(localData.bannerHidden, "false");
        console.log(id, "id", encodedString);
        this.showBanner = true;
      }
    }
  }

  openChatModel() {
    // const dialogRef = this.dialog.open(ChatComponent, {
    //   maxWidth: "100vw",
    //   maxHeight: "100vh",
    //   height: "100%",
    //   width: "100%",
    //   panelClass: "full-screen-modal",
    //   backdropClass: "cdk-overlay-dark-backdrop",
    //   disableClose: true,
    // });
    this.showChat = true;
    if (this.screenWidth <= 770) {
      this.hideMobileMode = true;
      this.router.navigate(['user/chat']);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    } else {
      this.hideMobileMode = false;
      this.router.navigate(['user/chat']);
      // var toggle = document.getElementById("toggle");
      this.OntogglePopup = false;
      // toggle.style.display = "none";
    }
  }

}
