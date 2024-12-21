import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
  Renderer2,
  Inject,
  HostListener,
  OnDestroy,
  EventEmitter,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "../../service/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import * as moment from "moment";
import { FilesService } from "src/app/service/files.service";
import { ToastController, PopoverController, IonContent } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { saveAs } from "file-saver";
import { MatCheckbox } from "@angular/material/checkbox";
import { FileDeleteConfirmComponent } from "../modalpage/file-delete-confirm/file-delete-confirm.component";
import { PdfViwerComponent } from "../modalpage/pdf-viwer/pdf-viwer.component";
import * as introJs from "intro.js/intro.js";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { TextEditorComponent } from "../modalpage/text-editor/text-editor.component";
import { VideoPlayerComponent } from "../modalpage/video-player/video-player.component";
import { AudioPlayerComponent } from "../modalpage/audio-player/audio-player.component";
import { MoveCopyComponent } from "../modalpage/move-copy/move-copy.component";
import { SharingComponent } from "../modalpage/sharing/sharing.component";
import { PhotoViewerComponent } from "../modalpage/photo-viewer/photo-viewer.component";
import { DOCUMENT } from "@angular/common";
import { PhotosService } from "src/app/service/photos.service";
import { interval as observableInterval } from "rxjs";
import { Subscription } from "rxjs";
import { localData, mimetypes } from "src/environments/mimetypes";

import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from "ngx-file-drop";
import { Upload } from "tus-js-client";
import { environment } from "src/environments/environment.prod";
import { SimpleOuterSubscriber } from "rxjs/internal/innerSubscribe";
import { CollaboraComponent } from "../layouts/ifame/collabora/collabora.component";

//taiga changes
import { TemplateRef } from "@angular/core";
import { PreviewDialogService } from "@taiga-ui/addon-preview";
import { clamp, TuiSwipe } from "@taiga-ui/cdk";
import { TuiDialogContext, TuiNotificationsService } from "@taiga-ui/core";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS } from "@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector";
import { A } from "@angular/cdk/keycodes";
import { RenameFilesComponent } from "../modalpage/rename-files/rename-files.component";
import { DuplicateFilesComponent } from "../modalpage/duplicate-files/duplicate-files.component";
import { FullScreenPopupComponent } from "../modalpage/full-screen-popup/full-screen-popup.component";
import { ManageVersionsComponent } from "../modalpage/manage-versions/manage-versions.component";
import { IonInfiniteScroll } from '@ionic/angular';
import { scan, takeWhile, tap } from "rxjs/operators";
import { ShareComponent } from "../modalpage/share/share.component";
import { LocalService } from "src/environments/local.service";
import { pathToFileURL } from "url";
import { METHODS } from "http";

@Component({
  selector: "app-files",
  templateUrl: "./files.component.html",
  styleUrls: ["./files.component.scss"],
})
export class FilesComponent implements OnInit {
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  @ViewChild("content")
  readonly content?: TemplateRef<TuiDialogContext<void>>;
  introJS = introJs();
  fullImage: any[];
  currentIndex;
  uploadedPhoto: any;
  photo_id: any;
  pic_title: any;
  vid_title: any;
  file_id: any;
  uploadedPhto: string;
  selectedpic: string;
  fileicon: any;
  fileTitle: any;
  fileid: any;
  overwrite: string = "null";
  currentFolder: "";
  currenDir: string;
  dirName: any;
  // maximumPages: number = 50;
  uploadedFileList: any = [];
  uploadedFileList1: any = [];
  reActiveInfinite: boolean = true;
  eventData: any;
  showFilesDataSubscription: Subscription;
  infiniteloader: boolean = true;
  uploadUrl: any =[];
  uploadId: String;
  httpClient: any;
  isTag: boolean = false;
  createTagForm: FormGroup;
  listTag: any = [];
  inputValues: any;
  searchTagList: any= [];

  @HostListener("scroll", ["$event"]) scrolled() {}
  index = 0;
  // id=0;
  length;
  filesType: any = "";
  SharedFileID: number = -1;
  newFolder: boolean = false;
  newTextDoc: boolean = false;
  newDoc: boolean = false;
  newSpreadsheet = false;
  newPresentation = false;
  newFolderName: any;
  public selectedFile: any = File;
  resData: any;
  uploadedFile: any = [];
  fileListView: boolean = true;
  fileGridView: boolean = false;
  image: any;
  reNameFile: boolean = true;
  reNameId: any;
  reName: any;
  ParentID =this.localService.getJsonValue(localData.parentId);
  filesLength: any;
  breadcrumb: any = [];
  breadcrumbfiles: any = [];
  deleteFileId: any = [];
  favoriteFile: any = [];
  downloadFilesId: any = [];
  title: any;
  id: any;
  size: any;
  mimes = mimetypes;
  lastModifiedAt: any;
  lastModifiedDate: any;
  selectedFiles: any = [];
  selectedId: any = [];
  fileId: any = [];
  downloadID: any = [];
  multiSelect: boolean = false;
  allSelected: boolean = false;
  linkForm: FormGroup;
  uploadedFolder: any = [];
  uploadedDocuments: any = [];
  uploadedFolderLength: any;
  uploadedDocumentsLength: any;
  popover: any;
  docsEditor: any;
  fileType: any;
  activityList: any = [];
  onedit: boolean = false;
  createdat: any;
  filenames: string[] = [];
  fileStatus = { status: "", requestType: "", percent: 0 };
  @ViewChildren("checkbox") checkbox: QueryList<ElementRef>;
  unselectId: any;
  page: number = 1;
  allFilesData: any = [];
  filesCount: any = 0; 
  openFolder: boolean = false;
  sortList: any = "Modified At";
  sortValue = "modifiedAt";
  removable: boolean = true;
  newLink: boolean = false;
  direction = "";
  sharedWith: any = [];

  pageEvent: PageEvent;
  pageSize: number = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("toggleButton") toggleButton: ElementRef;
  @ViewChild("menu") menu: ElementRef;
  viewDetails: boolean = false;
  newFileName: any = "";
  uploadLoader: boolean = false;
  dropUploadLoader: boolean = false;
  UploadProgress: boolean = false;
  Uploadcompleted: boolean = false;
  percentDone: any;
  uploadFiles: any = [];
  cancelUpload: boolean = false;
  multiUploadedFiles: any = [];
  // index: number = 0;
  uploadedDoc: any = [];
  cancelUploadCounter: number = 0;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  headercancelUpload: boolean = false;
  sharedlength: any;
  openMenu: boolean = false;
  notALink: boolean = true;
  errormsg: any;
  totalSize = 0;
  total: any;
  breadcrumbfileslist: any = [];
  selectedfileLength: any;
  selectedlength: boolean = false;
  multicheckSelect: boolean = false;
  fileDetails: any = [];
  owner: any;
  description: any;

  listener: () => void;
  reNameDoc: any;
  onFocusInput: boolean = false;
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;
  @ViewChild("MultiselectCheckbox") MultiselectCheckbox: ElementRef;
  @ViewChild("SingleselectCheckbox") SingleselectCheckbox: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  firstlogin: any;
  errorTextDoc: string;
  errorFolder: string;
  photo: any = [];
  subscription: Subscription;
  createdTime: boolean = false;
  dashboardResult: any = [];
  extention: any;
  strname: any;
  stringname: any;
  extenstion: any;
  extenstion1: any;
  name: any;
  renameMimeType: any;
  @HostListener("window:mouseup", ["$event"])
  dropUploadedFiles: any = [];
  emptyFolder: any = [];
  selectedOption: boolean = false;
  singleClickSelect: boolean = false;
  previousParent: any;
  productName = environment.productname;
  uploadFileSize : any;
  uploadFileSize1 : any;
  uploadFileCount : any;
  versionId: any;
  page1: number = 1;
  pageSize1: number = 20;
  showIcon:boolean = false;
  onscroll:boolean = false;
  animationClass: boolean = true;
  clicked : boolean = false;
  onclose: boolean = false;
  showMore : boolean = false;
  isInfiniteScrollShow: boolean = environment.isInfiniteScrollShow;
  uploadProgress$ = new EventEmitter<any>();
  finishedProgress$ = new EventEmitter<any>();
  url1: string =  "http://192.168.100.171:9001"

  mouseUp() {
    if (this.onFocusInput == false) {
      this.reNameFile = true;
    }

    // if (this.selectedOption == false) {
    //   this.multiSelect = false;
    //   this.HighlightRow = null;
    //   // this.AllselectCheckbox["checked"] = false;
    //   // this.selectedlength = false;
    // }
    // if( this.AllselectCheckbox["checked"] == true){
    //   this.multiSelect = true;
    // }
    // if(this.checkboxChecked == true){
    //   this.multiSelect = true;
    // }
  }
  HighlightRow: number;
  selectedRows: any = [];
  ClickedRow: any;
  sortOrder: boolean = false;
  public files: NgxFileDropEntry[] = [];
  uploadProgress = 0;
  AuthorizartionToken =this.localService.getJsonValue(localData.token);
  API_URL = environment.apiUrl;
  userDetails: any = [];
  lastPageEvent: boolean = false;
  zindexToggle: boolean = true;
  sharedType: any = "files";
  //video
  url: any;
  parentId: any;
  minio: any = "not minio";
  checkboxChecked: boolean = false;
  isMobile: boolean = false;
  isLoadingFiles: boolean = true;


  private userName: string = "";

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastCtrl: ToastController,
    private toastr: ToastrService,
    private popoverController: PopoverController,
    private photosService: PhotosService,
    private renderer: Renderer2,
    private localService: LocalService,
    @Inject(PreviewDialogService)
    private readonly previewService: PreviewDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    route.params.subscribe((val) => {
      this.page = 1;
      // this.allPhotos();
      // this.commonService.getDashboardInfo();
      this.getDashboardInfo();
    });

    this.ClickedRow = function (index, id, photo) {
      this.HighlightRow = index;
      this.multiSelect = true;
      if (id != null) {
        this.selectedFiles = id;
        if (photo.src != "data:image/png;base64,null") {
          this.pDetails = photo;
        }
      }
    };

    this.commonService.storeHeader("Photos / All Photos");
    route.params.subscribe((val) => {
      this.OnshowAllFiles(this.localService.getJsonValue(localData.parentId),this.page,this.pageSize);
      // this.commonService.getDashboardInfo();
      this.getUserDetail();
      this.openMenu = false;
      this.viewDetails = false;
      this.newFolder = false;
      this.newTextDoc = false;
      this.newDoc = false;
      this.newSpreadsheet = false;
      this.newPresentation = false;
      this.errorTextDoc = "";
      this.errorFolder = "";
    });

    this.ClickedRow = function (index, id, clickEvent) {
      // if (clickEvent.ctrlKey) {
      //   let selected = id
      //   for(let i = 0; i < this.selectedFiles.length; i++){
      //     if(selected == this.selectedFiles[i]){
      //       const indexRow = this.selectedFiles.indexOf(selected);
      //       if (indexRow > -1) {
      //         this.selectedFiles.splice(indexRow, 1);
      //       }
      //     }
      //   }
      //   this.selectedFiles.push(selected);
      //   this.selectedRows.push(index)
      //   console.log(this.selectedFiles)
      //   this.HighlightRow = this.selectedRows;
      //   this.multiSelect = true;
      // } else {
      //   this.HighlightRow = index;
      //   this.multiSelect = true;
      //   this.selectedFiles = id;
      // }
      this.HighlightRow = index;
      this.multiSelect = true;
      this.selectedFiles = id;
      this.singleClickSelect = true;
      this.openMenu = false;
      this.viewDetails = false;
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
      this.selectedlength = false;
    };

    this.commonService.storeHeader("Files / All Files");
    this.commonService.storeStorageinfo(true);
  
    this.subscription = this.commonService.getClick().subscribe((message) => {
      if (message == "click") {
        this.openMenu = false;
        this.viewDetails = false;
        this.newFolder = false;
        this.newTextDoc = false;
        this.newDoc = false;
        this.newSpreadsheet = false;
        this.newPresentation = false;
        this.errorTextDoc = "";
        this.errorFolder = "";
      }
    });

    this.subscription = this.commonService.getpath().subscribe((message) => {
      if (message == "path") {
        // this.OnshowAllFiles(this.localService.getJsonValue(localData.parentId),this.page1,this.pageSize1);
        this.ParentID =this.localService.getJsonValue(localData.parentId);
        this.selectedFiles = [];
        this.breadcrumbfiles = [];
        this.openMenu = false;
        this.viewDetails = false;
        this.newFolder = false;
        this.newTextDoc = false;
        this.newDoc = false;
        this.newSpreadsheet = false;
        this.newPresentation = false;
        this.errorTextDoc = "";
        this.errorFolder = "";
      }
    });

    this.introJS.setOptions({
      steps: [
        {
          element: "#step11",
          intro:
            "Add New Document, you can upload files and folders, create folder, create text document, create document, create spreadsheet and create presentation",
          position: "left",
        },
        {
          element: "#step12",
          intro: "Your files & folders count",
          position: "left",
        },
        {
          element: "#step13",
          intro: "You can filter your files & folders",
          position: "left",
        },
        {
          element: "#step14",
          intro: "You can go to list/grid view",
          position: "left",
        },
        {
          element: "#step15",
          intro: "You can multiple trash, download, move, share,..",
          position: "left",
        },
      ],
    });
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
    }
    this.firstlogin = this.localService.getJsonValue(localData.firstLogin);
    this.userName =this.localService.getJsonValue(localData.username)
    this.docsEditor = this.localService.getJsonValue(localData.docsEditor);
    this.linkForm = this.fb.group({
      link: new FormControl("", Validators.required),
      URL: new FormControl("", Validators.required),
    });
    this.createTagForm = this.fb.group({
      tagName: new FormControl("", Validators.required),
    });

  }
  allPhotos() {
    this.ngxService.start();
    let data = {
      asc: this.sortOrder,
      pageNb: this.page,
      parentId: 0,
      sortBy: this.sortValue,
      step: this.pageSize,
    };
    this.photosService.showAllPhots(data).subscribe((result: any) => {
      this.uploadedPhoto = result.childern;
      var arr = [];
      this.uploadedPhoto.forEach(function (i) {
        arr.push({ image: i.src, title: i.title });
      });
      this.fullImage = arr;
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

  onFocusInEvent(event: any) {
    this.onFocusInput = true;
    if (this.onFocusInput == true) {
      this.reNameFile = false;
      this.HighlightRow = null;
      this.multiSelect = false;
      // this.multicheckSelect = false;
    }
  }

  onFocusInMulti(event: any) {
    this.selectedOption = true;
    if (this.selectedOption == true) {
      this.multiSelect = true;
      // this.multicheckSelect = false;
    }
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
    this.multiSelect = false;
    this.addListener();
    this.viewDetails = false;
  }

  OngetSortbysortList() {
    this.OngetSort(this.sortList);
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
  }

  handleClose() {
    this.openMenu = false;
    this.newFolder = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    this.HighlightRow = null;
    this.multiSelect = false;
    // this.multicheckSelect = false;
    this.removeListener();
  }

  moreActions() {
    // this.multiSelect = false;
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

  fileListViewShow() {
    this.uploadedFile = [];
    this.page = 1;
    // this.toggleInfiniteScroll();
    this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    this.fileListView = true;
    this.isLoadingFiles = true;
    this.showIcon = false;
    this.fileGridView = false;
    this.openMenu = false;
    this.newFolder = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    this.multiSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
  }

  fileGridViewShow() {
    this.uploadedFile = [];
    this.page = 1;
    // this.toggleInfiniteScroll();
    this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    this.fileGridView = true;
    this.isLoadingFiles = true;
    this.showIcon = false;
    this.fileListView = false;
    this.openMenu = false;
    this.newFolder = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    this.multiSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
  }

  scrollToTop(el): void {
      const duration = 600;
      const interval = 5;
      const moveEl = el.scrollTop * interval / duration;
     
      observableInterval(interval).pipe(
        scan((acc, curr) => acc - moveEl, el.scrollTop),
        tap(position => el.scrollTop = position),
        takeWhile(val => val > 0)).subscribe();
    }
  scrollTop(el) {
    el.scrollTop = 0;
    }

  createNewFile() {
    this.newFolder = true;
    this.newTextDoc = false;
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#newfolder");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
  }
  createNewTextDoc() {
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = true;
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#newTextDoc");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorFolder = "";
  }

  //docs
  createNewDoc() {
    this.newTextDoc = false;
    this.newFolder = false;
    this.newLink = false;
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#newDoc");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);
    this.newDoc = true;
    this.newSpreadsheet = false;
    this.newPresentation = false;
  }
  createNewSpreadsheet() {
    this.newTextDoc = false;
    this.newFolder = false;
    this.newLink = false;
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#newSpreadsheet");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);
    this.newDoc = false;
    this.newSpreadsheet = true;
    this.newPresentation = false;
  }
  createNewPresentation() {
    this.newTextDoc = false;
    this.newFolder = false;
    this.newLink = false;
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#newPresentation");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = true;
  }

  OncreateFolder($event) {
    this.newFolderName = $event.target.value;
  }

  uploadFile(event) {
    console.log("multiUploadedFiles", event.target.files)
    if(event.target.files.size == 0){
      console.log("filesize", event.target.files.size)
      this.toastr.error("Can't upload")
    }
    else if (event.target.files.length <= this.uploadFileCount) {
      this.multiUploadedFiles = [];
      this.multiUploadedFiles = event.target.files;
      var parentIdLocal = this.ParentID
      console.log("parentIdLocal", parentIdLocal)
      console.log("multiUploadedFiles", this.multiUploadedFiles)

      console.log("Started");
      if (this.multiUploadedFiles[0].webkitRelativePath.includes("/")) {
        //folders
        this.currenDir = "";
        let dirName =
          this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];
        let response = this.commonService
          .checkFolder(parentIdLocal, dirName)
          .subscribe(async (result: any) => {
            if (result.code == 200) {
              this.currenDir = result.object;
              var index =
                this.multiUploadedFiles[0].webkitRelativePath.indexOf("/");
              let item =
                this.currenDir +
                "/" +
                this.multiUploadedFiles[0].webkitRelativePath.substring(
                  index + 1
                );
              console.log(item, "item");
              // let item = this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];

              this.OnUploadFolder1(
                this.multiUploadedFiles[this.index++],
                parentIdLocal,
                this.currenDir + "/"
              );
            } else {
              console.log(
                this.multiUploadedFiles[0].webkitRelativePath,
                " not exist"
              );
              let FoldName =
                this.multiUploadedFiles[0].webkitRelativePath.split("/")[0];

              this.OnUploadFolder1(
                this.multiUploadedFiles[this.index++],
                parentIdLocal,
                FoldName + "/"
              );
            }
          });
        // this.toastr.success("Uploading...!", "", { timeOut: 1000 });
        this.currenDir = "";
      } else {
        //files
        this.OnchunkUpload1(
          this.multiUploadedFiles[this.index++],
          parentIdLocal
        );
        // this.uploadMultipartFile(
        //   this.multiUploadedFiles[this.index++],
        //   parentIdLocal
        // );
       
      }
    } else if (event.target.files.length > this.uploadFileCount) {
      this.toastr.error(
        "You can upload only " + this.uploadFileCount + " files at a time"
      );
      this.openMenu = false;
    } else if (event.target.files.size > this.uploadFileSize) {
      this.toastr.error("One of the file size is more than" + this.uploadFileSize1);
      this.openMenu = false;
    }
    
  }

  //chunkUpload

  public async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  //   async OnchunkUpload(multiUploadedFiles, parentId) {
  //     this.openMenu = false;
  //     this.back();

  //     await this.asyncForEach(multiUploadedFiles, async (file) => {
  //       if (!file.startupload) {
  //         console.log("Uploading");
  //         this.toastr.success("Uploading...!");
  //         this.uploadProgress = 0;

  //         const upload = await new Upload(file, {
  //           endpoint: `${this.API_URL}file/upload?parentId=${parentId}`,
  //           retryDelays: [0, 1000],
  //           //overridePatchMethod: true, // Because production-servers-setup doesn't support PATCH http requests
  //           chunkSize: 1000 * 1000,
  //           metadata: {
  //             filename: file.name,
  //             filetype: file.type,
  //             token: this.AuthorizartionToken,
  //           },
  //           onError: async (error) => {
  //             // error.toString().includes("No Space Available")
  //             const toast = await this.toastCtrl.create({
  //               message: "Upload failed: " + error,
  //               duration: 3000,
  //               position: "top",
  //             });
  //             this.errormsg = error.toString().includes("No Space Available")
  //               ? "No Space Available"
  //               : "Oops, something went wrong. Please try again.";
  //             this.toastr.warning(this.errormsg);
  //           },
  //           onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
  //             this.uploadProgress = Math.floor(
  //               (bytesAccepted / bytesTotal) * 100
  //             );
  //             this.commonService.storeUploadProgress(file);
  //             this.uploadLoader = true;
  //             file.percentDone = this.uploadProgress;
  //             file.Uploadcompleted = false;
  //             this.headerUploadProgress = true;
  //             this.headerUploadcompleted = false;
  //             //this.changeDetectionRef.detectChanges();
  //           },
  //           onSuccess: async () => {
  //             this.uploadProgress = 100;
  //             this.uploadLoader = true;
  //             this.OnshowAllFiles(this.ParentID);
  //             //this.commonService.storeStorageinfo(true);
  //             file.percentDone = this.uploadProgress;
  //             file.Uploadcompleted = true;
  //             this.headerUploadProgress = false;
  //             this.headerUploadcompleted = true;
  //             //this.changeDetectionRef.detectChanges();
  //             const toast = await this.toastCtrl.create({
  //               message: "Upload successful",
  //               duration: 3000,
  //               position: "top",
  //             });
  //             console.log("onSuccess");
  //             toast.present();
  //           },
  //         });

  //         /*   console.log(upload.findPreviousUploads());
  //         upload.findPreviousUploads().then(function (previousUploads) {
  //           // Found previous uploads so we select the first one.
  //           if (previousUploads.length) {
  //             console.log(previousUploads);
  //             upload.resumeFromPreviousUpload(previousUploads[0]);
  //           }
  //         });
  //  */
  //         upload.start();
  //       }
  //     });
  //     // for (let i = 0; i < this.multiUploadedFiles.length; i++) {

  //     // }
  //   }

  async OnchunkUpload1(item, parentIdLocal) {
    // console.log("Uploading file" + item);
    this.openMenu = false;
    // for (let i = 0; i < this.multiUploadedFiles.length; i++) {  
    if (!item.startupload && item.size <= this.uploadFileSize && item.size > 0) {
      // this.toastr.success("Uploading...!", "", { timeOut: 1000 });
      this.uploadProgress = 0;
      console.log("^^^^^^^^^^^^^^^^^66" + item.webkitRelativePath);

      // let foldering = item.webkitRelativePath ? item.webkitRelativePath : " ";
      let foldering;
      let folderLength = item.webkitRelativePath.split("/")[0].length;
      //   ? webkitRelativePath +
      //     item.webkitRelativePath.substring(folderLength + 1)
      //   : " ";

      if (item.webkitRelativePath) {
        foldering =
          item.webkitRelativePath +
          item.webkitRelativePath.substring(folderLength + 1);
        this.overwrite = "false";
      } else {
        foldering = " ";
      }
      // const FILE_CHUNK_SIZE = 5000000; // 5MB
      // const fileSize = item.size;
      // const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1;
      // let start, end, blob;
      // let uploadPartsArray = [];
      // let countParts = 0;

      // let orderData = [];
      // let data = {
      //   "filename": item.name,
      //   "partCount": NUM_CHUNKS,
      //   "contentType": item.type,
      // }
      // this.commonService.getPreSignedUrl(data).subscribe((result: any) => {
      //   let uploadUrls = [];
      //   uploadUrls = result.uploadUrls;
      //   console.log("uploadedFiles",uploadUrls)
      //   for(let i =0;i < uploadUrls.length; i++)
      //   {
      //     this.uploadUrl = uploadUrls[i];
      //     console.log("items",this.uploadUrl)

      // fetch(this.uploadUrl,{
      //   method: 'PUT',
      //   body: item
      // }).then(() => {
      const upload = new Upload(item,{
        // endpoint: this.uploadUrl,
        endpoint: `${this.API_URL}file/upload?parentId=${parentIdLocal}&overwrite=${this.overwrite}`,
        retryDelays: [0, 1000],
        // overridePatchMethod: true, // Because production-servers-setup doesn't support PATCH http requests
        chunkSize: 1000*1000,
        metadata: {
          filename: item.name,
          filetype: item.type,
          token: this.AuthorizartionToken,
          folder: foldering,
        },
        onAfterResponse(req, res) {
            console.log(res.getBody);
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
                    this.OnchunkUpload1(
                      this.multiUploadedFiles[this.index++],
                      parentIdLocal
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
                this.OnchunkUpload1(item, parentIdLocal);
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
          // this.httpClient
          // .request(req)
          // .subscribe((event: HttpEvent<any>) => {
          //   switch (event.type) {
          //     case HttpEventType.UploadProgress:
            this.uploadProgress =
            Math.floor((bytesAccepted / bytesTotal) * 100) + 1;
          this.commonService.storeUploadProgress(item);
          this.uploadLoader = true;
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = false;
          this.headerUploadProgress = true;
          this.headerUploadcompleted = false;
          //this.changeDetectionRef.detectChanges();
            // }

          // if (event instanceof HttpResponse) {
          //   const currentPresigned = orderData.find(item => item.presignedUrl === event.url);

          //   countParts++;
          //   uploadPartsArray.push({
          //     ETag: event.headers.get('ETag').replace(/[|&;$%@"<>()+,]/g, ''),
          //     PartNumber: currentPresigned.index
          //   });

          //   if (uploadPartsArray.length === NUM_CHUNKS) {
          //     this.httpClient.post(`${this.url}/multipart/complete`, {
          //       fileName: encodeURIComponent(item.name),
          //       parts: uploadPartsArray.sort((a, b) => {
          //         return a.PartNumber - b.PartNumber;
          //       }),
          //       // uploadId: OnchunkUpload1.item.uploadId
          //     }).toPromise()
          //       .then(res => {
          //         this.finishedProgress$.emit({
          //           data: res
          //         });
          //       });
          //   }
          // }
        // });
        },
        
        onSuccess: async () => {
          // if (item.size > 9771209) {
          this.commonService.storeStorageinfo(true);
          // console.log("inside if")
          // }
          this.uploadProgress = 100;
          this.uploadLoader = true;
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1,true);
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = true;
          this.headerUploadProgress = false;
          this.headerUploadcompleted = true;
          //this.changeDetectionRef.detectChanges();
          this.toastr.success("Upload successful", "", { timeOut: 1000 });
          // const toast = await this.toastCtrl.create({
          //   message: "Upload successful",
          //   duration: 3000,
          //   position: "top",
          // });
          // console.log("onSuccess");
          // toast.present();
          if (this.index == this.multiUploadedFiles.length) {
            this.createFolders();
            this.index = 0;
            return;
          }
          this.OnchunkUpload1(
            this.multiUploadedFiles[this.index++],
            parentIdLocal
          );
        },
      });
    
    
      this.overwrite = "null";
      upload.start();
      console.log("sadsadasds"+JSON.stringify(upload.options.headers));

    // },
    // )}
  // });
    
    } else if (item.size > this.uploadFileSize) {
      this.toastr.warning(
        "File which is more than" + this.uploadFileSize1 + " cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnchunkUpload1(this.multiUploadedFiles[this.index++], parentIdLocal);
    }
    else if(item.size == 0){
      this.toastr.error("File size of 0 KB cannot be uploaded",item.name,
        { timeOut: 3000 });
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnchunkUpload1(this.multiUploadedFiles[this.index++], parentIdLocal);
    }
  }




  OnUploadFolder1(item, parentIdLocal, webkitRelativePath) {
    // console.log("Uploading file" + item);
    this.openMenu = false;
    // for (let i = 0; i < this.multiUploadedFiles.length; i++) {
    console.log(item.startupload, item.size);
    if (
      !item.startupload &&
      item.size <= this.uploadFileSize &&
      item.size > 0
    ) {
      // this.toastr.success("Uploading...!", "", { timeOut: 1000 });
      this.uploadProgress = 0;
      let folderLength = item.webkitRelativePath.split("/")[0].length;
      let foldering;
      //   ? webkitRelativePath +
      //     item.webkitRelativePath.substring(folderLength + 1)
      //   : " ";

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
        endpoint: `${this.API_URL}file/upload?parentId=${parentIdLocal}&overwrite=${this.overwrite}`,
        retryDelays: [0, 1000],
        //overridePatchMethod: true, // Because production-servers-setup doesn't support PATCH http requests
        chunkSize: 1000 * 1000,
        metadata: {
          filename: item.name,
          filetype: item.type,
          token: this.AuthorizartionToken,
          folder: foldering,
        },

        onError: async (error) => {
          // error.toString().includes("No Space Available")
          // let state = {...that.state};
					// error during transfer
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
          //this.changeDetectionRef.detectChanges();
        },
        onSuccess: async () => {
          // if (item.size > 9771209) {
          this.commonService.storeStorageinfo(true);
          // console.log("inside if")
          // }
          this.uploadProgress = 100;
          this.uploadLoader = true;
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1,true);
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = true;
          this.headerUploadProgress = false;
          this.headerUploadcompleted = true;
          //this.changeDetectionRef.detectChanges();
          this.toastr.success("Upload successful", "", { timeOut: 1000 });
          // const toast = await this.toastCtrl.create({
          //   message: "Upload successful",
          //   duration: 3000,
          //   position: "top",
          // });
          // console.log("onSuccess");
          // toast.present();
          if (this.index == this.multiUploadedFiles.length) {
            this.createFolders();
            this.index = 0;
            return;
          }
          this.OnUploadFolder1(
            this.multiUploadedFiles[this.index++],
            parentIdLocal,
            webkitRelativePath
          );
        },
      });

      this.overwrite = "null";
      upload.start();

    } else if (item.size > this.uploadFileSize) {
      this.toastr.warning(
        "File which is more than" + this.uploadFileSize1 + " cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnUploadFolder1(
        this.multiUploadedFiles[this.index++],
        parentIdLocal,
        webkitRelativePath
      );
    }
  }

  createFolders() {
    if (this.emptyFolder.length > 0) {
      this.commonService
        .CreateEmpthyFolderOnUpload(this.emptyFolder, this.ParentID)
        .subscribe((data) => {
          // console.log("empty folder created", data);
          this.emptyFolder = [];
        });
    } else {
      // console.log("empty folder created", this.emptyFolder);
    }
  }
  OnchunkUpload2(item, parentIdLocal) {
    console.log("Uploading file 1" + item);
    this.openMenu = false;
    if (!item.startupload && item.file.size <= this.uploadFileSize) {
      console.log("file size---", item.file.size);
      // // for (let i = 0; i < this.multiUploadedFiles.length; i++) {
      // if (!item.startupload) {
      // this.toastr.success("Uploading...!", "", { timeOut: 1000 });
      this.uploadProgress = 0;
      console.log("Uploading file" + item.relativePath);
      let foldering = item.relativePath ? item.relativePath : " ";
      console.log("foldering  OnchunkUpload2");
      const upload = new Upload(item.file, {
        endpoint: `${this.API_URL}file/upload?parentId=${parentIdLocal}&overwrite=${this.overwrite}`,
        retryDelays: [0, 1000],
        //overridePatchMethod: true, // Because production-servers-setup doesn't support PATCH http requests
        chunkSize: 1000 * 1000,
        metadata: {
          filename: item.file.name,
          filetype: item.file.type,
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
                    this.OnchunkUpload1(
                      this.multiUploadedFiles[this.index++],
                      parentIdLocal
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
                this.OnchunkUpload1(item, parentIdLocal);
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
          console.log("CONSOLE LOG ONCHUNKUPLoAD2");

          this.uploadProgress =
            Math.floor((bytesAccepted / bytesTotal) * 100) + 1;
          this.commonService.storeUploadProgress(item.file);
          this.uploadLoader = true;
          item.file.percentDone = this.uploadProgress;
          item.file.Uploadcompleted = false;
          this.headerUploadProgress = true;
          this.headerUploadcompleted = false;
          //this.changeDetectionRef.detectChanges();
        },
        onSuccess: async () => {
          // if (this.totalSize > 9771209) {
          this.commonService.storeStorageinfo(true);
          // console.log("inside if")
          // }
          this.uploadProgress = 100;
          this.uploadLoader = true;
          this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
          item.file.percentDone = this.uploadProgress;
          item.file.Uploadcompleted = true;
          this.headerUploadProgress = false;
          this.headerUploadcompleted = true;
          //this.changeDetectionRef.detectChanges();
          this.toastr.success("Upload successful", "", { timeOut: 1000 });
          // const toast = await this.toastCtrl.create({
          //   message: "Upload successful",
          //   duration: 3000,
          //   position: "top",
          // });
          console.log("onSuccess");
          // toast.present();
          if (this.index == this.dropUploadedFiles.length) {
            this.dropUploadedFiles = [];
            this.createFolders();

            this.index = 0;
            return;
          }
          this.OnchunkUpload2(
            this.dropUploadedFiles[this.index++],
            parentIdLocal
          );
        },
      });
      console.log("upload started");
      this.overwrite = "null";
      upload.start();
    } else if (item.size > this.uploadFileSize) {
      this.toastr.warning(
        "File which is more than " + this.uploadFileSize1 + " cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.dropUploadedFiles.length) {
        this.index = 0;
        this.dropUploadedFiles.splice(this.index);
        return;
      }
      this.OnchunkUpload2(this.dropUploadedFiles[this.index++], parentIdLocal);
    }
    else if(item.size == 0){
      this.toastr.error("File size of 0 KB cannot be uploaded",item.name,
        { timeOut: 3000 });
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnchunkUpload2(this.dropUploadedFiles[this.index++], parentIdLocal);
    }
  }

  goToDashboard() {
    let parentID =this.localService.getJsonValue(localData.parentId);
    if (parentID == this.ParentID) {
      this.router.navigate(["/user/dashboard"]);
      this.commonService.storeBackBtnVal("true");
    } else {
      if (this.ParentID == parentID) {
        this.router.navigate(["/user/dashboard"]);
        this.commonService.storeBackBtnVal("true");
      } else {
        this.OnshowAllFiles(this.previousParent,this.page,this.pageSize);
        this.ParentID = this.previousParent;
        this.selectedFiles = [];
        this.openMenu = false;
        this.newFolder = false;
        this.newLink = false;
        this.newTextDoc = false;
        this.newDoc = false;
        this.newSpreadsheet = false;
        this.newPresentation = false;
        this.errorTextDoc = "";
        this.errorFolder = "";
        this.multiSelect = false;
        // this.multicheckSelect = false;
        this.breadcrumbfiles.pop();
      }
    }
  }

  OnNewFolder() {
    //this.ngxService.start();
    let mimeType = "any";
    this.commonService
      .CreateNewFile(this.newFolderName, mimeType, this.ParentID)
      .subscribe(
        (data) => {
          this.ngxService.stop();
          this.newFolder = false;
          this.openMenu = false;
          if (data.responseCode === 201) {
            this.uploadedFile = [];
            this.showIcon = false;
            this.clicked = false;
            this.openMenu = false;
            this.toastr.success("Folder Created Successfully"); 
            this.toggleInfiniteScroll();          
            this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
            // this.commonService.storeStorageinfo(true);
            this.newFolderName = "";
            this.errorFolder = "";
          } else if (data.responseCode === 406) {
            this.openMenu = false;
            this.clicked = false;
            this.toastr.error(data["message"]);
            this.newFolderName = "";
          }
        },
        (error) => {
          this.newFolderName = "";
          this.newFolder = false;
          this.openMenu = false;
          this.clicked = false;
          this.ngxService.stop();
          if (error.status === 400) {
            this.toastr.error("Please Enter the Name");
            this.clicked = false;
            // this.errorFolder = "Please Enter New Folder Name";
            this.errorTextDoc = "";
            this.openMenu = true;
            this.newFolder = true;
          }
        }
      );
  }

  get linkFormControls() {
    return this.linkForm.controls;
  }

  onFocusInNewFolder() {
    this.errorFolder = "";
    this.errorTextDoc = "";
  }

  getFolderByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType === mimeType);
  }

  getFilesByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType != mimeType);
  }

  OnshowAllFiles(parentId,page,pageSize, clearList=false) {
    //this.ngxService.start();
    if (clearList){
      this.uploadedFile = [];
    }
    let data = {
      asc: this.sortOrder,
      pageNb: page,
      parentId: parentId,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.filesService.OnshowFiles(data).subscribe(
      (result: any) => {
      if(this.page == 1)
          this.uploadedFile = []
        // this.ngxService.stop();
        this.showIcon = true;
        this.HighlightRow = null;
        // this.multiSelect = false;
        this.isLoadingFiles = false;
        // this.multicheckSelect = false;
        this.photo = [];
        this.previousParent = result.previousParent;
        this.uploadedFile = this.uploadedFile.concat(result.childern);
        console.log(this.uploadedFile);
          // this.uploadedFileList = result.childern;
        // this.uploadedFile.push(...this.uploadedFileList)
        // this.uploadedFile = [].concat(this.uploadedFileList);
        // this.uploadedFile.concat(this.uploadedFileList);
        //   console.log(this.uploadedFile);
        //   var arr = [];
        // this.uploadedFile.forEach(function (i) {
        //   arr.push({ image: i.icon, title: i.title })
        // })
        // this.fullImage = arr;
        // console.log(this.fullImage);

        // this.allFilesData = result.childern;

        this.filesCount = result.count;
        console.log("filescount",this.filesCount)
        this.filesLength = this.uploadedFile.length;
        console.log(this.filesLength ,'this.filesLength ')
        // if (this.allFilesData.length >= 1) {
        //   this.uploadedFile.push(...this.allFilesData);
        if (this.filesLength == 0 && this.lastPageEvent == true && this.filesCount != 0) {
          this.getPevpage();
        }
        this.ParentID = parentId;
        this.uploadedFile.forEach(file => {
          if (
            this.commonService.base64regex.test(file.icon) ==
            true
          ) {
            file.icon =
              "data:image/png;base64," + file.icon;
          }
          // let size = this.getReadableFileSizeString(file.size);
          // file.sizeRead = size;
          file.modifiedAtRead = moment(
            file.modifiedAt
          ).fromNow();
          file.createdAtRead = moment(
            file.createdAt
          ).fromNow();
          let size = this.getReadableFileSizeString(file.size);
          file.sizeRead = size;
          let mimeType = file.mimeType;

          if (!mimetypes[mimeType]) {
            file.mimeType = "UNKNOWN";
          }

          if (
            mimeType == "image/png" ||
            mimeType == "image/jpg" ||
            mimeType == "image/jpeg" ||
            mimeType == "image/gif" ||
            mimeType == "link"
          ) {
            this.photo.push(file);
          }
          if (!(mimeType == "httpd/unix-directory")) {
            this.extention = file.title.split(".").pop();
            file.extention = this.extention;
          }
          if (!(mimeType == "httpd/unix-directory")) {
            let extn: any;
            extn = file.title;
            if (extn.indexOf(".") == -1) {
              this.extention = "Unknown";
              file.extention = this.extention;
            }
          }
        }); 
        if (result.status === 500) {
          this.ngxService.stop();
        }
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  loadData(event){
    console.log("exzaexza")
    if(this.filesCount > 20){
      setTimeout(() => { 
      console.log("Done ",event);
      console.log("123")
      this.page = this.page + 1;
      if(this.AllselectCheckbox["checked"] == true){
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      this.AllselectCheckbox["checked"] = false;
      this.selectedFiles = [];
      this.allSelected = false;
      this.selectedlength = false;
      this.multiSelect = false;
      }
      else{
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      }
      event.target.complete();
      console.log("this.page "+this.page);
      console.log("this.filesCount "+this.filesCount);
      console.log("this.pageSize "+this.pageSize);
      console.log("this.mod "+ Math.ceil(this.filesCount / this.pageSize));
      if(this.page === Math.ceil(this.filesCount / this.pageSize)){
        event.target.disabled = true;
      }

    },3000);
    }
    else{
      console.log("OOPO",this.filesCount)
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



  onScrollDown() {
    this.page = this.page + 1;
    if (this.page > 0) {
      console.log("down scrolled");
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    }
  }

  getPevpage() {
    this.page = 1;
    this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.lastPageEvent = true;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.AllselectCheckbox["checked"] = false;
    this.multiSelect = false;
    this.allSelected = false;
    // this.multicheckSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
  }

  OnClickClose() {
    this.openMenu = false;
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
  }

  //Get sort value
  OngetSort(value) {
    this.sortList = value;
    this.removable = true;
    this.sortValue = value;

    if (this.sortOrder == false) {
      this.sortOrder = true;
    } else if (this.sortOrder == true) {
      this.sortOrder = false;
    }
    if (this.sortValue === "Title") {
      this.createdTime = false;
      this.sortValue = "title";
    } else if (this.sortValue === "Size") {
      this.createdTime = false;
      this.sortValue = "size";
    } else if (this.sortValue === "Created At") {
      this.createdTime = true;
      this.sortValue = "createdAt";
    } else if (this.sortValue === "Modified At") {
      this.createdTime = false;
      this.sortValue = "modifiedAt";
    }
    this.uploadedFile = [];
    this.showIcon = false;
    this.toggleInfiniteScroll();
    this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
  }

  matChipremove() {
    this.removable = false;
  }

  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    let sizeRead = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    return sizeRead;
  }

  OnopenFile(id, mimeType, title, versionId) {
    this.selectedfileLength = 0;
    this.selectedlength = false;
    this.multiSelect = false;
    this.selectedFiles = [];
    // this.multicheckSelect = false;
    this.openMenu = false;
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    this.breadcrumbfileslist.push(id);
    // console.log("breadcrumb", this.breadcrumbfileslist);
    // console.log(id, mimeType, title);
    if (id && this.reNameFile === true) {
      switch (mimetypes[mimeType].editor) {
        case "FOLDER":
          this.openFolder = true;
          this.ParentID = id;
          this.selectedFile = [];
          this.uploadedFile = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(id,this.page1,this.pageSize1);
          this.breadcrumb = {
            title: title,
            id: id,
          };
          this.allSelected = false;
          this.AllselectCheckbox["checked"] = false;
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
          this.viewTextEdit(id, title);
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
  }

  save() {
    this.openMenu = false;
    let data = {
      url: this.linkForm.value.URL,
      linkName: this.linkForm.value.link,
      mimeType: "link",
      parentId: this.ParentID,
    };
    this.commonService.saveLink(data).subscribe((result: any) => {
      if (result["responseCode"] == 201) {
        this.ngxService.stop();
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      }
    });
    this.notALink = true;
    this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
  }

  createNewLink() {
    this.notALink = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.newFolder = false;
  }

  async openOffice(fileid: any, title: any,versionId:any) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: "files",
        versionId : versionId 

      },
      component: CollaboraComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    });
  }

  // async openOffice(fileid, title) {

  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       isShared: false,
  //     },
  //     component: FullScreenPopupComponent,
  //     cssClass: "modal-fullscreen",
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     this.OnshowAllFiles(this.ParentID);
  //   });
  // }

  OnRename(id, title, mimeType) {
    this.reNameDoc = title;
    this.reNameFile = false;
    this.reNameId = id;
    this.renameMimeType = mimeType;
    this.strname = this.reNameDoc;
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#reNameFile");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);

    if (this.renameMimeType == "httpd/unix-directory") {
      this.strname = this.reNameDoc;
    } else {
      //  this.strname = this.strname.split(".").shift();
      const index = title.lastIndexOf(".");
      this.strname = title.substring(0, index);
      this.extenstion = this.reNameDoc.split(".").pop();
    }
  }

  OnCreateNewName($event) {
    this.reName = $event.target.value;
    console.log("eventttt",this.reName)
    this.HighlightRow = null;
    this.multiSelect = false;
    if (this.reName == "") {
      this.toastr.warning("Please enter name");
      this.reNameFile = false;
    }
    // this.multicheckSelect = false;
    else if (
      !(this.renameMimeType == "httpd/unix-directory") &&
      this.reName != ""
    ) {
      this.name = this.reName + "." + this.extenstion;
    } else {
      this.name = this.reName;
    }
  }

  OnreNameFiles(id) {
    if (this.reName === this.reNameDoc || this.reName == "") {
      // this.toastr.warning("Please enter name");
      this.ngxService.stop();
      this.reNameFile = true;
      return;
    } else {
      this.commonService.CreateReName(id, this.name).subscribe(
        (data) => {
          if (data.code == 200) {
            this.ngxService.stop();
            this.reNameFile = true;
            this.HighlightRow = null;
            this.uploadedFile = [];
            this.showIcon = false;
            this.toggleInfiniteScroll();
            this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
            this.toastr.success("File Renamed Successfully");
            this.uploadedFile = [];
          } else if (data.code == 304) {
            this.ngxService.stop();
            this.reNameFile = true;
            this.showIcon = false;
            this.uploadedFile = [];
            this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
            this.toastr.error(data.message);
          }
          this.reName = "";
          this.onFocusInput = false;
        },
        (error) => {
          this.reNameFile = true;
          this.ngxService.stop();
        }
      );
    }
  }

  trashFile(FilesId, itemCount) {
    if (itemCount > 0) {
      this.deleteFileConfirm(FilesId);
    } else {
      this.fileId = FilesId;
      if (this.fileId.length > 0) {
        this.fileId = FilesId;
      } else {
        this.fileId = [FilesId];
      }
      this.deleteFileId = {
        fileIds: this.fileId,
        restoreFile: false,
        trashFile: true,
      };
      //this.ngxService.start();
      this.filesService.trashFiles(this.deleteFileId).subscribe(
        (result: any) => {
          this.uploadedFile = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
          this.commonService.storeStorageinfo(true);
          this.AllselectCheckbox["checked"] = false;
          this.allSelected = false;
          this.ngxService.stop();
          this.toastr.success(result["message"]);
          this.selectedFiles = [];
          this.multiSelect = false;
          // this.multicheckSelect = false;
          this.selectedlength = false;
          if (result.status === 400) {
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
      this.selectedFiles = [];
    }
  }

  async deleteFileConfirm(id) {
    this.popover = await this.popoverController.create({
      component: FileDeleteConfirmComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        type: "files",
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });

    await this.popover.present();

    return this.popover.onDidDismiss().then((data) => {
      if (data.data) {
        this.trashFile(id, 0);
        this.selectedFiles = [];
        this.selectedlength = false;
      }
    });
  }

  async documentShare1(id, type, title,mimeType) {
    if(mimeType == "httpd/unix-directory"){
      var fileTypes = "folder"
    }
    else {
      var fileTypes = "file"
    }
    this.popover = await this.popoverController.create({
      component: SharingComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        sharedType: "files",
        Accesstype: type,
        title: title,
        selectedfileLength: this.selectedfileLength,
        reShare: false,
        fileTypes:fileTypes
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover
      .onDidDismiss()
      .then((data) => {
        this.selectedfileLength = 0;
        this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
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

  async documentShare(id, type, title,mimeType) {
    if(mimeType == "httpd/unix-directory"){
      var fileTypes = "folder"
    }
    else {
      var fileTypes = "file"
    }
    this.popover = await this.popoverController.create({
      component: ShareComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        sharedType: "files",
        Accesstype: type,
        title: title,
        selectedfileLength: this.selectedfileLength,
        reShare: false,
        fileTypes:fileTypes
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover
      .onDidDismiss()
      .then((data) => {
        this.selectedfileLength = 0;
        this.showIcon = false;
        this.uploadedFile = [];
        this.toggleInfiniteScroll();
        this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
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


  async OnRenameMobile(id, title, mimeType) {
    this.reNameDoc = title;
    this.reNameId = id;
    this.renameMimeType = mimeType;
    this.stringname = this.reNameDoc;
    this.stringname = this.stringname.split(".").shift();
    this.extenstion1 = this.reNameDoc.split(".").pop();
    this.popover = await this.popoverController.create({
      component: RenameFilesComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        MimeType: mimeType,
        title: this.stringname,
        extension: this.extenstion1,
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    });
  }

  addFavorite(id, favorite) {
    let flag = favorite;
    if (flag === true) {
      flag = false;
    } else if (flag === false) {
      flag = true;
    }
    this.favoriteFile = {
      flag: flag,
      id: id,
    };
    //this.ngxService.start();
    this.filesService
      .addFavorites(this.favoriteFile)
      .subscribe((result: any) => {
        this.uploadedFile = [];
        this.showIcon = false;
        this.toggleInfiniteScroll();
        this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
        this.ngxService.stop();
        if (result.flag === true) {
          this.toastr.success("Added favorites to your File / Folder");
        } else {
          this.toastr.success("Removed favorites to your File / Folder");
        }
      });
  }

  Onbackbreadcrumb(id, title) {
    this.uploadedFile = [];
    this.showIcon = false;
    let index = this.breadcrumbfileslist.findIndex((x) => x === id);
    console.log("indexx", index);
    this.breadcrumbfileslist.splice(index + 1);
    this.breadcrumbfileslist.length = index + 1;
    if (id) {
      this.breadcrumbfiles.length = index + 1;
      this.toggleInfiniteScroll();
      // this.OnshowAllFiles(id,this.page1,this.pageSize1);
      this.ParentID = id;
      this.OnshowAllFiles(id,this.page1,this.pageSize1);
    }
  }

  OnhomeFiles() {
    this.page = 1;
    this.uploadedFile = [];
    this.showIcon = false;
    this.toggleInfiniteScroll();
    this.OnshowAllFiles(this.localService.getJsonValue(localData.parentId),this.page1,this.pageSize1);
    this.ParentID =this.localService.getJsonValue(localData.parentId);
    this.selectedFiles = [];
    this.openMenu = false;
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    this.multiSelect = false;
    this.breadcrumbfiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
    // this.multicheckSelect = false;
    this.breadcrumbfileslist = [];
    this.selectedlength = false;
    this.selectedlength = false;
    this.selectedfileLength = 0;
  }

  // define a function to download files
  OnDownload(filesid): void {
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
        this.multicheckSelect = false;
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
      }
    );
    this.uploadedFile = [];
    this.showIcon = false;
    this.toggleInfiniteScroll();
    this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    this.selectedlength = false;
    this.HighlightRow = null;
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
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

  private updateStatus(
    loaded: number,
    total: number,
    requestType: string
  ): void {
    this.fileStatus.status = "progress";
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round((100 * loaded) / total);
  }

  // getSelectedFiles(checkbox: MatCheckbox) {
  //   if (this.singleClickSelect == true) {
  //     this.selectedFiles = [];
  //     this.allSelected = false;
  //     this.multiSelect = false;
  //     this.multicheckSelect = false;
  //     this.selectedlength = false;
  //   }
  //   this.openMenu = false;
  //   this.newFolder = false;
  //   this.newLink = false;
  //   this.newTextDoc = false;
  //   this.newDoc = false;
  //   this.newSpreadsheet = false;
  //   this.newPresentation = false;
  //   this.errorTextDoc = "";
  //   this.errorFolder = "";
  //   if (checkbox.checked === false) {
  //     // this.singleClickSelect = false;
  //     this.selectedFiles.push(checkbox.value);
  //     // this.multiSelect = false;
  //     this.multiSelect = true;
  //   } else if (checkbox.checked === true) {
  //     this.singleClickSelect = false;
  //     this.multiSelect = false;
  //     this.multiSelect = true;
  //     this.singleClickSelect = false;
  //     const index = this.selectedFiles.indexOf(checkbox.value);
  //     if (index > -1) {
  //       this.selectedFiles.splice(index, 1);
  //     }
  //     if (this.selectedFiles.length === 0) {
  //       this.multiSelect = false;
  //       this.multicheckSelect = false;
  //       this.selectedlength = false;
  //     }
  //   }
  // }

  getSelectedFiles(checkbox: MatCheckbox) {
    if (this.singleClickSelect == true) {
      this.selectedFiles = [];
      this.allSelected = false;
      this.multiSelect = false;
      this.multicheckSelect = false;
      this.selectedlength = false;
    }
    this.openMenu = false;
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";

    if (checkbox.checked === false) {
      this.singleClickSelect = false;
      this.checkboxChecked = true;
      this.selectedFiles.push(checkbox.value);
      this.multiSelect = true;
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.selectedfileLength = this.selectedFiles.length;
        this.selectedlength = true;
      }
    } else if (checkbox.checked === true) {
      console.log("decrement");
      this.singleClickSelect = false;
      this.checkboxChecked = false;
      this.multiSelect = true;
      const index = this.selectedFiles.indexOf(checkbox.value);
      this.selectedfileLength = this.selectedFiles.length - 1;
      console.log("decrement", this.selectedfileLength);
      this.selectedlength = true;
      if (index > -1) {
        this.selectedFiles.splice(index, 1);
      }
      if (this.selectedFiles.length === 0) {
        this.multiSelect = false;
        this.selectedlength = false;
        this.multicheckSelect = false;
        this.selectedlength = false;
        this.selectedfileLength = 0;
      }
    }
  }

  getAllSelected(checkbox: MatCheckbox) {
    console.log("----clicked----");
    this.singleClickSelect = false;
    this.openMenu = false;
    this.newLink = false;
    this.newFolder = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    if (checkbox.checked === false) {
      this.allSelected = true;
      this.multiSelect = false;
      // this.multicheckSelect = false;
      this.selectedlength = false;
      let selected: any = [];
      selected = checkbox.value;
      for (let i = 0; i < selected.length; i++) {
        this.selectedfileLength = selected.length;
        this.selectedlength = true;
        this.selectedFiles.push(selected[i].id);
        // this.multiSelect = false;
        this.multiSelect = true;
      }
    } else if (checkbox.checked === true) {
      const index = this.selectedFiles.indexOf(checkbox.value);
      if (index > -1) {
        this.selectedFiles.splice(index, 1);
      }
      this.allSelected = false;
      this.selectedFiles.length = 0;
      if (this.selectedFiles.length === 0) {
        this.multiSelect = false;
        // this.multicheckSelect = false;
        this.selectedlength = false;
        this.selectedfileLength = 0;
      }
    }
  }

  OnNewTextDoc() {
    //this.ngxService.start();
    // this.page = this.page1;
    // this.pageSize = this.pageSize1;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    let data = {
      content: "",
      fileName: this.newFileName,
      id: this.ParentID,
      newFile: true,
    };
    this.commonService.saveTextFile(data).subscribe(
      (result: any) => {
        if (result.code === 200) {
          this.uploadedFile = [];
          this.showIcon = false;
          this.openMenu = false;
          this.clicked= false;
          this.toastr.success(result["message"]);
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
          this.commonService.storeStorageinfo(true);
          this.newFileName = "";
          this.errorTextDoc = "";
        } else if (result.code === 302) {
          this.toastr.error(result["message"]);
          this.clicked = false;
          this.openMenu = false;
          this.newFileName = "";
        }
        this.ngxService.stop();
        this.openMenu = false;
        this.clicked = false;
      },
      (error) => {
        this.ngxService.stop();
        this.newFileName = "";
        this.openMenu = false;
        this.clicked = false;
        if (error.status === 400) {
          this.toastr.error("Please Enter the Name");
          this.clicked = false;
          // this.errorTextDoc = "Please Enter New Text Document Name";
          this.errorFolder = "";
          this.openMenu = true;
          // this.newTextDoc = true;
        }
      }
    );
  }

  OnNewDoc() {
    //this.ngxService.start();
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    let data = {
      content: "",
      fileName: this.newFileName,
      id: this.ParentID,
      newFile: true,
    };
    this.commonService.saveTextFile(data).subscribe(
      (result: any) => {
        if (result.code === 200) {
          this.uploadedFile = [];
          this.showIcon = false;
          this.openMenu = false;
          this.clicked = false;
          this.toastr.success(result["message"]);
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
          this.commonService.storeStorageinfo(true);
          this.newFileName = "";
          this.errorTextDoc = "";
        } else if (result.code === 302) {
          this.toastr.error(result["message"]);
          this.clicked = false;
          this.openMenu = false;
          this.newFileName = "";
        }
        this.ngxService.stop();
        this.openMenu = false;
        this.clicked = false;
      },
      (error) => {
        this.ngxService.stop();
        this.newFileName = "";
        this.openMenu = false;
        this.clicked = false;
        if (error.status === 400) {
          this.toastr.error("Please Enter the Name");
          this.clicked = false;
          // this.errorTextDoc = "Please Enter New Text Document Name";
          this.errorFolder = "";
          this.openMenu = true;
          // this.newTextDoc = true;
        }
      }
    );
  }

  OnCreateTextDoc($event) {
    this.newFileName = $event.target.value + ".txt";
  }

  OnCreateDoc($event) {
    this.newFileName = $event.target.value + ".docx";
  }
  OnCreateSpreadsheet($event) {
    this.newFileName = $event.target.value + ".xlsx";
  }
  OnCreatePresentation($event) {
    this.newFileName = $event.target.value + ".pptx";
  }

  async viwePdfViwer(fileid, title) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: "files",
      },
      component: PdfViwerComponent,
      cssClass: "modal-fullscreen",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    });
  }

  async viewTextEdit(fileid, title) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: "files",
      },
      component: TextEditorComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    });
  }

  // async viewPhoto(fileid, title) {
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: "files",
  //       photos: this.photo,
  //       page: "files",
  //     },
  //     component: PhotoViewerComponent,
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     this.OnshowAllFiles(this.ParentID);
  //   });
  // }

  async viewPhoto(id, title) {
    // console.log(title,id,
    //   this.sharedType,
    //   this.ParentID,
    //   this.filesType,
    //   this.SharedFileID,"dataaaaaae4rr");
    // alert('hello');

    // console.log('show');
    await this.filesService
      .getBase64ofFile(
        id,
        this.sharedType,
        this.ParentID,
        this.filesType,
        this.SharedFileID
      )
      .subscribe((result: any) => {
        if (this.commonService.base64regex.test(result.src) == true) {
          this.uploadedPhto = "data:image/png;base64," + result.src;
          console.log(this.uploadedPhto);
        } else {
          this.uploadedPhto = result.src;
          this.photo_id = result.id;
          this.pic_title = result.title;
          console.log(this.uploadedPhto);
          console.log(this.pic_title);
        }
        this.previewService.open(this.preview).subscribe({
          complete: () => console.info("complete"),
        });
      });
  }
  get previewContent(): PolymorpheusContent {
    this.selectedpic = this.uploadedPhto;
    return this.selectedpic;
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
    this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    this.HighlightRow = null;
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
  }

  // async viewVideo(fileid, title) {
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: "files",
  //     },
  //     backdropDismiss: false,
  //     component: TaigaVideoComponent,
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     this.OnshowAllFiles(this.ParentID);
  //   });
  // }
  viewVideo(fileid, title) {
    this.file_id = fileid;
    // console.log(title);
    this.vid_title = title;
    if (this.sharedType == "files" || this.sharedType == "self") {
      this.url =
        "video/playVideo/" +
        fileid +
        "?isShared=false&token=" +
       this.localService.getJsonValue(localData.token);
    } else if (this.sharedType == "others" && this.filesType == "") {
      this.url =
        "video/playVideo/" +
        fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token);
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
        this.parentId;
    }
    let data;
    if (this.sharedType == "files" || this.sharedType == "self") {
      data = fileid + "?isShared=false&token=" +this.localService.getJsonValue(localData.token);
    } else if (this.sharedType == "others" && this.filesType == "") {
      data = fileid + "?isShared=true&token=" +this.localService.getJsonValue(localData.token);
    } else if (
      this.filesType == "insideFolder" &&
      this.sharedType == "others"
    ) {
      data =
        fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token) +
        "&folderId=" +
        this.parentId;
    }
    this.filesService.viewVideo(this.url).subscribe((result: any) => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(result.value);
      // console.log(this.url);

      this.minio = result.object;
    });
    this.previewService.open(this.content || "").subscribe();
  }

  async viewAudio(fileid, title) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        sharedType: "files",
      },
      backdropDismiss: false,
      component: AudioPlayerComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    });
  }

  takeFilesTour() {
    this.openMenu = false;
    this.newFolder = false;
    this.newLink = false;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
    this.errorTextDoc = "";
    this.errorFolder = "";
    this.introJS.start();
    this.multiSelect = false;
  }

  async OnmoveOrCopy(fileid) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        parentId:this.localService.getJsonValue(localData.parentId),
      },
      component: MoveCopyComponent,
      cssClass: "modal-fullscreen",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.uploadedFile = [];
      this.showIcon = false;
      if (data.data != undefined && data.data != "") {
        this.toggleInfiniteScroll();
        this.OnshowAllFiles(data.data,this.page1,this.pageSize1);
        // this.OnshowAllFiles(this.ParentID);
        this.breadcrumbfiles = data.role;
        console.log("----after----", this.breadcrumbfiles);
      } else {
        this.OnshowAllFiles(this.ParentID,this.page1,this.pageSize1);
        // this.breadcrumbfiles = [];
      }
      // this.breadcrumbfiles = [];
      this.multiSelect = false;
      this.multicheckSelect = false;
      this.selectedFiles = [];
      this.selectedlength = false;
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
    });
  }

  //Drag and drop
  dropped(files: NgxFileDropEntry[]) {
    console.log("---dropped---", files);
    this.currentFolder = "";
    this.currenDir = "";
    this.files = files;

    const pushfiles = (files) => {
      let fileLength = files.length;
      for (const droppedFile of files) {
        console.log("---dropped file ---", droppedFile);
        // Is it a file?
        if (droppedFile.fileEntry.isFile) {
          console.log("---dropped fileEntry ---");
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            let fileSize = file.size;
            console.log("filesize", fileSize);
            if (fileSize == 0) {
              console.log("filesize 000")
              this.toastr.warning(
                "File size of 0 KB cannot be uploaded",
                file.name,
                { timeOut: 3000 }
              );
              this.dropUploadedFiles.splice(this.index);
            }
            else if (droppedFile.relativePath.includes("/")) {
              console.log("---dropped fileEntry folders ---");
              let dirName = droppedFile.relativePath.split("/")[0]; //controller
              // this.dirName = dirName;
              // console.log("calls an  api ", dirName);
              // console.log("calls an  currentFolder", this.currentFolder);

              if (this.currentFolder != dirName) {
                //service  != service
                console.log("calls an  api --------------------", dirName);
                let overwrite = "";
                var parentIdLocal = this.ParentID;
                console.log("parentIdLocal", parentIdLocal)
                let response = this.commonService
                  .checkFolder(parentIdLocal, dirName)
                  .subscribe(async (result: any) => {
                    if (result.code === 200) {
                      //   this.popover = await this.popoverController.create({
                      //     component: DuplicateFilesComponent,
                      //     componentProps: {},
                      //     keyboardClose: false,
                      //     translucent: true,
                      //     backdropDismiss: false,
                      //     cssClass: "custom-pawaitopupclass",
                      //   });
                      //   await this.popover.present();
                      //   return this.popover.onDidDismiss().then((data) => {
                      //     this.overwrite = data.data.overWrite;
                      //     console.log(data.data.overWrite, " overwrite");
                      //     if (!data.data.overWrite) {
                      this.currenDir = result.object;
                      //       this.currentFolder = dirName;
                      var index = droppedFile.relativePath.indexOf("/");
                      let relativePath =
                        this.currenDir +
                        "/" +
                        droppedFile.relativePath.substring(index + 1);
                      this.dosomething(
                        file,
                        droppedFile,
                        files,
                        fileLength,
                        relativePath
                      );
                      //       this.currentFolder = "";
                      //     } else if (this.overwrite === "") {
                      //       this.overwrite = "null";
                      //       return;
                      //     }
                      //   });
                    } else if (file.size > this.uploadFileSize) {
                      this.toastr.warning(
                        "File which is more than " + this.uploadFileSize1 + " cannot upload",
                        file.name,
                        { timeOut: 3000 }
                      );
                      this.dropUploadedFiles.splice(this.index);
                    } else {
                      this.dosomething(
                        file,
                        droppedFile,
                        files,
                        fileLength,
                        droppedFile.relativePath
                      );
                    }
                  });
                //controller1 <--- apiresp
              } else {
              }
            } else {
              this.dropUploadedFiles.push({
                file: file,
                relativePath: droppedFile.relativePath,
              });
              if (
                files.length <= this.uploadFileCount &&
                file.size <= this.uploadFileSize && file.size != 0
              ) {
                if (fileLength == this.dropUploadedFiles.length) {
                  console.log("parentIdLocal", parentIdLocal)
                  this.OnchunkUpload2(
                    this.dropUploadedFiles[this.index++],
                    this.ParentID
                  );
                  console.log(file.name, "----");
                }
              } else if (file.size > this.uploadFileSize) {
                this.toastr.warning(
                  "File which is more than " + this.uploadFileSize1 + " cannot upload",
                  file.name,
                  { timeOut: 3000 }
                );
                this.dropUploadedFiles.splice(this.index);
              } 
              else {
                this.toastr.error(
                  "You can upload only " +
                    this.uploadFileCount +
                    " files at a time"
                );
                this.dropUploadedFiles.splice(this.index);
              }

              // this.dosomething(file, droppedFile, files, fileLength);
            }
          });
        } else {
          fileLength--;
          // It was a directory (empty directories are added, otherwise only files)
          const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
          // console.log(droppedFile.relativePath, fileEntry);
          this.emptyFolder.push(droppedFile.relativePath);
        }
      }
    };
    pushfiles(files);

    // setTimeout(() => {
    //   console.log("all files pushed");
    //   console.log("dropUploadedFiles", this.dropUploadedFiles);
    //   this.OnchunkUpload2(this.dropUploadedFiles[this.index++], this.ParentID);
    // }, 3000);
  }

  public fileOver(event) {}

  public dosomething(file, droppedFile, files, fileLength, relativepath) {
    this.dropUploadedFiles.push({
      file: file,
      relativePath: relativepath,
    });
    var parentIdLocal = this.ParentID
    console.log(files.length + " files length");
    console.log(this.dropUploadedFiles.length + " files uploaded");
    if (files.length <= this.uploadFileCount) {
      if (fileLength == this.dropUploadedFiles.length) {
        this.OnchunkUpload2(
          this.dropUploadedFiles[this.index++],
          parentIdLocal
        );
      }
    } else {
      this.toastr.error(
        "You can upload only " + this.uploadFileCount + " files at a time"
      );
      this.dropUploadedFiles.splice(this.index);
    }
  }
  public fileLeave(event) {}

  // get user details
  getUserDetail() {
    //this.ngxService.start();
    this.commonService.userDetails().subscribe((result: any) => {
      this.userDetails = result.users;
      this.localService.setJsonValue(localData.email, this.userDetails.email);
    });
  }

  OnmoreDetails(id,versionId) {
    this.versionId = versionId;
    this.viewDetails = true;
    this.AllselectCheckbox["checked"] = false;
    this.multiSelect = false;
    this.allSelected = false;
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
        // if (this.activityList[i].userName == this.userName) {
        //   this.activityList[i].userName = "You";
        // }
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
        ).format("DD MMM YYYY hh:mm A");
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

  async manageVersions(fileid,mimeType,versionId){
    this.viewDetails = false;
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        versionId: versionId,
        mimeType:mimeType
      },
      backdropDismiss: false,
      component: ManageVersionsComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      this.viewDetails = false;
    });
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
onDeleteTag(tagMappingId)
{
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

  //new upload  by presigned url

  // private startUpload(params: IParamStartUpload): Promise<any> {
  //   const httpParams = new HttpParams()
  //     .set('fileName', encodeURIComponent(params.fileName))
  //     .set('fileType', encodeURIComponent(params.fileType));

  //   return this.httpClient.get(`${this.url}/start-upload`, { params: httpParams }).toPromise();
  // }

  /**
   * Upload MultiPart.
   *
   * @param file
   * @param tokenEmit
   */
  // async uploadMultipartFile(file: any, tokenEmit: string) {
  //   // const uploadStartResponse = await this.startUpload({
  //   //   fileName: file.name,
  //   //   fileType: file.type
  //   // });

  //   try {
  //     const FILE_CHUNK_SIZE = 5000000; // 10MB
  //     const fileSize = file.size;
  //     const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1;
  //     let start, end, blob;

  //     let uploadPartsArray = [];
  //     let countParts = 0;

  //     let orderData = [];

  //     for (let index = 1; index < NUM_CHUNKS + 1; index++) {
  //       start = (index - 1) * FILE_CHUNK_SIZE;
  //       end = (index) * FILE_CHUNK_SIZE;
  //       blob = (index < NUM_CHUNKS) ? file.slice(start, end) : file.slice(start);

  //       // const httpParams = new HttpParams()
  //       //   .set('fileName', encodeURIComponent(file.name))
  //       //   .set('fileType', encodeURIComponent(file.type))
  //       //   .set('partNumber', index.toString())
  //       //   .set('uploadId', uploadStartResponse.data.uploadId);

  //       // (1) Generate presigned URL for each part

  //       let data = {
  //         "filename": file.name,
  //         "partCount": NUM_CHUNKS,
  //         "contentType": file.type,
  //       }
  //       this.commonService.getPreSignedUrl(data).subscribe((result: any) => {
  //         let uploadUrls = [];
  //         uploadUrls = result.uploadUrls;
  //         console.log("uploadedFiles",uploadUrls)
  //         for(let i =0;i < uploadUrls.length; i++)
  //         {
  //           this.uploadUrl = uploadUrls[i];
  //           console.log("items",this.uploadUrl)
  //         }
  //       });
  //       // const uploadUrlPresigned = await this.httpClient.get(`${this.url}/get-upload-url`, { params: httpParams }).toPromise();

  //       // (2) Puts each file part into the storage server

  //       orderData.push({
  //         presignedUrl: this.uploadUrl.toString(),
  //         index: index
  //       });

  //       const req = new HttpRequest('PUT', this.uploadUrl.toString(), blob, {
  //         reportProgress: true
  //       });

  //       this.httpClient
  //         .request(req)
  //         .subscribe((event: HttpEvent<any>) => {
  //           switch (event.type) {
  //             case HttpEventType.UploadProgress:
  //               const percentDone = Math.round(100 * event.loaded / FILE_CHUNK_SIZE);
  //               this.uploadProgress$.emit({
  //                 progress: file.size < FILE_CHUNK_SIZE ? 100 : percentDone,
  //                 token: tokenEmit
  //               });
  //               break;
  //             case HttpEventType.Response:
  //               console.log('😺 Done!');
  //           }

  //           // (3) Calls the CompleteMultipartUpload endpoint in the backend server

  //           if (event instanceof HttpResponse) {
  //             const currentPresigned = orderData.find(item => item.presignedUrl === event.url);

  //             countParts++;
  //             uploadPartsArray.push({
  //               ETag: event.headers.get('ETag').replace(/[|&;$%@"<>()+,]/g, ''),
  //               PartNumber: currentPresigned.index
  //             });

  //             if (uploadPartsArray.length === NUM_CHUNKS) {
  //               this.httpClient.post(`${this.url}/complete-upload`, {
  //                 fileName: encodeURIComponent(file.name),
  //                 parts: uploadPartsArray.sort((a, b) => {
  //                   return a.PartNumber - b.PartNumber;
  //                 }),
  //                 uploadId: uploadStartResponse.data.uploadId
  //               }).toPromise()
  //                 .then(res => {
  //                   this.finishedProgress$.emit({
  //                     data: res
  //                   });
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   } catch (e) {
  //     console.log('error: ', e);
  //   }
  // }


}


