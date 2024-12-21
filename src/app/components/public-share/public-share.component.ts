import { Component, HostListener, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilesService } from "src/app/service/files.service";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { saveAs } from "file-saver";
import { PhotoViewerComponent } from "../modalpage/photo-viewer/photo-viewer.component";
import { ToastController, PopoverController } from "@ionic/angular";
import { PdfViwerComponent } from "../modalpage/pdf-viwer/pdf-viwer.component";
import { TextEditorComponent } from "../modalpage/text-editor/text-editor.component";
import { environment } from "src/environments/environment.prod";
import * as forge from "node-forge";
import { CommonService } from "src/app/service/common.service";
import { AudioPlayerComponent } from "../modalpage/audio-player/audio-player.component";

import { CollaboraComponent } from "../layouts/ifame/collabora/collabora.component";
import { IonInfiniteScroll } from '@ionic/angular';
import { localData, mimetypes } from "src/environments/mimetypes";

// //taiga changes
import { Inject, TemplateRef } from "@angular/core";

import { PreviewDialogService } from "@taiga-ui/addon-preview";

import { TuiDialogContext, TuiNotificationsService } from "@taiga-ui/core";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { DomSanitizer } from "@angular/platform-browser";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { DuplicateFilesComponent } from "../modalpage/duplicate-files/duplicate-files.component";
import { Upload } from "tus-js-client";
import { Subscription } from "rxjs";
import { LocalService } from "src/environments/local.service";

const publickey = environment.LOGIN_PUB_KEY;

@Component({
  selector: "app-public-share",
  templateUrl: "./public-share.component.html",
  styleUrls: ["./public-share.component.scss"],
})
export class PublicShareComponent implements OnInit {
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  @ViewChild("content")
  readonly content?: TemplateRef<TuiDialogContext<void>>;
  token: any;
  publicSharedData: any = {};
  SharedData: any = [];
  fileListView: boolean = false;
  fileGridView: boolean = true;
  sharedCount: any;
  files: any;
  passwordData: any = "";
  hide: boolean = true;
  owner: any;
  filenames: string[] = [];
  fileStatus = { status: "", requestType: "", percent: 0 };
  fileID: number = 0;
  popover: any;
  mimes = mimetypes;
  newV: any;
  newY: any;
  uploadedPhoto: string;
  breadcrumb: any = [];
  breadcrumbfiles: any = [];
  breadcrumbfileslist: any = [];
  parentid: any;
  verifypage: boolean = false;
  title: any;
  modifiedTime: any;
  productName = environment.productname;
  showIcon:boolean = false;
  showDownload: boolean = false;
  hideDownload: any;
  allowUpload: any;
  folderPermission: any;

  //video
  url: any;
  parentId: any;
  minio: any = "not minio";
  API_URL = environment.apiUrl;
  pic_title: any;
  pic_id: any;
  newowner: any;
  SharedFileID: any;
  showfolders: boolean = false;
  passwordProtected: any;
  pageEvent: PageEvent;
  pageSize: number = 20;
  page: number = 1;
  filesType: any = "";
  isMobile: boolean = false;
  imagePreview: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  uploadFileSize = environment.maxFileSize;
  // uploadFileCount = environment.uploadFileCount;
  uploadFileCount = 20;
  uploadProgress = 0;
  overwrite: string = "null";
  AuthorizartionToken =this.localService.getJsonValue(localData.token)
  errormsg: any;
  multiUploadedFiles: any = [];
  index = 0;
  openMenu: boolean = false;
  openMenu1: boolean = false;
  listener: () => void;
  currenDir: string;
  emptyFolder: any = [];
  uploadLoader: boolean = false;
  percentDone: any;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  subscriptionUploadData: Subscription;
  subscriptionUploadedfiles:Subscription;
  OntogglePopup: boolean = true;
  uploadbtn: boolean = true;
  publicUploadedFiles: any = [];
  publicUploadedFiles1: any = [];
  isLoadingPublicShare: boolean = true;
  publicUploadedFiles2: any = [];
  folderName: any;
  uploadedFolderName: any;
  showUplodedFiles: boolean = false;
  showUplodedFolders: boolean = false;
  uploadedFolderList = new Set()
  viewinfo : boolean = false;
  disable: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e: MouseEvent) {
    // e = e || window.event;
    console.log(e);
    e.preventDefault();
    if (e.clientX < 0 && e.clientY < 0) {
      console.log('close event');

      // alert('Window closed');
    } else {
      console.log('refreshed event');
      // alert('Window refreshed');
    }
    // return "Sure?";
    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = false;
    }

    // For Safari
    return 'Sure?';
  }

  // Keep me Signed in
  public doUnload(e): void {
    e.preventDefault();
    this.doBeforeUnload();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private filesService: FilesService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    public toastCtrl: ToastController,
    private renderer: Renderer2,
    private localService: LocalService,
    private commonService: CommonService,
    @Inject(PreviewDialogService)
    private readonly previewService: PreviewDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    this.token = this.activatedRoute.snapshot.params.token;
    this.OnpublicShared();
    this.commonService.disableBack();
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
    }
    this.subscriptionUploadedfiles = this.commonService.getUploadedFiles().subscribe((item) => {
      this.publicUploadedFiles1 = item;
    });
  }

  public doBeforeUnload(): void {
    // Clear localStorage
    console.log('close or reffresh');
  }


  showUploadedFiles(){
    this.publicUploadedFiles =  this.publicUploadedFiles1;
    if(this.publicUploadedFiles.length > 0){
      this.uploadbtn = false;
    }
    else{
      this.uploadbtn = true;
    }
    this.publicUploadedFiles = this.getFilesByFilter();
    for (let i = 0; i < this.publicUploadedFiles.length; i++) {
      this.publicUploadedFiles[i].sizeRead = this.getReadableFileSizeString(this.publicUploadedFiles[i].size);
    }
  }

  getFilesByFilter() {
    return this.publicUploadedFiles.filter((x) => x.webkitRelativePath === "");
  }

  showUploadedFiles1(){
    this.publicUploadedFiles2 =  this.publicUploadedFiles1;
    if(this.publicUploadedFiles2.length > 0){
      this.uploadbtn = false;
    }
    else{
      this.uploadbtn = true;
    }
    for (let i = 0; i < this.publicUploadedFiles2.length; i++) {
      this.folderName = this.publicUploadedFiles2[i].webkitRelativePath.split("/").shift();
      this.publicUploadedFiles2[i].sizeRead = this.getReadableFileSizeString(this.publicUploadedFiles2[i].size);
    }
    this.uploadedFolderList.add(this.folderName);
    this.uploadedFolderName = this.folderName;
  }

  OnpublicShared() {
    this.disable = false;
    this.filesService.getPublicShared(this.token).subscribe((result: any) => {
      if(result.code == 200){
        this.isLoadingPublicShare  = false;
        this.publicSharedData = result;
        this.passwordProtected = this.publicSharedData.passwordProtected;
        console.log(this.publicSharedData.fileOwner);
        this.newowner = this.publicSharedData.fileOwner;
        this.hideDownload = result.hiddenDownload;
        this.allowUpload = result.allowUpload;
        this.title = result.fileFolderStructure.title;
        this.newV = result.fileFolderStructure.icon;
        this.folderPermission = result.filePermissions;
        this.newY = "data:image/png;base64," + this.newV;
        if(this.folderPermission == 'CAN_UPLOAD_ONLY'){
          this.parentId = result.fileFolderStructure.id;
        }
        this.owner = this.publicSharedData.fileOwner;
        console.log(this.publicSharedData.fileOwner, " hhh", this.owner);
  
        if (this.publicSharedData.passwordProtected == false) {
          this.files = this.publicSharedData.fileFolderStructure;
          if (this.commonService.base64regex.test(this.files.icon) == true) {
            this.files.icon = "data:image/png;base64," + this.files.icon;
          }
          this.publicSharedData.modifiedAt = moment(
            this.publicSharedData.modifiedAt
          ).fromNow();
          this.modifiedTime = this.publicSharedData.modifiedAt;
          let size = this.getReadableFileSizeString(this.files.size);
          this.files.size = size;
          let mimeType = this.files.mimeType;
  
          if (!mimetypes[mimeType]) {
            this.files.mimeType = "UNKNOWN";
          }
        }
      }
      else if (result.code === 204) {
        this.router.navigate(["/publicShare-expired"]);
        this.toastr.error(result.message);
      }
      else if (result.code === 404){
        this.router.navigate(["/publicShare-expired"]);
      }
    });
  }

  fileListViewShow() {
    this.page = 1;
    this.SharedData = []
    this.showIcon = false;
   if(this.filesType == "insideFolder"){
    this.isLoadingPublicShare = true;
    this.openFolder(this.SharedFileID, this.parentId,this.page,this.pageSize);
   }
   else if (this.passwordProtected == false) {
      this.OnsubmitPassword();
      this.showfolders = false;
    } 
    else if (this.passwordProtected == true && this.filesType != "insideFolder") {
      this.OnpublicShared();
    }
    this.fileListView = true;
    this.fileGridView = false;
  }

  fileGridViewShow() {
    this.page = 1;
    this.SharedData = []
    this.showIcon = false;
    if(this.filesType == "insideFolder"){
      this.isLoadingPublicShare = true;
     this.openFolder(this.SharedFileID, this.parentId,this.page,this.pageSize);
    }
    if (this.passwordProtected == false &&  this.filesType != "insideFolder") {
      this.OnsubmitPassword();
      this.showfolders = false;
    } 
    else if (this.passwordProtected == true) {
      this.OnpublicShared();
    }
    this.fileGridView = true;
    this.fileListView = false;
  }

  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  OnPasswordValue($event) {
    if ($event.target.value != "") {
      var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
      var encryptedpassword = window.btoa(
        rsa.encrypt($event.target.value + this.token)
      );
      this.passwordData = encryptedpassword;
    } else if ($event.target.value === "") {
      this.passwordData = "";
    }
  }

  OnsubmitPassword() {
    this.disable = false;
    //this.ngxService.start();
    let passwordData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService.OnPubPassVrify(passwordData).subscribe(
      (result: any) => {
        if (result.code == 200) {
          this.ngxService.stop();
          this.publicSharedData = result;
          this.passwordProtected = this.publicSharedData.passwordProtected;
          this.title = result.fileFolderStructure.title;
          this.hideDownload = result.hiddenDownload;
          this.folderPermission = result.filePermissions;
          if(this.folderPermission == 'CAN_UPLOAD_ONLY'){
            this.parentId = result.fileFolderStructure.id;
          }
          if (this.publicSharedData.passwordProtected == false) {
            this.files = this.publicSharedData.fileFolderStructure;
            if (this.commonService.base64regex.test(this.files.icon) == true) {
              this.files.icon = "data:image/png;base64," + this.files.icon;
            }
            this.publicSharedData.modifiedAt = moment(
              this.publicSharedData.modifiedAt
            ).fromNow();
            this.modifiedTime = this.publicSharedData.modifiedAt;
            let size = this.getReadableFileSizeString(this.files.size);
            this.files.size = size;
            let mimeType = this.files.mimeType;

            if (!mimetypes[mimeType]) {
              this.files.mimeType = "UNKNOWN";
            }
          }
        } else if (result.code == 406) {
          this.ngxService.stop();
          this.toastr.error(result["message"]);
        }
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  //Download Documents
  OnDownloadDoc(objectId, fileid) {
    // alert('hee');
    //this.ngxService.start();
    let downloadData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService.pubShareddownloadFiles(downloadData, this.filesType, objectId, fileid).subscribe(
      (result: any) => {
        this.ngxService.stop();
        this.resportProgress(result);
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  private resportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, "Uploading... ");
        this.toastr.success("Downloading...");
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(
          httpEvent.loaded,
          httpEvent.total!,
          "Downloading... "
        );
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.fileStatus.status = "done";
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          var contentDisposition = httpEvent.headers.get("Content-Disposition");
          saveAs(
            new Blob([httpEvent.body!], {
              type: `${httpEvent.headers.get("Content-Type")};charset=utf-8`,
            }),
            httpEvent.headers
              .get("content-disposition")
              .replace("attachment ; filename=", "")!
          );
          this.toastr.success("Downloaded Successfully");
        }
        this.fileStatus.status = "done";
        break;
      default:
        break;
    }
  }

  private updateStatus(
    loaded: number,
    total: number,
    requestType: string
  ): void {
    this.fileStatus.status = "progress";
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round((100 * loaded) / total);
  }

  // async viewPhoto(password, token) {
  //   console.log(password);
  //   console.log(token);

  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       password: password,
  //       token: token,
  //     },
  //     component: PhotoViewerComponent,
  //   });
  //   return this.popover.present();
  // }
  //   show(){
  //     alert('hello')
  //     this.previewService.open(this.preview ).subscribe({
  //       complete: () => console.info('complete')
  //   });
  //   }
  //   get previewContent(): PolymorpheusContent {
  //     return 'newV'
  // }
  async viewPhoto(passwordData, token, parentid) {
    //this.ngxService.start();
    this.imagePreview = true;
    let previewData = {
      password: this.passwordData,
      token: this.token,
    };
    await this.filesService
      .OpenDocument(previewData, parentid, this.filesType, this.SharedFileID)
      .subscribe((result: any) => {
        console.log("parentid", this.parentid);
        if (this.commonService.base64regex.test(result.src) == true) {
          this.uploadedPhoto = "data:image/png;base64," + result.src;
        } else {
          this.uploadedPhoto = result.src;
          this.pic_title = result.title;
          this.pic_id = result.id;
        }
        this.previewService.open(this.preview).subscribe({
          complete: () => console.info("complete"),
        });
      });
  }
  get previewContent(): PolymorpheusContent {
    return "this.uploadedPhoto";
  }

  async viwePdfViwer(password, token, title, parentid) {
    this.popover = await this.popoverController.create({
      componentProps: {
        password: password,
        token: token,
        fileTitle: title,
        parentId: parentid,
        filesType: this.filesType,
        sharedFileId: this.SharedFileID,
      },
      component: PdfViwerComponent,
      cssClass: "modal-fullscreen",
    });
    return this.popover.present();
  }

  async viewTextEdit(password, token, title, parentid) {
    console.log("parentid---", parentid)
    this.popover = await this.popoverController.create({
      componentProps: {
        password: password,
        token: token,
        fileTitle: title,
        fileid: parentid,
        parentId: parentid,
        filesType: this.filesType,
        sharedFileId: this.SharedFileID,
        permission: this.folderPermission
      },
      component: TextEditorComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      if (this.passwordProtected == false && this.filesType != "insideFolder") {
        console.log("passwordProtected False")
        this.OnsubmitPassword();
        this.showfolders = false;
      } else if (this.passwordProtected == true && this.filesType != "insideFolder") {
        console.log("passwordProtected true")
        this.OnpublicShared();
      }
      else if(this.filesType == "insideFolder"){
        this.isLoadingPublicShare = true;
        this.showfolders = false;
        this.openFolder(this.SharedFileID, this.parentId,this.page,this.pageSize);
      }
    });   
  }

  OnopenFile(mimeType, id, parentid, title,versionId) {
    this.breadcrumbfileslist.push(parentid);
    if (
      mimeType === "image/png" ||
      mimeType === "image/jpeg" ||
      mimeType == "image/gif" ||
      mimeType === "image/jpg" ||
      mimeType === "image/svg+xml" ||
      mimeType === "image/gif"
    ) {
      this.viewPhoto(this.passwordData, this.token, parentid);
    } else if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType.startsWith("application/vnd.")
    ) {
      console.log("openOffice");
      console.log("11111");
      console.log("oooooooooooooooooooooo", parentid);
      console.log("3333333--------------", id);
      console.log("33dddddddddddd3", this.files.id);
      this.openOffice(parentid, this.files.id, this.passwordData, this.token,versionId);
    } else if (mimeType === "text/plain" || mimeType === "text/csv") {
      this.viewTextEdit(this.passwordData, this.token, title, parentid);
      // this.openOffice(this.files.id, this.passwordData, this.token);
    } else if (mimeType === "application/pdf") {
      this.viwePdfViwer(this.passwordData, this.token, title, parentid);
      // this.openOffice(this.files.id, this.passwordData, this.token);
    } else if (mimeType === "video/webm" || mimeType === "video/mp4") {
      this.viewVideo(this.passwordData, this.token, parentid);
    } else if (mimeType === "audio/mpeg" || mimeType === "audio/mp3") {
      this.viewAudio(this.passwordData, this.token, parentid);
    } else if (mimeType === "UNKNOWN") {
      console.log("Unkonwn")
      if(this.hideDownload === false){
        this.OnDownloadDoc(id, parentid);
      }
    } else if (mimeType === "httpd/unix-directory") {
      this.disable = true;
      this.viewinfo = false;
      this.SharedFileID = id;
      this.parentId = parentid;
      this.filesType = "insideFolder";
      console.log("inside", this.filesType);
      this.breadcrumb = {
        title: title,
        id: parentid,
        SharedFileID: this.SharedFileID,
      };
      this.breadcrumbfiles.push(this.breadcrumb);
      this.page = 1;
      this.showIcon = false;
      this.SharedData = [];
      this.openFolder(id, parentid,this.page,this.pageSize);
    }
  }

  Onbackbreadcrumb(SharedFileID, id) {
    console.log("onback", SharedFileID);
    console.log("back id", id);
    let index = this.breadcrumbfileslist.findIndex((x) => x === id);
    this.breadcrumbfileslist.splice(index + 1);
    this.breadcrumbfileslist.length = index + 1;
    if (id) {
      this.breadcrumbfiles.length = index + 1;
      this.SharedData = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.openFolder(SharedFileID, id,this.page,this.pageSize);
      this.parentid = id;
    }
  }

  OnhomeFiles() {
    if (this.passwordProtected == false) {
      this.OnsubmitPassword();
      this.showfolders = false;
    } else if (this.passwordProtected == true) {
      this.SharedData= [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.OnpublicShared();
    }
    this.breadcrumbfiles = [];
    this.breadcrumbfileslist = [];
    this.filesType = "outsideFolder";
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.openFolder(this.SharedFileID, this.parentId,this.page,this.pageSize);
    console.log("SharedFileID", this.SharedFileID)
    console.log("parentid", this.parentId)
  }

  async openOffice(id, fileid, e, token,versionId) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: id,
        fileTitle: "",
        password: "token_" + token + "-password" + e,
        publicShared: true,
        sharedFileID: fileid,
        versionId : versionId 

      },
      component: CollaboraComponent,
      cssClass: "modal-fullscreen",
    });

    await this.popover.present();
  }

  async viewAudio(password, token, parentid) {
    this.popover = await this.popoverController.create({
      componentProps: {
        password: password,
        token: token,
        parentId: parentid,
        filesType: this.filesType,
        sharedFileId: this.SharedFileID,
      },
      backdropDismiss: false,
      component: AudioPlayerComponent,
    });
    return this.popover.present();
  }

  // async viewVideo(password, token) {
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       password: password,
  //       token: token,
  //     },
  //     backdropDismiss: false,
  //     component: VideoPlayerComponent,
  //   });
  //   return this.popover.present();
  // }
  viewVideo(password, token, parentid) {
    //this.ngxService.start();

    let previewData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService
      .OpenDocument(previewData, parentid, this.filesType, this.SharedFileID)
      .subscribe((data: any) => {
        // console.log(this.url);
        this.url = data.src;

        if (this.url.startsWith("http")) {
          this.minio = "minio/resource";
        }
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data.src);
        this.previewService.open(this.content || "").subscribe();
        this.ngxService.stop();
        (error) => {
          this.ngxService.stop();
        };
      });
  }

  openFolder(SharedFileID, parentid,page,pageSize) {
    this.parentId = parentid;
    console.log("---shared id----", this.SharedFileID);
    let openfolder = {
      asc: true,
      pageNb: page,
      parentId: parentid,
      password: this.passwordData,
      sortBy: "modifiedAt",
      step: pageSize,
      token: this.token,
    };
    this.filesService
      .openPublicFolder(SharedFileID, openfolder)
      .subscribe((result: any) => {
        this.disable = false;
        this.ngxService.stop();
        this.publicSharedData = result;
        this.showfolders = true;
        this.showIcon = true;
        this.isLoadingPublicShare  = false;
        console.log("shred data", this.publicSharedData);
        this.ngxService.stop();
        if(this.page == 1)
          this.SharedData = []
        // this.SharedData = result.sharedFiles;
        this.SharedData = this.SharedData.concat(result.sharedFiles);
        this.sharedCount = result.count;
        this.SharedData.forEach(file => {
        if(this.hideDownload == false){
          console.log("showDownload", this.hideDownload)
          this.showDownload = true;
        }
        else{
          this.showDownload = false;
          console.log("showDownload", this.hideDownload)
        }
        for (let i = 0; i < this.SharedData.length; i++) {
          let shareddatalength = this.SharedData.length;
          console.log("shareddatalength", shareddatalength);
          if (
            this.commonService.base64regex.test(
              file.fileFolderStructure.icon
            ) == true
          ) {
            file.fileFolderStructure.icon =
              "data:image/png;base64," +
              file.fileFolderStructure.icon;
          }
          file.sharedTimeRead = moment(
            file.sharedTime
          ).fromNow();
          let size = this.getReadableFileSizeString(
            file.fileFolderStructure.size
          );
          file.fileFolderStructure.sizeRead = size;
          let mimeType = file.fileFolderStructure.mimeType;
          if (!mimetypes[mimeType]) {
            file.fileFolderStructure.mimeType = "UNKNOWN";
          }
        }
        });
      });
  }

  loadData(event){
    console.log("exzaexza") 
    if(this.sharedCount > 20){
      setTimeout(() => { 
      console.log("Done ",event);
      console.log("123")
      this.page = this.page + 1;
      event.target.complete();
      this.openFolder(this.SharedFileID,this.parentId,this.page,this.pageSize);
      console.log("this.page "+this.page);
      console.log("this.filesCount "+this.sharedCount);
      console.log("this.pageSize "+this.pageSize);
      console.log("this.mod "+ Math.ceil(this.sharedCount / this.pageSize));
      if(this.page === Math.ceil(this.sharedCount / this.pageSize)){
        event.target.disabled = true;
      }
    },1000);
    }
    else{
      console.log("OOPO",this.sharedCount)
      event.target.disabled = true;
    
    }
}

toggleInfiniteScroll() {
  if(this.infiniteScroll.disabled != true){
    this.page = 1;
  const content = document.querySelector('ion-content');
    setTimeout(() => {
    content.scrollToTop(0);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
}
// else if(this.infiniteScroll.disabled == true){
    console.log("hello")
    this.page = 1;
    const content = document.querySelector('ion-content');
    setTimeout(() => {
      content.scrollToTop(0);
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
  // }
}


  closePreview(){
    this.imagePreview = false;
  }

  uploadNewFile(event){
    console.log("----", event.target.files)
    // if (event.target.files.length <= this.uploadFileCount) {
    //   this.multiUploadedFiles = [];
    //   this.multiUploadedFiles = event.target.files;
    //   console.log("upload file", event.target.files)
    //   this.OnchunkUpload(this.multiUploadedFiles[this.index],this.parentId);
    // } else if (event.target.files.size > this.uploadFileSize) {
    //   this.toastr.error("One of the file size is more than 100 MB");
    // }

    if (event.target.files.length <= this.uploadFileCount) {
      this.multiUploadedFiles = [];
      this.multiUploadedFiles = event.target.files;
      if (this.multiUploadedFiles[0].webkitRelativePath.includes("/")) {
        //folders
        this.currenDir = "";
        let dirName =
          this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];
        let response = this.commonService
          .checkFolder(this.parentId, dirName)
          .subscribe(async (result: any) => {
            if (result.code == 200) {
              console.log("folder upload")
              this.currenDir = result.object;
              var index =
                this.multiUploadedFiles[0].webkitRelativePath.indexOf("/");
              let item =
                this.currenDir +
                "/" +
                this.multiUploadedFiles[0].webkitRelativePath.substring(
                  index + 1
                );
              this.OnUploadFolder1(
                this.multiUploadedFiles[this.index++],
                this.parentId,
                this.currenDir + "/"
              );
            } else {
              console.log("folder upload1")
              let FoldName =
                this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];
              this.OnUploadFolder1(
                this.multiUploadedFiles[this.index++],
                this.parentId,
                FoldName + "/"
              );
            }
          });
        // this.toastr.success("Uploading...!", "", { timeOut: 1000 });
        this.currenDir = "";
      } else {
        //files
        this.OnchunkUpload(
          this.multiUploadedFiles[this.index++],
          this.parentId
        );
      }
    } else if (event.target.files.length > this.uploadFileCount) {
      this.toastr.error("You can upload only " + this.uploadFileCount + " files at a time");
      this.openMenu = false;
      this.openMenu1 = false;
    } else if (event.target.files.size > this.uploadFileSize) {
      this.toastr.error("One of the file size is more than 100 MB");
      this.openMenu = false;
      this.openMenu1 = false;
    }
  }

  OnchunkUpload(item, parentId) {
    this.openMenu = false;
    this.openMenu1 = false;
    if (
      !item.startupload &&
      item.size <= this.uploadFileSize &&
      item.size > 0
    ) {
      this.uploadProgress = 0;
      console.log("^^^^^^^^^^^^^^^^^66" + item.webkitRelativePath);
      let foldering;
      let folderLength = item.webkitRelativePath.split("/")[0].length;
      if (item.webkitRelativePath) {
        foldering =
          item.webkitRelativePath +
          item.webkitRelativePath.substring(folderLength + 1);
        this.overwrite = "false";
      } else {
        foldering = " ";
      }
      console.log("token", this.token)
      const upload = new Upload(item, {
        endpoint: `${this.API_URL}file/upload?publicUpload=true&parentId=${parentId}&overwrite=false`,
        retryDelays: [0, 1000],
        chunkSize: 1000 * 1000,
        metadata: {
          filename: item.name,
          filetype: item.type,
          token: this.token,
          folder: foldering,
        },

        onError: async (error) => {
          // error.toString().includes("No Space Available")
          const toast = await this.toastCtrl.create({
            message: "Upload failed: " + error,
            duration: 3000,
            position: "top",
          });
          // this.errormsg = error.toString().includes("File Already Exist")
          //   ? "File Already Exist"
          //   : "Something";

            //  error.toString().includes("Such a file cannot be uploaded. Make a call to your administration."){
            //   this.toastr.warning(this.errormsg);
            //   this.multiUploadedFiles = [];
            //             }
            // ? "Such a file cannot be uploaded. Make a call to your administration."
            // : "Something";
            // this.toastr.warning(this.errormsg);


          if(error.toString().includes("209")){
            this.errormsg = error.message;
            let a = error.message.substring(error.message.indexOf("text:")+6,error.message.lastIndexOf('}')+1);
            let b = a.replace(/['"{}}]+/g, '');
            console.log("Error Raw", a)
            console.log("replaced error", b);
            let finalError = b.substring(b.indexOf('message:')+8);
            console.log("finalError", finalError);
            this.toastr.warning(finalError);
            this.index = 0;
            this.multiUploadedFiles = [];
            return;
          }
            

          if (error.toString().includes("File Already Exist")) {
            console.log("File Already Exist");
            // this.toastr.warning(this.errormsg);

            this.popover = await this.popoverController.create({
              component: DuplicateFilesComponent,
              componentProps: {},
              keyboardClose: false,
              translucent: true,
              backdropDismiss: false,
              cssClass: "custom-popupclass",
            });
            await this.popover.present();
            console.log("------------------------------------------");
            return this.popover.onDidDismiss().then((data) => {
              this.overwrite = data.data.overWrite;
              if (data.data.overWrite === "") {
                if (this.multiUploadedFiles.length == 1) {
                  this.index = 0;
                  this.multiUploadedFiles = [];
                  this.overwrite = "null";
                  console.log("CANCEL");
                  return;
                } else {
                  console.log("MORE THAN 1");
                  this.overwrite = "null";
                  // console.log(this.dropUploadedFiles[this.index].file.name);
                  console.log(this.multiUploadedFiles.length);
                  console.log(this.index, "index");
                  if (this.index < this.multiUploadedFiles.length) {
                    this.OnchunkUpload(
                      this.multiUploadedFiles[this.index++],
                      parentId
                    );
                  } else {
                    this.index = 0;
                    this.multiUploadedFiles = [];
                    return;
                  }
                }

                // console.log("multi" + this.multiUploadedFiles.length);
                // this.index = 0;
                // this.multiUploadedFiles = [];
                // this.overwrite = "null";
                // return;
              } else if (
                data.data.overWrite != undefined ||
                data.data.overWrite != ""
              ) {
                console.log("OnchunkUpload1");
                this.OnchunkUpload(item, parentId);
              }
            });
          }

          this.errormsg = error.toString().includes("No Space Available")
            ? "No Space Available" 

            : "Oops, something went wrong. Please try again.";
          this.toastr.warning(this.errormsg);
          this.index = 0;
          return;
          
        },

        onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
          console.log("COOOOOOOOOOOOONSOLE LOG UPLOADING FILE CHUNKFOLDER1");
          this.uploadProgress =
            Math.floor((bytesAccepted / bytesTotal) * 100) + 1;
          this.commonService.storeUploadProgress(item);
          this.uploadLoader = true;
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = false;
          this.headerUploadProgress = true;
          this.headerUploadcompleted = false;
        },
        onSuccess: async () => {
          this.commonService.storeStorageinfo(true);
          this.uploadProgress = 100;
          this.uploadLoader = true;
          if(this.folderPermission != 'CAN_UPLOAD_ONLY'){
            this.openFolder(this.SharedFileID ,this.parentId,this.page,this.pageSize);          
          }
          if(this.folderPermission == 'CAN_UPLOAD_ONLY'){
            this.showUploadedFiles();        
          }
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = true;
          this.headerUploadProgress = false;
          this.headerUploadcompleted = true;
          this.toastr.success("Upload successful", "", { timeOut: 1000 });
          if (this.index == this.multiUploadedFiles.length) {
            this.createFolders();
            this.index = 0;
            return;
          }
          this.OnchunkUpload(
            this.multiUploadedFiles[this.index++],
            parentId
          );
        },
      });

      this.overwrite = "null";
      upload.start();
    } else if (item.size > this.uploadFileSize) {
      console.log("--more than 100 MB");
      this.toastr.warning(
        "File which is more than 100 MB cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnchunkUpload(this.multiUploadedFiles[this.index++], parentId);
    }
  }


  OnUploadFolder1(item, parentId, webkitRelativePath) {
    this.openMenu = false;
    this.openMenu1 = false;
    console.log(item.startupload, item.size);
    if (!item.startupload && item.size <= this.uploadFileSize && item.size > 0) {
      this.uploadProgress = 0;
      let folderLength = item.webkitRelativePath.split("/")[0].length;
      let foldering;
      if (webkitRelativePath) {
        foldering =
          webkitRelativePath +
          item.webkitRelativePath.substring(folderLength + 1);
        this.overwrite = "false";
      } else {
        foldering = " ";
      }

      this.overwrite = "false";
      const upload = new Upload(item, {
        endpoint: `${this.API_URL}file/upload?publicUpload=true&parentId=${this.parentId}&overwrite=false`,
        retryDelays: [0, 1000],
        chunkSize: 1000 * 1000,
        metadata: {
          filename: item.name,
          filetype: item.type,
          token: this.token,
          folder: foldering,
        },

        onError: async (error) => {
          let error_resp = JSON.parse(error.toString());
					let error_msg = (error_resp && error_resp.error) ? error_resp.error : 'Unknown error';
					let is_global = (error_resp && error_resp.global) ? error_resp.global : false;
					let error_state = (error_resp && error_resp.state) ? error_resp.state : 'error';

          console.log("error_resp", error_resp);

          const toast = await this.toastCtrl.create({
            message: "Upload failed: " + error,
            duration: 3000,
            position: "top",
          });
          this.errormsg = error.toString().includes("File Already Exist")
            ? "File Already Exist"
            : "Something";

          this.errormsg = error.toString().includes("No Space Available")
            ? "No Space Available"
            : "Oops, something went wrong. Please try again.";
          this.toastr.warning(this.errormsg);
          console.log(error);
          this.index = 0;
          return;
        },
        onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
          this.uploadProgress =
            Math.floor((bytesAccepted / bytesTotal) * 100) + 1;
          this.commonService.storeUploadProgress(item);
          this.uploadLoader = true;
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = false;
          this.headerUploadProgress = true;
          this.headerUploadcompleted = false;
        },
        onSuccess: async () => {
          this.commonService.storeStorageinfo(true);
          this.uploadProgress = 100;
          this.uploadLoader = true;
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = true;
          this.headerUploadProgress = false;
          this.headerUploadcompleted = true;
          if(this.folderPermission != 'CAN_UPLOAD_ONLY'){
            this.openFolder(this.SharedFileID ,this.parentId,this.page,this.pageSize);          
          }
          if(this.folderPermission == 'CAN_UPLOAD_ONLY'){
            this.showUploadedFiles1();        
          }
          this.toastr.success("Upload successful", "", { timeOut: 1000 });
          if (this.index == this.multiUploadedFiles.length) {
            this.createFolders();
            this.index = 0;
            return;
          }
          this.OnUploadFolder1(
            this.multiUploadedFiles[this.index++],
            this.parentId,
            webkitRelativePath
          );
        },
      });

      this.overwrite = "null";
      upload.start();
    } else if (item.size > this.uploadFileSize) {
      console.log("--more than 100 MB");
      this.toastr.warning(
        "File which is more than 100 MB cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnUploadFolder1(
        this.multiUploadedFiles[this.index++],
        this.parentId,
        webkitRelativePath
      );
    }
  }

  createFolders() {
    if (this.emptyFolder.length > 0) {
      this.commonService
        .CreateEmpthyFolderOnUpload(this.emptyFolder, this.parentId)
        .subscribe((data) => {
          console.log("empty folder created", data);
          this.emptyFolder = [];
        });
    } else {
      console.log("empty folder created", this.emptyFolder);
    }
  }

  OnopenMenu() {
    this.commonService.storeClick("click");
    this.openMenu ? this.handleClose() : this.handleOpen();
  }

  OnopenMenu1(){
    this.commonService.storeClick("click");
    this.openMenu1 ? this.handleClose1() : this.handleOpen1();
  }

  handleOpen() {
    this.openMenu = true;
    this.addListener();
  }

  handleClose() {
    this.openMenu = false;
    this.removeListener();
  }

  handleOpen1() {
    this.openMenu1 = true;
    this.addListener();
  }

  handleClose1() {
    this.openMenu1 = false;
    this.removeListener();
  }

  //click outside of div it's hide
  addListener() {
    this.listener = this.renderer.listen(document, "click", (event) => {
      const targetEl = event.target as HTMLElement;
      const clickedOutside =
        targetEl.innerHTML.search("panel-menu") > 0 ? true : false;
      clickedOutside ? this.handleClose() : console.log("");
    });
  }

  removeListener() {
    this.listener();
  }

  OncloseMenu() {
    this.openMenu = false;
    this.openMenu1 = false;
    this.viewinfo = false;
  }

   //Cancel Loader popup
   OncancelUploadbox() {
    this.commonService.storeCancelProgress("true");
    this.uploadLoader = false;
    this.multiUploadedFiles = [];
  }

  //Toggle popup
  OntoggleLoaderpopUp() {
    var toggle = document.getElementById("toggle");
    if (toggle.style.display === "none") {
      this.OntogglePopup = true;
      toggle.style.display = "block";
    } else {
      this.OntogglePopup = false;
      toggle.style.display = "none";
    }
  }

  viewDetails(){
    this.viewinfo = true; 
  }

  closeViewDetails(){
    this.viewinfo = false; 
  }

}

