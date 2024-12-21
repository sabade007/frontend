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
import { CommonService } from "../../../service/common.service";
import { FilesService } from "src/app/service/files.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment.prod";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { saveAs } from "file-saver";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { PopoverController } from "@ionic/angular";
import { AudioPlayerComponent } from "../../modalpage/audio-player/audio-player.component";
import { PdfViwerComponent } from "../../modalpage/pdf-viwer/pdf-viwer.component";
import { TextEditorComponent } from "../../modalpage/text-editor/text-editor.component";
import { VideoPlayerComponent } from "../../modalpage/video-player/video-player.component";
import { MoveCopyComponent } from "../../modalpage/move-copy/move-copy.component";
import { SharingComponent } from "../../modalpage/sharing/sharing.component";
import { PhotoViewerComponent } from "../../modalpage/photo-viewer/photo-viewer.component";
import { FileDeleteConfirmComponent } from "../../modalpage/file-delete-confirm/file-delete-confirm.component";
import { PhotosService } from "src/app/service/photos.service";
import { Subscription } from "rxjs";
import { CollaboraComponent } from "../../layouts/ifame/collabora/collabora.component";
import { localData, mimetypes } from "src/environments/mimetypes";
import { RenameFilesComponent } from "../../modalpage/rename-files/rename-files.component";

//taiga changes
import { TemplateRef } from "@angular/core";
import { PreviewDialogService } from "@taiga-ui/addon-preview";
import { TuiDialogContext, TuiNotificationsService } from "@taiga-ui/core";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { DomSanitizer } from "@angular/platform-browser";
import { ShareComponent } from "../../modalpage/share/share.component";
import { ManageVersionsComponent } from "../../modalpage/manage-versions/manage-versions.component";
import { LocalService } from "src/environments/local.service";

import { IonInfiniteScroll } from '@ionic/angular';
import { flatLength } from "@taiga-ui/cdk";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.scss"],
})
export class FavoritesComponent implements OnInit {
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  @ViewChild("content")
  readonly content?: TemplateRef<TuiDialogContext<void>>;
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
  mimes = mimetypes;
  listener: () => void;
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
  title: any;
  id: any;
  breadcrumbfileslist: any = [];

  SharedFileID: number = -1;
  sharedType: any = "files";
  filesType: any = "";

  selectedFiles: any = [];
  selectedId: any = [];
  fileId: any = [];
  downloadID: any = [];
  multiSelect: boolean = false;
  multicheckSelect: boolean = false;
  allSelected: boolean = false;
  selectedfileLength: any;
  selectedlength: boolean = false;

  favoriteFolder: any = [];
  favoriteDocuments: any = [];
  favoriteFolderLength: any;
  favoriteDocumentsLength: any;
  downloadFilesId: any = [];

  filenames: string[] = [];
  fileStatus = { status: "", requestType: "", percent: 0 };
  @ViewChildren("checkbox") checkbox: QueryList<ElementRef>;
  unselectId: any;
  page: number = 1;
  sortList: any = "Modified At";
  sortValue = "modifiedAt";
  removable: boolean = true;
  allFilesData: any = [];
  filesCount: any;
  openFolder: boolean = false;
  createdTime: boolean = false;
  popover: any;
  subscription: Subscription;
  extention: any;
  pageEvent: PageEvent;
  pageSize: number = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  reNameDoc: any;
  onFocusInput: boolean = false;
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;
  @ViewChild("MultiselectCheckbox") MultiselectCheckbox: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  photo: any = [];
  dashboardResult: any = [];
  strname: any;
  extenstion: any;
  extenstion1: any;
  stringname: any;
  name: any;
  renameMimeType: any;
  selectedOption: boolean = false;
  HighlightRow: number;
  selectedRows: any = [];
  ClickedRow: any;
  singleClickSelect: boolean = false;
  lastPageEvent: boolean = false;
  previousParent: any;
  uploadedPhoto: any;
  fullImage: any[];
  currentIndex: any;
  vid_title: any;
  pic_title: any;
  photo_id: any;
  file_id: any;
  viewDetails: boolean = false;
  openMenu: boolean = false;
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
  checkboxChecked: boolean = false;
  lastModifiedDate: string;
  productName = environment.productname;
  isLoadingFav: boolean = true;
  page1: number = 1;
  pageSize1: number = 20;
  showIcon: boolean = false;
  isTag: boolean = false;
  createTagForm: FormGroup;
  listTag: any = [];
  inputValues: any;
  searchTagList: any= [];
  onclose: boolean = false;
  showMore: boolean = false;

  @HostListener("window:mouseup", ["$event"])
  mouseUp() {
    if (this.onFocusInput == false) {
      this.reNameFile = true;
    }

    // if (this.selectedOption == false) {
    //   this.multiSelect = false;
    //   this.HighlightRow = null;
    // }

    // if( this.AllselectCheckbox["checked"] == true){
    //   this.multiSelect = true;
    // }
    // if(this.checkboxChecked == true){
    //   console.log("selected")
    //   this.multiSelect = true;
    // }
  }

  private userName: string = "";

  sortOrder: boolean = false;
  //video
  url: any;
  parentId: any;
  minio: any = "not minio";
  isMobile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private popoverController: PopoverController,
    private photosService: PhotosService,
    private localService: LocalService,
    @Inject(PreviewDialogService)
    private readonly previewService: PreviewDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    route.params.subscribe((val) => {
      this.showAllFavorite(this.page,this.pageSize);
      this.commonService.getDashboardInfo();
    });

    this.ClickedRow = function (index, id, clickEvent) {
      this.HighlightRow = index;
      this.multiSelect = true;
      this.selectedFiles = id;
      this.singleClickSelect = true;
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
      // this.multicheckSelect = false;
      this.selectedlength = false;
    };

    this.subscription = this.commonService.getpath().subscribe((message) => {
      if (message == "path") {
        // this.showAllFavorite(this.page,this.pageSize);
        this.ParentID =this.localService.getJsonValue(localData.parentId);
        this.selectedFiles = [];
        this.breadcrumbfiles = [];
      }
    });

    this.commonService.storeHeader("Files / Favorites");
    route.params.subscribe((val) => {
      this.page = 1;
      // this.allPhotos();
      this.commonService.getDashboardInfo();
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
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
    }
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
    this.photosService.allFavotitesPhoto(data).subscribe((result: any) => {
      this.uploadedPhoto = result.childern;
      var arr = [];
      this.uploadedPhoto.forEach(function (i) {
        arr.push({ image: i.src, title: i.title });
      });
      this.fullImage = arr;
    });
  }

  onFocusInEvent(event: any) {
    this.onFocusInput = true;
    if (this.onFocusInput == true) {
      this.reNameFile = false;
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

  fileListViewShow() {
    this.isLoadingFav = true;
    this.showIcon = false;
    this.uploadedFile = [];
    this.page = 1;
    if (this.openFolder == true) {
      this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    } else {
      this.showAllFavorite(this.page1,this.pageSize1);
    }
    this.fileListView = true;
    this.fileGridView = false;
    this.multiSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
  }
  fileGridViewShow() {
    this.isLoadingFav = true;
    this.showIcon = false;
    this.uploadedFile = [];
    this.page = 1;
    if (this.openFolder == true) {
      this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    } else {
      this.showAllFavorite(this.page1,this.pageSize1);
    }
    this.fileGridView = true;
    this.fileListView = false;
    this.multiSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
  }

  moreActions() {
    // this.multiSelect = false;
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

  createNewFile() {
    this.newFolder = true;
    this.newTextDoc = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
  }
  createNewTextDoc() {
    this.newFolder = false;
    this.newTextDoc = true;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = false;
  }
  createNewDoc() {
    this.newTextDoc = false;
    this.newFolder = false;
    this.newDoc = true;
    this.newSpreadsheet = false;
    this.newPresentation = false;
  }
  createNewSpreadsheet() {
    this.newTextDoc = false;
    this.newFolder = false;
    this.newDoc = false;
    this.newSpreadsheet = true;
    this.newPresentation = false;
  }
  createNewPresentation() {
    this.newTextDoc = false;
    this.newFolder = false;
    this.newDoc = false;
    this.newSpreadsheet = false;
    this.newPresentation = true;
  }

  OncreateFolder($event) {
    this.newFolderName = $event.target.value;
  }

  getFolderByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType === mimeType);
  }

  getFilesByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType != mimeType);
  }

  showAllFavorite(page,pageSize) {
    //this.ngxService.start();
    this.openFolder = false;
    let data = {
      asc: this.sortOrder,
      pageNb: page,
      parentId: 0,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.filesService.showAllFavorites(data).subscribe((result: any) => {
      this.ngxService.stop();
      if(this.page == 1)
          this.uploadedFile = [];
      this.HighlightRow = null;
      // this.multiSelect = false;
      // this.multicheckSelect = false;
      // this.selectedlength = false;
      this.photo = [];
      this.showIcon = true;
      this.isLoadingFav = false;
      // this.uploadedFile = result.childern;
      this.uploadedFile = this.uploadedFile.concat(result.childern);
      this.filesCount = result.count;
      this.previousParent = result.previousParent;
      this.filesLength = this.uploadedFile.length;
      if (this.filesLength == 0 && this.lastPageEvent == true) {
        this.getPevpage();
      }
      // for (let i = 0; i < this.uploadedFile.length; i++) {
        this.uploadedFile.forEach(file => {
        if (
          this.commonService.base64regex.test(file.icon) == true
        ) {
          file.icon =
            "data:image/png;base64," + file.icon;
        }
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
          mimeType == "image/gif"
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
      this.onFocusInput = false;
    });
  }

  loadData(event){
    console.log("exzaexza") 
    if(this.filesCount > 20){
      setTimeout(() => { 
      console.log("Done ",event);
      console.log("123")
      this.page = this.page + 1;
      event.target.complete();
      if(this.AllselectCheckbox["checked"] == true){
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else {
        this.showAllFavorite(this.page,this.pageSize);
      }
      this.selectedlength = false;
      this.selectedFiles = [];
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
      this.multiSelect = false;
    }
      else{
        if (this.openFolder == true) {
          this.getshowAllFiles(this.ParentID,this.page,this.pageSize);
        } else {
          this.showAllFavorite(this.page,this.pageSize);
        }
      }
      // this.showAllFavorite(this.page,this.pageSize);
      console.log("this.page "+this.page);
      console.log("this.filesCount "+this.filesCount);
      console.log("this.pageSize "+this.pageSize);
      console.log("this.mod "+ Math.ceil(this.filesCount / this.pageSize));
      if(this.page === Math.ceil(this.filesCount / this.pageSize)){
        event.target.disabled = true;
      }
    },1000);
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
  
  onPageChange(event: PageEvent) {
    this.lastPageEvent = true;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.showAllFavorite(this.page,this.pageSize);
    this.AllselectCheckbox["checked"] = false;
    this.multiSelect = false;
    this.allSelected = false;
    this.multicheckSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
  }
  OngetSortbysortList() {
    this.OngetSort(this.sortList);
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
    if (this.openFolder == true) {
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.getshowAllFiles(this.ParentID,this.page,this.pageSize);
    } else {
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.showAllFavorite(this.page,this.pageSize);
    }
  }

  matChipremove() {
    this.removable = false;
  }

  // Convert size long to byteUnits
  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  //Open folder
  OnopenFile(id, mimeType, title, versionId) {
    this.selectedfileLength = 0;
    this.selectedlength = false;
    this.multiSelect = false;
    this.selectedFiles = [];
    // this.multicheckSelect = false;
    this.breadcrumbfileslist.push(id);
    this.selectedlength = false;
    if (id && this.reNameFile === true) {
      switch (mimetypes[mimeType].editor) {
        case "FOLDER":
          this.ParentID = id;
          this.openFolder = true;
          this.HighlightRow = null;
          this.multiSelect = false;
          // this.multicheckSelect = false;
          this.selectedlength = false;
          this.uploadedFile = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.getshowAllFiles(id,this.page1,this.pageSize1);
          this.breadcrumb = {
            title: title,
            id: id,
          };
          this.AllselectCheckbox["checked"] = false;
          this.allSelected = false;
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

  async openOffice(fileid, title,versionId) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
        isShared: false,
        versionId : versionId 

      },
      component: CollaboraComponent,
      cssClass: "modal-fullscreen",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else {
        this.showAllFavorite(this.page,this.pageSize);
        return (this.breadcrumbfiles = []);
      }
    });
  }
  // show all favorite files and folders
  getshowAllFiles(parentId,page,pageSize) {
    //this.ngxService.start();
    let data = {
      asc: false,
      pageNb: page,
      parentId: parentId,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.commonService.getshowAllFiles(data).subscribe((result: any) => {
      this.ngxService.stop();
      if(this.page == 1)
          this.uploadedFile = []
      this.showIcon = true;
      this.HighlightRow = null;
      // this.multiSelect = false;
      // this.multicheckSelect = false;
      // this.selectedlength = false;
      // this.uploadedFile = result.childern;
      this.uploadedFile = this.uploadedFile.concat(result.childern);
      this.filesCount = result.count;
      this.previousParent = result.previousParent;
      this.filesLength = this.uploadedFile.length;
      if (this.filesLength == 0 && this.lastPageEvent == true) {
        this.getPevpage();
      }
      this.uploadedFile.forEach(file => { 
        if (
          this.commonService.base64regex.test(file.icon) == true
        ) {
          file.icon =
            "data:image/png;base64," + file.icon;
        }
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
      });
    });
  }

  getPevpage() {
    this.page = 1;
    this.showAllFavorite(this.page,this.pageSize);
  }

  OnRename(id, title, mimeType) {
    // this.reNameDoc = title;
    // this.reNameFile = false;
    // this.reNameId = id;
    // this.renameMimeType = mimeType;
    // this.strname = this.reNameDoc;
    // this.strname = this.strname.split(".").shift();
    // this.extenstion = this.reNameDoc.split(".").pop();
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
    if (this.reName == "") {
      this.toastr.warning("Please enter name");
      this.reNameFile = false;
    } else if (
      !(this.renameMimeType == "httpd/unix-directory") &&
      this.reName != ""
    ) {
      this.name = this.reName + "." + this.extenstion;
    } else {
      this.name = this.reName;
    }
  }

  OnreNameFiles(id) {
    //this.ngxService.start();
    if (this.reName === this.reNameDoc || this.reName == "") {
      this.ngxService.stop();
      this.reNameFile = true;
    } else {
      this.commonService.CreateReName(id, this.name).subscribe(
        (data) => {
          if (data.code == 200) {
            this.ngxService.stop();
            this.reNameFile = true;
            this.toastr.success("File Renamed Successfully");
            if (this.openFolder == true) {
              this.getshowAllFiles(this.ParentID,this.page,this.pageSize);
            } else {
              this.uploadedFile = [];
              this.showIcon = false;
              this.toggleInfiniteScroll();
              this.showAllFavorite(this.page,this.pageSize);
              return (this.breadcrumbfiles = []);
            }
          } else if (data.code == 304) {
            this.ngxService.stop();
            this.reNameFile = true;
            this.toastr.error(data.message);
            if (this.openFolder == true) {
              this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
            } else {
              this.uploadedFile = [];
              this.showIcon = false;
              this.toggleInfiniteScroll();
              this.showAllFavorite(this.page1,this.pageSize1);
              return (this.breadcrumbfiles = []);
            }
          }
          this.reName = "";
        },
        (error) => {
          this.reNameFile = true;
          this.ngxService.stop();
        }
      );
    }
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
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
      } else {
        this.showAllFavorite(this.page,this.pageSize);
        return (this.breadcrumbfiles = []);
      }
    });
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
          this.ngxService.stop();
          this.toastr.success(result["message"]);
          if (this.openFolder == true) {
            this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
          } else {
            this.uploadedFile = [];
            this.showIcon = false;
            this.toggleInfiniteScroll();
            this.showAllFavorite(this.page,this.pageSize);
            return (this.breadcrumbfiles = []);
          }
          this.selectedFiles = [];
          this.AllselectCheckbox["checked"] = false;
          this.allSelected = false;
          this.selectedlength = false;
          this.multicheckSelect = false;
          if (result.status === 400) {
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
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
        this.multicheckSelect = false;
        this.selectedlength = false;
      }
    });
  }

  removeFavorite(id) {
    this.favoriteFile = {
      flag: false,
      id: id,
    };
    //this.ngxService.start();
    this.filesService
      .addFavorites(this.favoriteFile)
      .subscribe((result: any) => {
        this.showAllFavorite(this.page,this.pageSize);
        this.ngxService.stop();
        this.toastr.success("Removed favorites to your File / Folder");
        if (this.openFolder == true) {
          this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
        } else {
          this.uploadedFile = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.showAllFavorite(this.page,this.pageSize);
          return (this.breadcrumbfiles = []);
        }
      });
  }

  Onbackbreadcrumb(id) {
    // if (id) {
    //   var list = document.getElementById("list");
    //   var listItems = list.getElementsByTagName("li");
    //   var last = listItems[listItems.length - 1];
    //   list.removeChild(last);
    //   this.ParentID = id;
    //   this.getshowAllFiles(this.ParentID);
    // }

    let index = this.breadcrumbfileslist.findIndex((x) => x === id);
    this.breadcrumbfileslist.splice(index + 1);
    this.breadcrumbfileslist.length = index + 1;
    if (id) {
      this.breadcrumbfiles.length = index + 1;
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.getshowAllFiles(id,this.page1,this.pageSize1);
      this.ParentID = id;
    }
  }

  OnhomeFiles() {
    this.page = 1;
    this.uploadedFile = [];
    this.showIcon = false;
    this.toggleInfiniteScroll();
    this.showAllFavorite(this.page,this.pageSize);
    this.ParentID =this.localService.getJsonValue(localData.parentId);
    this.selectedFiles = [];
    this.breadcrumbfiles = [];
    this.breadcrumbfileslist = [];
    this.multiSelect = false;
    this.multicheckSelect = false;
    this.selectedlength = false;
    this.allSelected = false;
    this.selectedfileLength = 0;
    this.selectedlength = false;
    this.selectedFiles = [];
  }
  //download files
  OnDownload(filesid): void {
    this.downloadID = filesid;
    if (this.downloadID.length > 0) {
      this.downloadID = filesid;
    } else {
      this.downloadID = [filesid];
    }
    this.downloadFilesId = {
      fileId: this.downloadID,
    };
    //this.ngxService.start();
    this.filesService.downloadFiles(this.downloadFilesId).subscribe(
      (event: any) => {
        this.ngxService.stop();
        this.resportProgress(event);
        this.multiSelect = false;
        this.multicheckSelect = false;
        this.selectedlength = false;
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
      }
    );
    if (this.openFolder == true) {
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    } else {
      this.uploadedFile = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.showAllFavorite(this.page,this.pageSize);
      this.breadcrumbfiles = [];
    }
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
              .replace("attachment ; filename=", " ")!
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

  getSelectedFiles(checkbox: MatCheckbox) {
    if (this.singleClickSelect == true) {
      this.selectedFiles = [];
      this.allSelected = false;
      this.multiSelect = false;
      this.multicheckSelect = false;
      this.selectedlength = false;
    }
    if (checkbox.checked === false) {
      this.singleClickSelect = false;
      this.checkboxChecked = true;
      this.selectedFiles.push(checkbox.value);
      this.multiSelect = true;
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.selectedfileLength = this.selectedFiles.length;
        this.selectedlength = true;
      }
      // this.multicheckSelect = true;
    } else if (checkbox.checked === true) {
      this.singleClickSelect = false;
      this.checkboxChecked = false;
      this.multiSelect = true;
      this.selectedfileLength = this.selectedFiles.length - 1;
      console.log("decrement", this.selectedfileLength);
      this.selectedlength = true;
      // this.multicheckSelect = true;
      const index = this.selectedFiles.indexOf(checkbox.value);
      if (index > -1) {
        this.selectedFiles.splice(index, 1);
      }
      if (this.selectedFiles.length === 0) {
        this.multiSelect = false;
        this.selectedlength = false;
        this.multicheckSelect = false;
        this.selectedlength = false;
      }
    }
  }

  getAllSelected(checkbox: MatCheckbox) {
    if (checkbox.checked === false) {
      this.allSelected = true;
      let selected: any = [];
      selected = checkbox.value;
      this.multicheckSelect = false;
      this.selectedlength = false;
      for (let i = 0; i < selected.length; i++) {
        this.selectedfileLength = selected.length;
        this.selectedlength = true;
        this.selectedFiles.push(selected[i].id);
        this.multiSelect = true;
        // this.multicheckSelect = true;
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
        this.multicheckSelect = false;
        this.selectedlength = false;
      }
    }
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
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else {
        this.showAllFavorite(this.page,this.pageSize);
        return (this.breadcrumbfiles = []);
      }
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
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
      } else {
        this.showAllFavorite(this.page,this.pageSize);
        return (this.breadcrumbfiles = []);
      }
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
  //     if (this.openFolder == true) {
  //       this.getshowAllFiles(this.ParentID);
  //     } else {
  //       this.showAllFavorite();
  //       return (this.breadcrumbfiles = []);
  //     }
  //   });
  // }
  //   viewPhoto(y){
  //     this.currentIndex=y;
  // console.log(this.currentIndex);
  // this.previewService.open(this.preview).subscribe({
  //   complete: () => console.info('complete')
  // });

  //   }
  //   get previewContent(): PolymorpheusContent {
  //     return this.fullImage[this.currentIndex].image
  //   }

  viewPhoto(id, title) {
    // console.log(title,id,
    //   this.sharedType,
    //   this.ParentID,
    //   this.filesType,
    //   this.SharedFileID,"dataaaaaae4rr");
    // alert('hello');

    // console.log('show');
    this.filesService
      .getBase64ofFile(
        id,
        this.sharedType,
        this.ParentID,
        this.filesType,
        this.SharedFileID
      )
      .subscribe((result: any) => {
        if (this.commonService.base64regex.test(result.src) == true) {
          this.uploadedPhoto = "data:image/png;base64," + result.src;
          this.pic_title = result.title;
          // console.log(this.uploadedPhoto)
        } else {
          this.uploadedPhoto = result.src;
          this.photo_id = result.id;
          this.pic_title = result.title;
          // console.log(this.uploadedPhoto)
        }
      });
    this.previewService.open(this.preview).subscribe({
      complete: () => console.info("complete"),
    });
  }
  get previewContent(): PolymorpheusContent {
    return "this.uploadedPhoto";
  }
  // async viewVideo(fileid, title) {
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: "files",
  //     },
  //     backdropDismiss:false,
  //     component: VideoPlayerComponent,
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     if (this.openFolder == true) {
  //       this.getshowAllFiles(this.ParentID);
  //     } else {
  //       this.showAllFavorite();
  //       return (this.breadcrumbfiles = []);
  //     }
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
  download(filesid): void {
    this.downloadID = filesid;
    if (this.downloadID.length > 0) {
      this.downloadID = filesid;
    } else {
      this.downloadID = [filesid];
    }
    this.downloadFilesId = {
      fileId: this.downloadID,
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
    if (this.openFolder == true) {
      this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
    } else {
      this.showAllFavorite(this.page,this.pageSize);
      this.breadcrumbfiles = [];
    }
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
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
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
      } else {
        this.showAllFavorite(this.page,this.pageSize);
        return (this.breadcrumbfiles = []);
      }
    });
  }

  async OnmoveOrCopy(fileid) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        parentId: this.localService.getJsonValue(localData.parentId),
      },
      component: MoveCopyComponent,
      cssClass: "modal-fullscreen",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
      } else {
        this.uploadedFile = [];
        this.showIcon = false;
        this.toggleInfiniteScroll();
        this.showAllFavorite(this.page,this.pageSize);
        // this.breadcrumbfiles = [];
      }
      this.multiSelect = false;
      this.multicheckSelect = false;
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
      this.selectedFiles = [];
    });
  }

  async documentShare(id, type, title, mimeType) {
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
        reshare: false,
        fileTypes:fileTypes
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      if (this.openFolder == true) {
        this.getshowAllFiles(this.ParentID,this.page1,this.pageSize1);
      } else {
        this.uploadedFile = [];
        this.showIcon = false;
        this.toggleInfiniteScroll();
        this.showAllFavorite(this.page,this.pageSize);
        this.breadcrumbfiles = [];
      }
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
      this.selectedFiles = [];
    });
  }

  goToDashboard() {
    let parentId = this.localService.getJsonValue(localData.parentId);
    if (parentId == this.ParentID) {
      this.router.navigate(["/user/dashboard"]);
      this.commonService.storeBackBtnVal("true");
    } else {
      if (this.previousParent == 0) {
        this.router.navigate(["/user/dashboard"]);
        this.commonService.storeBackBtnVal("true");
      } else {
        if (this.previousParent == 0 || this.breadcrumbfiles.length == 1) {
          this.showAllFavorite(this.page,this.pageSize);
          this.breadcrumbfiles = [];
        } else {
          this.getshowAllFiles(this.previousParent,this.page1,this.pageSize1);
          // this.ParentID = this.previousParent;
          this.showAllFavorite(this.page,this.pageSize);
          this.selectedFiles = [];
          this.newFolder = false;
          this.newTextDoc = false;
          this.multiSelect = false;
          this.multicheckSelect = false;
          this.breadcrumbfiles.pop();
          this.selectedlength = false;
        }
      }
    }
  }

  OnmoreDetails(id) {
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
      this.showAllFavorite(this.page,this.pageSize);
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
}
