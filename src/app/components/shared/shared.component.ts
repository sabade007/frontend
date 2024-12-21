import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
  HostListener,
  Inject,
  Renderer2,
} from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "../../service/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { localData, mimetypes } from "src/environments/mimetypes";
import * as moment from "moment";
import { FilesService } from "src/app/service/files.service";
import { ToastController, PopoverController, NavParams } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { saveAs } from "file-saver";
import { PdfViwerComponent } from "../modalpage/pdf-viwer/pdf-viwer.component";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { TextEditorComponent } from "../modalpage/text-editor/text-editor.component";
import { VideoPlayerComponent } from "../modalpage/video-player/video-player.component";
import { AudioPlayerComponent } from "../modalpage/audio-player/audio-player.component";
import { PhotoViewerComponent } from "../modalpage/photo-viewer/photo-viewer.component";
import { SharingComponent } from "../modalpage/sharing/sharing.component";
import { Subscription } from "rxjs";
import { CollaboraComponent } from "../layouts/ifame/collabora/collabora.component";
//taiga changes
import { TemplateRef } from "@angular/core";

import { PreviewDialogService } from "@taiga-ui/addon-preview";

import { TuiDialogContext, TuiNotificationsService } from "@taiga-ui/core";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";

import { PhotosService } from "src/app/service/photos.service";
import { environment } from "src/environments/environment.prod";
import { DomSanitizer } from "@angular/platform-browser";
import { IonInfiniteScroll } from '@ionic/angular';
import { EditpubliclinkComponent } from "../modalpage/editpubliclink/editpubliclink.component";
import { LocalService } from "src/environments/local.service";
import { DuplicateFilesComponent } from "../modalpage/duplicate-files/duplicate-files.component";
import { Upload } from "tus-js-client";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-shared",
  templateUrl: "./shared.component.html",
  styleUrls: ["./shared.component.scss"],
})
export class SharedComponent implements OnInit {
  index = 0;
  length;
  currentIndex;
  downloadID: any = [];
  idx;
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  @ViewChild("content")
  readonly content?: TemplateRef<TuiDialogContext<void>>;
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  SharedData: any = [];
  fileListView: boolean = true;
  fileGridView: boolean = false;
  reNameFile: boolean = true;
  newFolder: boolean = false;
  newTextDoc: boolean = false;
  newDoc: boolean = false;
  newSpreadsheet = false;
  newPresentation = false;
  newFolderName: any;
  public selectedFile: any = File;
  resData: any;
  uploadedFile: any = [];
  image: any;
  reNameId: any;
  reName: any;
  ParentID = this.localService.getJsonValue(localData.parentId);
  filesLength: any;
  breadcrumb: any = [];
  breadcrumbfiles: any = [];
  deleteFileId: any = [];
  favoriteFile: any = [];
  mimes = mimetypes;
  downloadFilesId: any = [];
  title: any;
  id: any;
  selectedFiles: any;
  selectedId: any = [];
  breadcrumbfileslist: any = [];

  fileId: any = [];
  multiSelect: boolean = false;
  allSelected: boolean = false;

  uploadedFolder: any = [];
  uploadedDocuments: any = [];
  uploadedFolderLength: any;
  uploadedDocumentsLength: any;
  popover: any;
  listener: () => void;
  filenames: string[] = [];
  fileStatus = { status: "", requestType: "", percent: 0 };
  @ViewChildren("checkbox") checkbox: QueryList<ElementRef>;
  unselectId: any;
  page: number = 1;
  allFilesData: any = [];
  filesCount: any;
  openFolder: boolean = false;
  sortList: any = "Shared Time";
  sortValue = "sharedTime";
  openSortValue = "modifiedAt";
  removable: boolean = true;
  sharedCount: any;
  pageEvent: PageEvent;
  pageSize: number = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("toggleButton") toggleButton: ElementRef;
  @ViewChild("menu") menu: ElementRef;
  viewDetails: boolean = false;
  newFileName: any;
  uploadLoader: boolean = false;
  UploadProgress: boolean = false;
  Uploadcompleted: boolean = false;
  percentDone: any;
  uploadFiles: any = [];
  cancelUpload: boolean = false;
  multiUploadedFiles: any = [];
  uploadedDoc: any = [];
  cancelUploadCounter: number = 0;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  headercancelUpload: boolean = false;
  OntogglePopup: boolean = true;
  sharedListUsers: boolean = true;
  sharedOrder: any = "Shared with You";
  sharedType: any = "others";
  sharedDownload: boolean = true;
  SharedFileID: number = -1;
  filesType: any = "";
  subscription: Subscription;
  dashboardResult: any = [];
  extentsion: any;
  selectedOption: boolean = false;
  openMenu: boolean = false;
  HighlightRow: number;
  selectedRows: any = [];
  titleFie: any;
  @HostListener("window:mouseup", ["$event"])
  ClickedRow: any;

  fullImage: any;
  uploadedPhoto: any;
  passwordData: any;
  token: any;
  //video
  url: any;
  parentId: any;
  minio: any = "not minio";
  API_URL = environment.apiUrl;
  pic_title: any;
  vid_title: any;
  photo_id: any;
  file_id: any;
  fileDetails: any = [];
  owner: any;
  description: any;
  fileType: any;
  activityList: any = [];
  onedit: boolean = false;
  createdat: any;
  size: any;
  lastModifiedAt: any;
  sharedWith: any = [];
  fileicon: any;
  fileTitle: any;
  fileid: any;
  private userName: string = "";
  lastModifiedDate: string;
  productName = environment.productname;
  selectedfileLength: number;
  selectedlength: boolean;
  isMobile: boolean = false;
  reShare: boolean = false;
  imagePreview: boolean = false;
  allowUpload: boolean = false;
  uploadFileCount : any;
  uploadFileSize : any;
  uploadFileSize1: any;
  uploadProgress = 0;
  overwrite: string = "null";
  AuthorizartionToken =this.localService.getJsonValue(localData.token)
  errormsg: any;
  currenDir: string;
  emptyFolder: any = [];
  page1:number = 1;
  pageSize1:number = 20;
  isLoadingShared:boolean = true;
  showIcon: boolean = false;
  sharedCount1: any;
  hidescroll:boolean = true;
  onclose: boolean = false;
  showMore : boolean = false;
  isTag: boolean = false;
  createTagForm: FormGroup;
  listTag: any = [];
  inputValues: any;
  searchTagList: any= [];

  mouseUp() {
    if (this.selectedOption == false) {
      this.multiSelect = false;
      this.HighlightRow = null;
    }
  }
  sortOrder: boolean = false;

  constructor(
    private fb:FormBuilder,
    private ngxService: NgxUiLoaderService,
    private navParams: NavParams,
    public toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    private toastr: ToastrService,
    private popoverController: PopoverController,
    @Inject(PreviewDialogService)
    private readonly previewService: PreviewDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private localService: LocalService,
  ) {
    route.params.subscribe((val) => {
      this.OnSharedFiles(this.localService.getJsonValue(localData.parentId),this.page,this.pageSize);
      // this.commonService.getDashboardInfo();
    });

    this.ClickedRow = function (index, id, title) {
      this.HighlightRow = index;
      if (id != null) {
        this.multiSelect = true;
        this.selectedFiles = id;
        this.titleFie = title;
      }
    };

    this.subscription = this.commonService.getpath().subscribe((message) => {
      if (message == "path") {
        // this.OnSharedFiles(this.localService.getJsonValue(localData.parentId),this.page,this.pageSize);
        this.ParentID = this.localService.getJsonValue(localData.parentId);
        this.filesType = "";
        this.breadcrumbfiles = [];
      }
    });
    this.getDashboardInfo();
    this.commonService.storeHeader("Shared");
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
    }
    this.createTagForm = this.fb.group({
      tagName: new FormControl("", Validators.required),
    });
  }

   // Get  Storage info
   getDashboardInfo() {
    this.commonService.getDashboardInfos().subscribe((result: any) => {
      this.uploadFileCount = result.limit;
      this.uploadFileSize = result.maxFileSize;
      this.uploadFileSize1 = this.getReadableFileSizeString(this.uploadFileSize);
    });
  }

  fileListViewShow() {
    this.isLoadingShared = true;
    this.page = 1;
    this.SharedData = [];
    this.showIcon = false;
    if (this.filesType == "insideFolder" && this.sharedType == "others"){
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page1,this.pageSize1);
    }
    else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
    {
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page1,this.pageSize1);
    }
    else{
    this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
    }
    this.fileListView = true;
    this.fileGridView = false;
    this.multiSelect = false;
  }

  fileGridViewShow() {
    this.isLoadingShared = true;
    this.SharedData = [];
    this.showIcon = false;
    this.page = 1;
    if (this.filesType == "insideFolder" && this.sharedType == "others"){
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page1,this.pageSize1);
    }
    else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
    {
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page1,this.pageSize1);
    }
    else{
    this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
    }
    this.fileGridView = true;
    this.fileListView = false;
    this.multiSelect = false;
  }

  hideMultiSelect() {
    this.multiSelect = false;
  }

  OnopenMenu() {
    this.openMenu ? this.handleClose() : this.handleOpen();
  }

  OncloseMenu() {
    this.openMenu = false;
    this.viewDetails = false;
  }

  handleOpen() {
    this.openMenu = true;
    this.addListener();
    this.viewDetails = false;
  }

  handleClose() {
    this.removeListener();
  }

  //click outside of div it's hide
  addListener() {
    this.listener = this.renderer.listen(document, "click", (event) => {
      const targetEl = event.target as HTMLElement;
      const clickedOutside =
        targetEl.innerHTML.search("panel-menu") > 0 ? true : false;
      clickedOutside ? this.handleClose() : console.log("nothing todo");
    });
  }

  removeListener() {
    this.listener();
  }

  onFocusInMulti(event: any) {
    this.selectedOption = true;
    if (this.selectedOption == true) {
      this.multiSelect = true;
    }
  }

  OnSharedFiles(parentid,page,pageSize) {
    //this.ngxService.start();
    this.sharedCount = "..."
    this.SharedFileID = -1;
    let sharedData = {
      asc: this.sortOrder,
      pageNb: page,
      sharedType: this.sharedType,
      parentId: parentid,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.filesService.getSharedFiles(sharedData).subscribe(
      (result: any) => {
        this.ngxService.stop();
        if(this.page == 1)
          this.SharedData = []
        // this.SharedData = result.sharedFiles;
        this.SharedData = this.SharedData.concat(result.sharedFiles);
        this.multiSelect = false;
        this.HighlightRow = null;
        this.showIcon = true;
        this.isLoadingShared = false;   
        this.sharedCount = result.count;
        this.sharedCount1 = result.count;
        this.SharedData.forEach(file =>{
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

          console.log(file.sharedTime);

          let size = this.getReadableFileSizeString(
            file.fileFolderStructure.size
          );
          file.fileFolderStructure.sizeRead = size;
          let mimeType = file.fileFolderStructure.mimeType;
          if (!mimetypes[mimeType]) {
            file.fileFolderStructure.mimeType = "UNKNOWN";
          }
          file.shareWith = file.shareWith.filter(
            (item) => item
          );

          if (!(mimeType == "httpd/unix-directory")) {
            this.extentsion = file.fileFolderStructure.title
              .split(".")
              .pop();
              file.extentsion = this.extentsion;
          }
          if (!(mimeType == "httpd/unix-directory")) {
            let extn: any;
            extn = file.fileFolderStructure.title;
            if (extn.indexOf(".") == -1) {
              this.extentsion = "Unknown";
              file.extentsion = this.extentsion;
            }
          }
        })
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  loadData(event){
    console.log("exzaexza") 
    if(this.sharedCount1 > 20){
      setTimeout(() => { 
      console.log("Done ",event);
      console.log("123")
      this.page = this.page + 1;
      event.target.complete();
      if (this.filesType == "insideFolder" && this.sharedType == "others"){
        this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
      }
      else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
      {
        this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
      }
      else{
      this.OnSharedFiles(this.ParentID,this.page,this.pageSize);
      }
      console.log("this.page "+this.page);
      console.log("this.sharedCount "+this.sharedCount1);
      console.log("this.pageSize "+this.pageSize);
      console.log("this.mod "+ Math.ceil(this.sharedCount1 / this.pageSize));
      if(this.page === Math.ceil(this.sharedCount1 / this.pageSize)){
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


  OnSharedOrder(val: any) {
    this.isLoadingShared = true;
    this.multiSelect = false;
    this.selectedFile = -1;
    this.showIcon = false;
    this.toggleInfiniteScroll();
    this.page = 1;
    this.pageSize = 20;

    if (this.sharedListUsers === true) {
      this.sharedOrder = "Shared with Others";
      this.SharedData = [];
      this.sharedType = val;
      this.OnSharedFiles(this.localService.getJsonValue(localData.parentId),this.page1,this.pageSize1);
      this.sharedListUsers = false;
      this.sharedDownload = false;
      this.breadcrumbfiles = [];
      this.filesType = "";
    } else {
      this.sharedOrder = "Shared with You";
      this.sharedType = val;
      this.OnSharedFiles(this.localService.getJsonValue(localData.parentId),this.page1,this.pageSize1);
      this.sharedListUsers = true;
      this.sharedDownload = true;
      this.breadcrumbfiles = [];
      this.SharedData = [];
      this.filesType = "";
    }
  }

  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.filesType == "insideFolder"){
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page1,this.pageSize1);
    }
    else{
      this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
    }
  }

  OngetSortbysortList() {
    this.OngetSort(this.sortList);
  }

  //Get sort value
  OngetSort(value) {
    this.sortList = value;
    this.removable = true;
    this.sortValue = value;
    this.openSortValue = value;
    if (this.sortOrder == false) {
      this.sortOrder = true;
    } else if (this.sortOrder == true) {
      this.sortOrder = false;
    }
    if (this.filesType == "insideFolder" && this.sharedType == "others") {
      if (this.openSortValue === "Title") {
        this.openSortValue = "title";
        this.sortValue = "title";
      } else if (this.openSortValue === "Shared Time") {
        this.openSortValue = "modifiedAt";
        this.sortValue = "sharedTime";
      }
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
    } else if (
      this.filesType == "insideFolder" &&
      (this.sharedType == "self" || this.sharedType == "bylink")
    ) {
      if (this.openSortValue === "Title") {
        if (this.sortOrder == false) {
          this.sortOrder = true;
        } else if (this.sortOrder == true) {
          this.sortOrder = false;
        }
        this.openSortValue = "title";
        this.sortValue = "title";
      } else if (this.openSortValue === "Shared Time") {
        this.openSortValue = "modifiedAt";
        this.sortValue = "sharedTime";
      }
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
    } else {
      if (this.sortValue === "Title") {
        this.sortValue = "title";
        this.openSortValue = "title";
      } else if (this.sortValue === "Shared Time") {
        this.openSortValue = "modifiedAt";
        this.sortValue = "sharedTime";
      }
      this.SharedData = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.OnSharedFiles(this.ParentID,this.page,this.pageSize);
    }
  }

  matChipremove() {
    this.removable = false;
  }

  // define a function to download files
  OnDownload(filesid): void {
    this.downloadFilesId = {
      fileId: [filesid],
      sharedFile: this.sharedDownload,
    };
    //this.ngxService.start();
    this.filesService.downloadFiles(this.downloadFilesId).subscribe(
      (event: any) => {
        this.ngxService.stop();
        this.resportProgress(event);
        this.showIcon = false;
        this.SharedData = [];
        this.toggleInfiniteScroll();
        this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
        // this.toastr.success("Download Successfully");
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
      }
    );
    this.multiSelect = false;
    this.HighlightRow = null;
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
          httpEvent.headers.get("Content-Disposition");
          saveAs(
            new Blob([httpEvent.body!], {
              type: `${httpEvent.headers.get("Content-Type")};charset=utf-8`,
            }),
            httpEvent.headers
              .get("content-disposition")
              .replace("attachment ; filename=", "")!
          );
          setTimeout(() => {
            this.toastr.success("Downloaded Successfully");
          }, 3000);
        }
        this.fileStatus.status = "done";
        break;
      default:
        break;
    }
  }

  OnopenFile(id, mimeType, title, objectId, permission,versionId) {
    this.multiSelect = false;
    this.breadcrumbfileslist.push(id);
    if (id && this.reNameFile === true) {
      switch (mimetypes[mimeType].editor) {
        case "FOLDER":
          this.openFolder = true;
          this.ParentID = id;
          this.multiSelect = false;
          this.HighlightRow = null;
          this.SharedFileID =
            this.SharedFileID < 0 ? objectId : this.SharedFileID;
          this.breadcrumb = {
            title: title,
            id: id,
            SharedFileID: this.SharedFileID,
          };

          if (
            this.sharedType == "others" ||
            this.sharedType == "self" ||
            this.sharedType == "bylink"
          ) {
            this.SharedData = [];
            this.showIcon = false;
            // this.hidescroll = false;
            this.toggleInfiniteScroll();
            this.OnOpenSharedFiles(id, this.SharedFileID,this.page1,this.pageSize1);
            this.filesType = "insideFolder";
          } else {
            this.SharedData = [];
            this.showIcon = false;
            this.toggleInfiniteScroll();
            this.OnSharedFiles(id,this.page1,this.pageSize1);
          }
          this.breadcrumbfiles.push(this.breadcrumb);
          break;
        case "PDF_VIEWER":
          this.viwePdfViwer(id, title);
          break;
        case "IMAGE_VIEWER":
          this.viewPhoto(id, title);
          break;
        case "TEXT_EDITOR":
          console.log("88888888888888");
          this.viewTextEdit(id, title, permission, true);
          break;
        case "AUDIO_PLAYER":
          this.viewAudio(id, title);
          break;
        case "DOC_EDITOR":
          this.openOffice(id, title,versionId);
          break;
        case "VIDEO_PLAYER":
          this.viewVideo(id, title);
          break;
        case "UNKNOWN":
          this.OnDownload(id);
          break;
      }
    }
    if(permission == "CAN_EDIT" &&  this.filesType == "insideFolder"){
      this.allowUpload = true;
    }
  }

  OnOpenSharedFiles(id, SharedFileID,page,pageSize) {
    console.log(id, SharedFileID);
    console.log("inside folder");
    //this.ngxService.start();
    let sharedData = {
      asc: this.sortOrder,
      pageNb: page,
      parentId: id,
      sortBy: this.openSortValue,
      step: pageSize,
    };
    this.filesService.getOpenSharedFiles(sharedData, SharedFileID).subscribe(
      (result: any) => {
        this.ngxService.stop();
        if(this.page == 1)
          this.SharedData = [];
        // this.SharedData = result.sharedFiles;
        this.SharedData = this.SharedData.concat(result.sharedFiles);
        this.multiSelect = false;
        this.HighlightRow = null;
        this.showIcon = true;
        this.sharedCount = result.count;
        this.sharedCount1 = result.count;
        this.SharedData.forEach(file => {
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
          if (!(mimeType == "httpd/unix-directory")) {
            this.extentsion = file.fileFolderStructure.title
              .split(".")
              .pop();
              file.extentsion = this.extentsion;
          }
          if (!(mimeType == "httpd/unix-directory")) {
            let extn: any;
            extn = file.fileFolderStructure.title;
            if (extn.indexOf(".") == -1) {
              this.extentsion = "Unknown";
              file.extentsion = this.extentsion;
            }
          }
        });
      },
      (error) => {
        this.ngxService.stop();
        this.breadcrumbfiles = [];
      }
    );
  }

  async viwePdfViwer(fileid, title) {
    let sharedFileId = -1;
    if (this.sharedType == "others") {
      sharedFileId = this.SharedFileID;
    }

    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: this.sharedType,
        parentId: this.ParentID,
        filesType: this.filesType,
        sharedFileId: sharedFileId,
      },
      component: PdfViwerComponent,
      cssClass: "modal-fullscreen",
    });
    return this.popover.present();
  }

  async viewTextEdit(fileid, title, permission, isShared) {
    let sharedFileId = -1;
    if (this.sharedType == "others") {
      sharedFileId = this.SharedFileID;
    }

    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: this.sharedType,
        parentId: this.ParentID,
        filesType: this.filesType,
        permission: permission,
        isShared: isShared,
        sharedFileId: sharedFileId,
      },
      component: TextEditorComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      if (this.filesType == "insideFolder" && this.sharedType == "others"){
        this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
      }
      else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
      {
        this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
      }
      else{
      this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
      }
    });
  }

  // async viewPhoto(fileid, title) {
  //   let sharedFileId = -1;
  //   if (this.sharedType == "others") {
  //     sharedFileId = this.SharedFileID;
  //   }

  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: this.sharedType,
  //       parentId: this.ParentID,
  //       filesType: this.filesType,
  //       sharedFileId: sharedFileId,
  //     },
  //     component: PhotoViewerComponent,
  //   });
  //   return this.popover.present();
  // }

  viewPhoto(fileid, title) {
    this.imagePreview = true;
    console.log("@@ @@@  @@@ @");
    this.filesService
      .getBase64ofFile(
        fileid,
        this.sharedType,
        this.ParentID,
        this.filesType,
        this.SharedFileID
      )
      .subscribe((result: any) => {
        if (this.commonService.base64regex.test(result.src) == true) {
          this.uploadedPhoto = "data:image/png;base64," + result.src;
        } else {
          this.uploadedPhoto = result.src;
          this.pic_title = result.title;
          this.photo_id = result.id;
        }
        this.previewService.open(this.preview).subscribe({
          complete: () => console.info("complete"),
        });
      });
  }
  get previewContent(): PolymorpheusContent {
    return "this.uploadedPhoto";
  }

  // async viewVideo(fileid, title) {
  //   let sharedFileId = -1;
  //   if (this.sharedType == "others") {
  //     sharedFileId = this.SharedFileID;
  //   }

  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: this.sharedType,
  //       parentId: this.ParentID,
  //       filesType: this.filesType,
  //       sharedFileId: sharedFileId,
  //     },
  //     backdropDismiss: false,
  //     component: VideoPlayerComponent,
  //   });
  //   return this.popover.present();
  // }

  viewVideo(fileid, title) {
    this.imagePreview = true;
    this.file_id = fileid;
    this.vid_title = title;
    if (
      this.filesType == "files" ||
      this.sharedType == "self" ||
      this.sharedType == "bylink"
    ) {
      this.url =
        "video/playVideo/" +
        fileid +
        "?isShared=false&token=" +
       this.localService.getJsonValue(localData.token)
    } else if (this.sharedType == "others" && this.filesType == "") {
      this.url =
        "video/playVideo/" +
        fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token)
    } else if (
      this.filesType == "insideFolder" &&
      this.sharedType == "others"
    ) {
      this.url =
        "video/playSharedWithMeFiles/" +
        fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token) +
        "&folderId=" +
        this.SharedFileID;
    }
    // let data;
    // if (this.sharedType == "files" || this.sharedType == "self") {
    //   data = fileid + "?isShared=false&token=" +this.localService.getJsonValue(localData.token)
    //   console.log("---filesType---", this.fileType)
    // } else if (this.sharedType == "others" && this.filesType == "") {
    //   data = fileid + "?isShared=true&token=" +this.localService.getJsonValue(localData.token)
    //   console.log("---filesType---", this.fileType)
    // } else if (
    //   this.filesType == "insideFolder" &&
    //   this.sharedType == "others"
    // ) {
    // }
    this.filesService.viewVideo(this.url).subscribe((result: any) => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(result.value);
      this.minio = result.object;
    });
    this.previewService.open(this.content || "").subscribe();
  }

  //download files in viewer
  download(filesid): void {
    // console.log(filesid);
    this.downloadID = filesid;
    if (this.downloadID.length > 0) {
      this.downloadID = filesid;
    } else {
      this.downloadID = [filesid];
    }
    this.downloadFilesId = {
      fileId: this.downloadID,
      sharedFile: false,
    };
    //this.ngxService.start();
    this.filesService.downloadFiles(this.downloadFilesId).subscribe(
      (event: any) => {
        this.ngxService.stop();
        this.resportProgress(event);
        this.multiSelect = false;
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
      }
    );
    this.OnSharedFiles(this.ParentID,this.page,this.pageSize);
    this.HighlightRow = null;
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
    this.notificationsService.show("Downloading...").subscribe();
  }

  async viewAudio(fileid, title) {
    console.log("OnmoreDetails");

    let sharedFileId = -1;
    if (this.sharedType == "others") {
      sharedFileId = this.SharedFileID;
      console.log("SharedFileID", this.SharedFileID);
    }

    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: this.sharedType,
        parentId: this.ParentID,
        filesType: this.filesType,
        sharedFileId: sharedFileId,
      },
      backdropDismiss: false,
      component: AudioPlayerComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
    this.showIcon = false;
    this.SharedData = [];
    this,this.toggleInfiniteScroll();
    this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
    });
  }
  

  Onbackbreadcrumb(id, SharedFileID) {
    let index = this.breadcrumbfileslist.findIndex((x) => x === id);
    this.breadcrumbfileslist.splice(index + 1);
    this.breadcrumbfileslist.length = index + 1;
    if (id) {
      this.breadcrumbfiles.length = index + 1;
      this.showIcon = false;
      this.SharedData = [];
      this,this.toggleInfiniteScroll();
      this.OnOpenSharedFiles(id, SharedFileID,this.page1,this.pageSize1);
      this.ParentID = id;
    }

    // console.log("objectId", objectId)
    // if (id) {
    //   var list = document.getElementById("list");
    //   var listItems = list.getElementsByTagName("li");
    //   var last = listItems[listItems.length - 1];
    //   list.removeChild(last);
    //   // this.ParentID = id;
    //   // this.OnSharedFiles(id);
    //   // this.breadcrumbfiles = [];
    //   this.OnOpenSharedFiles(id,objectId);
    // }
  }

  OnhomeFiles() {
    this.showIcon = false;
    this.SharedData = [];
    this,this.toggleInfiniteScroll();
    this.OnSharedFiles(this.localService.getJsonValue(localData.parentId),this.page1,this.pageSize1);
    this.ParentID =this.localService.getJsonValue(localData.parentId);
    this.filesType = "";
    this.breadcrumbfiles = [];
    this.allowUpload = false;
    this.breadcrumbfileslist = [];
    this.multiSelect = false;
  }

  goToDashboard() {
    if (this.localService.getJsonValue(localData.parentId) == this.ParentID) {
      this.router.navigate(["/user/dashboard"]);
    } else {
      this.OnSharedFiles(this.localService.getJsonValue(localData.parentId),this.page,this.pageSize);
      this.ParentID = this.localService.getJsonValue(localData.parentId);
      this.filesType = "";
      this.breadcrumbfiles = [];
      this.multiSelect = false;
    }
  }

  async openOffice(fileid, title,versionId) {
    console.log("openOffice");
    let password;
    if (this.sharedType == "others") {
      password =
        this.filesType == "insideFolder"
          ? versionId + "--parent" + this.SharedFileID
          : versionId + "--parent" + fileid;
      password = "shared" + password;
    }

    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        isShared: this.sharedType == "others" ? true : false,
        password: password,
        versionId : versionId 
      },
      component: CollaboraComponent,
      cssClass: "modal-fullscreen",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.SharedData = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      if (this.filesType == "insideFolder" && this.sharedType == "others"){
        this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
      }
      else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
      {
        this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
      }
      else{
      this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
      }
    });
  }

  async trashFile(FilesId, itemCount, title) {
    if (this.sharedType == "others") {
      this.deleteFileId = {
        fileId: [FilesId],
        sharedFile: true,
      };
      //this.ngxService.start();
      this.filesService
        .removeSharedFiles(this.deleteFileId)
        .subscribe((result: any) => {
          this.SharedData = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
          this.ngxService.stop();
          this.toastr.success(result.message);
          this.multiSelect = false;
          if (result.status === 400) {
            this.ngxService.stop();
          }
        });
    } else if (this.sharedType == "self" || this.sharedType == "bylink") {
      this.popover = await this.popoverController.create({
        component: SharingComponent,
        keyboardClose: false,
        translucent: true,
        componentProps: {
          id: FilesId,
          sharedType: "shares",
          Accesstype: "internal",
          title: title,
        },
        backdropDismiss: false,
        cssClass: "custom-popupclass",
      });
      await this.popover.present();
      return await this.popover.onDidDismiss().then((data) => {
        this.SharedData = [];
        this.showIcon = false;
        this.toggleInfiniteScroll();
        this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
        this.breadcrumbfiles = [];
      });
    }
  }

  OnmoreDetails(id) {
    console.log("OnmoreDetails");

    this.viewDetails = true;
    console.log("id", id);
    this.filesService.filepropertie(id).subscribe((result: any) => {
      this.fileDetails = result;
      this.fileTitle = result.title;
      this.fileType = result.mimeType;
      this.fileid = result.id;
      this.fileicon = result.icon;
      this.description = result.description;
      this.listTagName(id);
      this.createdat = moment(result.createdAt).format("DD MMM YYYY hh:mm A");
      this.lastModifiedDate = moment(result.lastModifiedAt).format(
        "DD MMM YYYY hh:mm A"
      );
      let mimeType = this.fileDetails.mimeType;
      if (!mimetypes[mimeType]) {
        this.fileDetails.mimeType = "UNKNOWN";
      }
      if (!mimetypes[result.mimeType]) {
        this.fileType = "UNKNOWN";
      } else if (mimetypes[result.mimeType]) {
        this.fileType = mimetypes[result.mimeType].fileType;
      }
      this.size = this.getReadableFileSizeString(result.size);
      this.owner = result.owner;
      this.sharedWith = result.sharedWith;
      this.lastModifiedAt = moment(result.lastModifiedAt).fromNow();
      this.activityList = result.activity;
      this.activityList = this.getFilesByactivityAction("USER_LOGIN");
      this.ngxService.stop();
      for (let i = 0; i < this.activityList.length; i++) {
        if (this.activityList[i].userName == this.userName) {
          this.activityList[i].userName = "You";
        }
        this.activityList[i].activityAction = this.activityList[
          i
        ].activityAction
          .replace("FILE_", "")
          .toLowerCase();
        // this.activityList[i].objectMetadata = this.activityList[i].objectMetadata.replace("{filename=", " ");
        // this.activityList[i].objectMetadata = this.activityList[i].objectMetadata.replace("}", " ");
        // this.activityList[i].objectMetadata = this.activityList[i].objectMetadata.replace("}", " ");
        this.activityList[i].timestamp = moment(
          this.activityList[i].timestamp
        ).format("DD/M/YYYY hh:mm A");
      }
    });
  }

  getFilesByactivityAction(activityAction) {
    return this.activityList.filter((x) => x.activityAction != activityAction);
  }

  addDescription() {
    this.onedit = true;
  }

  onAddDiscription(id, description) {
    this.filesService
      .addDiscription(description, id)
      .subscribe((result: any) => {
        // this.toastr.success(result["message"]);
      });
  }

  closeViewDetails() {
    this.onedit = false;
  }

  async publicShare(id, fileid, mimeType) {
    if(mimeType == "httpd/unix-directory"){
      var fileTypes = "folder"
    }
    else {
      var fileTypes = "file"
    }
    this.popover = await this.popoverController.create({
      component: EditpubliclinkComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        sharedId: id,
        fileId: fileid,
        fileTypes: fileTypes
        // sharedType: "files",
        // Accesstype: "public",
        // title: title,
        // selectedfileLength: this.selectedfileLength,
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover
      .onDidDismiss()
      .then((data) => {
        this.selectedfileLength = 0;
        this.SharedData = [];
        this.showIcon = false;
        this.toggleInfiniteScroll();
        if (this.filesType == "insideFolder" && this.sharedType == "others"){
          this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
        }
        else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
        {
          this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
        }
        else{
        this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
        }
        // this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
        this.AllselectCheckbox["checked"] = false;
        this.selectedFiles = [];
        this.allSelected = false;
        this.viewDetails = false;
        if (this.ParentID == this.localService.getJsonValue(localData.searchedId)) {
          this.multiSelect = false;
          // this.multicheckSelect = false;
          this.AllselectCheckbox["checked"] = false;
          this.allSelected = false;
          this.selectedlength = false;
          this.selectedfileLength = 0;
          this.selectedFiles = [];
          this.breadcrumbfiles = [];
          this.viewDetails = false;
        }
      })
      .finally(() => {
        this.selectedfileLength = 0;
        this.selectedFiles = [];
        this.selectedlength = false;
      });
  }

  async documentShare(FilesId, itemCount, title, permission) { 
    if(permission == "CAN_EDIT" && this.filesType != "insideFolder"){
      this.reShare = true;
      this.Onshare(FilesId, itemCount,title);
    }
    else if (this.sharedType == "self" || this.sharedType == "bylink") {
      this.popover = await this.popoverController.create({
        component: SharingComponent,
        keyboardClose: false,
        translucent: true,
        componentProps: {
          id: FilesId,
          sharedType: "shares",
          Accesstype: "internal",
          title: title,
        },
        backdropDismiss: false,
        cssClass: "custom-popupclass",
      });
      await this.popover.present();
      return await this.popover.onDidDismiss().then((data) => {
        this.SharedData = [];
        this.showIcon = false;
        this.toggleInfiniteScroll();
        this.OnSharedFiles(this.ParentID,this.page,this.pageSize);
        this.breadcrumbfiles = [];
      });
    }
  }

  async OnReShare(id, type, title){
    this.reShare = true;
    this.popover = await this.popoverController.create({
      component: SharingComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        sharedType: "files",
        Accesstype: "internal",
        title: title,
        reShare: this.reShare
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.breadcrumbfiles = [];
      this.OnSharedFiles(this.ParentID,this.page,this.pageSize);
      this.viewDetails = false;
      this.reShare = false;
    });
  }

  async Onshare(id, type, title) {
    this.popover = await this.popoverController.create({
      component: SharingComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        sharedType: "files",
        Accesstype: "internal",
        title: title,
        reShare: this.reShare
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.breadcrumbfiles = [];
      this.SharedData = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.OnSharedFiles(this.ParentID,this.page,this.pageSize);
      this.viewDetails = false;
    });
  }

  closePreview(){
    this.imagePreview = false;
    this.SharedData = [];
    this.showIcon = false;
    this.toggleInfiniteScroll();
    if (this.filesType == "insideFolder" && this.sharedType == "others"){
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
    }
    else if (this.filesType == "insideFolder" && (this.sharedType == "self" || this.sharedType == "bylink"))
    {
      this.OnOpenSharedFiles(this.ParentID, this.SharedFileID,this.page,this.pageSize);
    }
    else{
    this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
    }
    // this.OnSharedFiles(this.ParentID,this.page1,this.pageSize1);
  }

// Tags
get createTagFormControls(){
  return this.createTagForm.controls;
}

OnopenField(){
  if(this.isTag === false){
    this.isTag = true;
  }
  else if(this.isTag === true){
    this.isTag = false;
    this.createTagForm.reset();
  }
}
createTagName(){
  if(this.createTagForm.invalid){
    this.toastr.error("Please enter tag name")
  }
  else{
  // this.ngxService.start();
  let data = {
    fileId : this.fileid,
    "tagName": this.createTagForm.value.tagName,
  }
  this.commonService.createTag(data).subscribe((data: any) => {
    if (data.code == 200) {
      this.ngxService.stop();
      this.listTagName(this.fileid)
      this.createTagForm.reset();
      this.isTag = false;
      this.toastr.success(data['message']);
     }
     else if(data.code == 208){
      this.ngxService.stop();
      this.createTagForm.reset();
      this.isTag = false;
      this.toastr.error(data['message']);
     }
     else if(data['message'] == "Tag maximum limit over for this file"){
      this.ngxService.stop();
      this.createTagForm.reset();
      this.isTag = false;
      this.toastr.warning(data['message']);
     }  
  });
  }
}

  uploadNewFile(event){
    console.log("----", event.target.files)
    if (event.target.files.length <= this.uploadFileCount) {
      this.multiUploadedFiles = [];
      this.multiUploadedFiles = event.target.files;
      if (this.multiUploadedFiles[0].webkitRelativePath.includes("/")) {
        //folders
        this.currenDir = "";
        let dirName =
          this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];
        let response = this.commonService
          .checkFolder(this.ParentID, dirName)
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
                this.ParentID,
                this.currenDir + "/"
              );
            } else {
              console.log("folder upload1")
              let FoldName =
                this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];
              this.OnUploadFolder1(
                this.multiUploadedFiles[this.index++],
                this.ParentID,
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
          this.ParentID
        );
      }
    } else if (event.target.files.length > this.uploadFileCount) {
      this.toastr.error("You can upload only " + this.uploadFileCount + " files at a time");
      this.openMenu = false;
    } else if (event.target.files.size > this.uploadFileSize) {
      this.toastr.error("One of the file size is more than " + this.uploadFileSize1);
      this.openMenu = false;
    }
  }

  OnchunkUpload(item, ParentID) {
    this.openMenu = false;
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
        endpoint: `${this.API_URL}file/upload?internalUpload=true&parentId=${ParentID}&overwrite=false`,
        retryDelays: [0, 1000],
        chunkSize: 1000 * 1000,
        metadata: {
          filename: item.name,
          filetype: item.type,
          token: this.AuthorizartionToken,
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
                      ParentID
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
                this.OnchunkUpload(item, ParentID);
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
          this.OnOpenSharedFiles(ParentID, this.SharedFileID, this.page,this.pageSize);
          // if(this.folderPermission != 'CAN_UPLOAD_ONLY'){
          //   this.openFolder(this.SharedFileID ,this.parentId);          
          // }
          // if(this.folderPermission == 'CAN_UPLOAD_ONLY'){
          //   this.showUploadedFiles();        
          // }
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
            ParentID
          );
        },
      });

      this.overwrite = "null";
      upload.start();
    } else if (item.size > this.uploadFileSize) {
      this.toastr.warning(
        "File which is more than " + this.uploadFileSize1 + " cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnchunkUpload(this.multiUploadedFiles[this.index++], ParentID);
    }
  }


  OnUploadFolder1(item, parentId, webkitRelativePath) {
    this.openMenu = false;
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
        endpoint: `${this.API_URL}file/upload?internalUpload=true&parentId=${parentId}&overwrite=false`,
        retryDelays: [0, 1000],
        chunkSize: 1000 * 1000,
        metadata: {
          filename: item.name,
          filetype: item.type,
          token: this.AuthorizartionToken,
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
          this.OnOpenSharedFiles(parentId, this.SharedFileID, this.page,this.pageSize);
          this.toastr.success("Upload successful", "", { timeOut: 1000 });
          if (this.index == this.multiUploadedFiles.length) {
            this.createFolders();
            this.index = 0;
            return;
          }
          this.OnUploadFolder1(
            this.multiUploadedFiles[this.index++],
            parentId,
            webkitRelativePath
          );
        },
      });

      this.overwrite = "null";
      upload.start();
    } else if (item.size > this.uploadFileSize) {
      this.toastr.warning(
        "File which is more than " + this.uploadFileSize1 + " cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnUploadFolder1(
        this.multiUploadedFiles[this.index++],
        parentId,
        webkitRelativePath
      );
    }
  }

  createFolders() {
    if (this.emptyFolder.length > 0) {
      this.commonService
        .CreateEmpthyFolderOnUpload(this.emptyFolder, this.ParentID)
        .subscribe((data) => {
          console.log("empty folder created", data);
          this.emptyFolder = [];
        });
    } else {
      console.log("empty folder created", this.emptyFolder);
    }
  }

  listTagName(id){
    this.commonService.listTag(id).subscribe((data: any) => {
    this.listTag = data;
    //  console.log(">>>>",this.listTag.length)
    //  if(this.listTag.length >= 5){
      
    //  }
    });
  }

  get tagListTotal() {
    return this.showMore ? this.listTag : this.listTag.slice(0,5);
  }

  setInputField(data){
    this.inputValues = data;
    this.searchTagName(this.inputValues);
  }

  searchTagName(inputValues){
    let data = {
      fileId : this.fileid,
      "tagName": inputValues
    }
    this.searchTagList=[];
    this.commonService.searchTag(data).subscribe((data: any) => {
      this.searchTagList = data.tagNames
    });
  }

  onClose(){
    if(this.onclose === false){
      this.onclose = true;
    }
    else if(this.onclose === true){
      this.onclose = false;
    }
  }

  onDeleteTag(tagMappingId){
    // this.ngxService.start();
    this.commonService.deleteTag(tagMappingId).subscribe((data: any) => {
      if (data.responseCode == 200) {
        this.ngxService.stop();
        this.onclose = false;
        this.listTagName(this.fileid);
        this.toastr.success(data['message']);
      }
    });
  }
}
