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
} from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "../../service/common.service";
import { environment } from "src/environments/environment.prod";
import { ActivatedRoute, Router } from "@angular/router";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import * as moment from "moment";
import { FilesService } from "src/app/service/files.service";
import { ToastController, PopoverController } from "@ionic/angular";
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
import { Subscription } from "rxjs";
import { CollaboraComponent } from "../layouts/ifame/collabora/collabora.component";
import { localData, mimetypes } from "src/environments/mimetypes";
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
import { DomSanitizer } from "@angular/platform-browser";
import { ManageVersionsComponent } from "../modalpage/manage-versions/manage-versions.component";
import { IonInfiniteScroll } from '@ionic/angular';
import { ShareComponent } from "../modalpage/share/share.component";
import { LocalService } from "src/environments/local.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-searched-result",
  templateUrl: "./searched-result.component.html",
  styleUrls: ["./searched-result.component.scss"],
})
export class SearchedResultComponent implements OnInit {
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;
  @ViewChild("content")
  readonly content?: TemplateRef<TuiDialogContext<void>>;
  filesType: any = "";
  multiSelect: boolean = false;
  allSelected: boolean = false;
  HighlightRow: number;
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  SharedFileID: number = -1;
  public selectedFile: any = File;
  resData: any;
  uploadedFile: any = [];
  fileListView: boolean = true;
  fileGridView: boolean = false;
  image: any;
  reNameFile: boolean = true;
  reNameId: any;
  reName: any;
  ParentID = this.localService.getJsonValue(localData.searchedId);
  filesLength: any;
  breadcrumb: any = [];
  breadcrumbfiles: any = [];
  deleteFileId: any = [];
  favoriteFile: any = [];
  downloadFilesId: any = [];
  title: any;
  id: any;
  selectedFiles: any = [];
  selectedId: any = [];
  fileId: any = [];
  downloadID: any = [];
  breadcrumbfileslist: any = [];
  popover: any;
  ClickedRow: any;

  filenames: string[] = [];
  fileStatus = { status: "", requestType: "", percent: 0 };
  unselectId: any;
  page: number = 1;
  allFilesData: any = [];
  filesCount: any;
  openFolder: boolean = false;
  sortList: any = "Modified At";
  sortValue = "modifiedAt";
  removable: boolean = true;
  mimes = mimetypes;

  pageEvent: PageEvent;
  pageSize: number = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("toggleButton") toggleButton: ElementRef;
  @ViewChild("menu") menu: ElementRef;
  sharedlength: any;
  reNameDoc: any;
  onFocusInput: boolean = false;
  firstlogin: any;
  photo: any = [];
  subscription: Subscription;
  subscriptionSearchedValue: Subscription;
  createdTime: boolean = false;
  dashboardResult: any = [];
  extention: any;
  strname: any;
  extenstion: any;
  name: any;
  searchedValue: any = [];
  renameMimeType: any;
  Searchedpath: any;
  searchedPathData: any = [];
  uploadedPhoto: any;
  photo_id: any;
  pic_title: any;
  sharedType: any = "files";
  //video
  url: any;
  parentId: any;
  minio: any = "not minio";
  file_id: any;
  vid_title: any;
  productName = environment.productname;
  isMobile: boolean = false;
  versionId: any;
  viewDetails: boolean = false;
  fileDetails: any = [];
  owner: any;
  description: any;
  fileicon: any;
  fileTitle: any;
  fileid: any;
  fileType: any;
  activityList: any = [];
  createdat: any;
  lastModifiedDate: any;
  size: any;
  lastModifiedAt: any;
  sharedWith: any = [];
  onedit: boolean = false;
  isLoadingSearchResults: boolean = true;
  showIcon: boolean = false;
  onclose: boolean = false;
  showMore : boolean = false;
  isTag: boolean = false;
  createTagForm: FormGroup;
  listTag: any = [];
  inputValues: any;
  searchTagList: any= [];

  @HostListener("window:mouseup", ["$event"])
  mouseUp() {
    if (this.onFocusInput == false) {
      this.reNameFile = true;
    }
  }

  constructor(
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
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
      this.OnshowSearchedFiles(this.localService.getJsonValue(localData.searchedId));
      this.commonService.getDashboardInfo();
    });

    this.commonService.storeHeader("Searched Result");

    this.subscription = this.commonService.getpath().subscribe((message) => {
      if (message == "path") {
        this.OnshowSearchedFiles(this.localService.getJsonValue(localData.searchedId));
        this.ParentID = this.localService.getJsonValue(localData.searchedId);
        this.selectedFiles = [];
        this.breadcrumbfiles = [];
      }
    });

    this.ClickedRow = function (index, id, clickEvent) {
      this.HighlightRow = index;
      this.multiSelect = true;
      this.selectedFiles = id;
      this.singleClickSelect = true;
      this.openMenu = false;
    };

    this.subscriptionSearchedValue = this.commonService
      .getstoreSearchedValue()
      .subscribe((searchedValue) => {
        this.searchedValue = searchedValue;
        this.selectedFiles = [];
        this.breadcrumbfiles = [];
        this.searchedPathData = [];
        this.OnshowSearchedFiles(this.localService.getJsonValue(localData.searchedId));
      });
    this.openFolder = false;
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
    }
    this.firstlogin = this.localService.getJsonValue(localData.firstLogin);
    this.createTagForm = this.fb.group({
      tagName: new FormControl("", Validators.required),
    });
  }

  onFocusInEvent(event: any) {
    this.onFocusInput = true;
    if (this.onFocusInput == true) {
      this.reNameFile = false;
    }
  }

  fileListViewShow() {
    if (this.openFolder == true) {
      this.page = 1;
      this.showIcon = false;
      this.uploadedFile = [];
      this.isLoadingSearchResults = true;
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    } else if (this.openFolder == false) {
      this.isLoadingSearchResults = true;
      this.OnshowSearchedFiles(this.ParentID);
    }
    this.fileListView = true;
    this.fileGridView = false;
  }

  fileGridViewShow() {
    if (this.openFolder == true) {
      this.page = 1;
      this.showIcon = false;
      this.uploadedFile = [];
      this.isLoadingSearchResults = true;
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    } else if (this.openFolder == false) {
      this.isLoadingSearchResults = true;
      this.OnshowSearchedFiles(this.ParentID); 
    }
    this.fileGridView = true;
    this.fileListView = false;
  }

  getFolderByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType === mimeType);
  }

  getFilesByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType != mimeType);
  }

  OnshowSearchedFiles(id) {
    this.filesService.OnshowSearchedFiles(id).subscribe(
      (result: any) => {
        this.openFolder = false;
        this.ngxService.stop();
        if(this.page == 1)
          this.uploadedFile = [];
        this.isLoadingSearchResults = false;
        this.photo = [];
        // this.uploadedFile = result;
        this.uploadedFile = this.uploadedFile.concat(result);
        this.filesCount = result.count;
        this.filesLength = this.uploadedFile.length;
        this.uploadedFile.forEach(file => {
          if (
            this.commonService.base64regex.test(file.icon) ==
            true
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
            mimeType == "image/jpeg"
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
          if (file.path != "files") {
            this.Searchedpath = file.path.replace("files/", "");
            this.searchedPathData = this.Searchedpath.split("/").filter(
              (w) => w !== ""
            );
          } else if (file.path == "files") {
            this.Searchedpath = file.path.replace("files", "");
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

  OnshowAllFiles(parentId,page,pageSize) {
    //this.ngxService.start();
    let data = {
      asc: false,
      pageNb: page,
      parentId: parentId,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.filesService.OnshowFiles(data).subscribe(
      (result: any) => {
        if(this.page == 1)
          this.uploadedFile = [];
        this.openFolder = true;
        this.ngxService.stop();
        this.isLoadingSearchResults = false;
        this.showIcon = true;
        this.photo = [];
        // this.uploadedFile = result.childern;
        this.uploadedFile = this.uploadedFile.concat(result.childern);
        this.filesCount = result.count;
        this.filesLength = this.uploadedFile.length;
        this.uploadedFile.forEach(file => { 
          if (
            this.commonService.base64regex.test(file.icon) ==
            true
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
            mimeType == "image/jpeg"
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

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
  }

  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // OnopenFile(id, mimeType, title,versionId) {
  //   if (id && mimeType === "httpd/unix-directory" && this.reNameFile === true) {
  //     this.openFolder = true;
  //     this.ParentID = id;
  //     this.OnshowAllFiles(id);
  //     this.breadcrumb = {
  //       title: title,
  //       id: id,
  //     };
  //     this.breadcrumbfiles.push(this.breadcrumb);
  //   } else if (id && mimeType === "application/pdf") {
  //     if (this.reNameFile === true) {
  //       this.viwePdfViwer(id, title);
  //     }
  //   } else if (id && mimeType === "text/plain") {
  //     if (this.reNameFile === true) {
  //       this.viewTextEdit(id, title);
  //       //this.openOffice(id, title);

  //     }
  //   } else if (id && mimeType === "video/mp4") {
  //     if (this.reNameFile === true) {
  //       this.viewVideo(id, title);
  //     }
  //   } else if (id && (mimeType === "audio/mpeg" || mimeType === "audio/mp3")) {
  //     if (this.reNameFile === true) {
  //       this.viewAudio(id, title);
  //     }
  //   } else if (
  //     id &&
  //     (mimeType === "image/png" ||
  //       mimeType === "image/jpeg" ||
  //       mimeType === "image/jpg" ||
  //       mimeType === "image/svg+xml")
  //   ) {
  //     if (this.reNameFile === true) {
  //       this.viewPhoto(id, title);
  //     }
  //   }
  // }

  OnopenFile(id, mimeType, title, versionId) {
    console.log(id, mimeType, title);
    this.breadcrumbfileslist.push(id);
    if (id && this.reNameFile === true) {
      switch (mimetypes[mimeType].editor) {
        case "FOLDER":
          this.openFolder = true;
          this.ParentID = id;
          this.uploadedFile = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(id,this.page,this.pageSize);
          this.breadcrumb = {
            title: title,
            id: id,
          };
          this.breadcrumbfiles.push(this.breadcrumb);
          break;

        case "PDF_VIEWER":
          this.viwePdfViwer(id, title);
          break;
        case "IMAGE_VIEWER":
          this.viewPhoto(id, title);
          break;
        case "TEXT_EDITOR":
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
    } else if (id && mimeType === "application/msword") {
      if (this.reNameFile === true) {
      }
    } else if (id && mimeType === "other") {
      if (this.reNameFile === true) {
        this.OnDownload(id);
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
    return this.popover.onDidDismiss().then((data) => {});
  }

  OnRename(id, title, mimeType) {
    this.reNameDoc = title;
    this.reNameFile = false;
    this.reNameId = id;
    this.renameMimeType = mimeType;
    this.strname = this.reNameDoc;
    this.strname = this.strname.split(".").shift();
    this.extenstion = this.reNameDoc.split(".").pop();
  }

  OnCreateNewName($event) {
    this.reName = $event.target.value;
    if (!(this.renameMimeType == "httpd/unix-directory")) {
      this.name = this.reName + "." + this.extenstion;
    } else {
      this.name = this.reName;
    }
  }

  OnreNameFiles(id) {
    //this.ngxService.start();
    if (this.reName === this.reNameDoc || this.reName == " ") {
      this.ngxService.stop();
      this.reNameFile = true;
    } else {
      this.commonService.CreateReName(id, this.reName).subscribe(
        (data) => {
          if (data.code == 200) {
            this.ngxService.stop();
            this.reNameFile = true;
            if (this.localService.getJsonValue(localData.searchedId) != id) {
              this.showIcon = false;
              this.uploadedFile = [];
              this.toggleInfiniteScroll();
              this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
            } else {
              this.OnshowSearchedFiles(id);
            }
            this.toastr.success("File Renamed Successfully");
          } else if (data.code == 304) {
            this.ngxService.stop();
            this.reNameFile = true;
            if (this.localService.getJsonValue(localData.searchedId) != id) {
              this.showIcon = false;
              this.uploadedFile = [];
              this.toggleInfiniteScroll();
              this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
            } else {
              this.OnshowSearchedFiles(id);
            }
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

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
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
          if (this.openFolder == true) {
            this.showIcon = false;
            this.uploadedFile = [];
            this.toggleInfiniteScroll();
            this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
          } else if (this.openFolder == false) {
            this.OnshowSearchedFiles(this.ParentID);
            this.router.navigate(["/user/files/all"]);
            
          }
          this.ngxService.stop();
          this.toastr.success(result["message"]);
          this.selectedFiles = [];
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
      }
    });
  }

  // async documentShare(id, type, title) {
  //   this.popover = await this.popoverController.create({
  //     component: ShareComponent,
  //     keyboardClose: false,
  //     translucent: true,
  //     componentProps: {
  //       id: id,
  //       sharedType: "files",
  //       Accesstype: type,
  //       title: title,
  //     },
  //     backdropDismiss: false,
  //     cssClass: "custom-popupclass",
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     if (this.openFolder == true) {
  //       this.OnshowAllFiles(this.ParentID);
  //     } else if (this.openFolder == false) {
  //       this.OnshowSearchedFiles(this.ParentID);
  //     }
  //     // if(this.ParentID == this.localService.getJsonValue(localData.searchedId)){
  //     //   this.selectedFiles = [];
  //     //   this.breadcrumbfiles = [];
  //     // }
  //   });
  // }

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
        reShare: false,
        fileTypes:fileTypes
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
      return this.popover.onDidDismiss().then((data) => {
      if (this.openFolder == true) {
        this.showIcon = false;
        this.uploadedFile = [];
        this.toggleInfiniteScroll();
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else if (this.openFolder == false) {
        this.showIcon = false;
        this.uploadedFile = [];
        this.OnshowSearchedFiles(this.ParentID);
      }
      // if(this.ParentID == this.localService.getJsonValue(localData.searchedId)){
      //   this.selectedFiles = [];
      //   this.breadcrumbfiles = [];
      // }
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
        if (this.openFolder == true) {
          this.showIcon = false;
          this.uploadedFile = [];
          this.toggleInfiniteScroll();
          this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
        } else if (this.openFolder == false) {
          this.OnshowSearchedFiles(this.ParentID);
        }
        this.ngxService.stop();
        if (result.flag === true) {
          this.toastr.success("Added favorite to your File / Folder");
        } else {
          this.toastr.success("Removed favorite to your File / Folder");
        }
      });
  }

  Onbackbreadcrumb(id) {
    let index = this.breadcrumbfileslist.findIndex((x) => x === id);
    console.log("indexx", index);
    this.breadcrumbfileslist.splice(index + 1);
    this.breadcrumbfileslist.length = index + 1;
    if (id) {
      this.breadcrumbfiles.length = index + 1;
      // this.OnshowAllFiles(id,this.page,this.pageSize);
      this.ParentID = id;
      this.showIcon = false;
      this.uploadedFile = [];
      this.toggleInfiniteScroll();
      this.OnshowAllFiles(id,this.page,this.pageSize);
    }
  }

  OnhomeFiles() {
    this.router.navigate(["/user/files/all"]);
    this.breadcrumbfileslist = [];
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
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
      }
    );
    if (this.openFolder == true) {
      this.showIcon = false;
      this.uploadedFile = [];
      this.toggleInfiniteScroll();
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    } else if (this.openFolder == false) {
      this.OnshowSearchedFiles(this.ParentID);
    }
    this.selectedFiles = [];
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

  async viwePdfViwer(fileid, title) {
    if (this.openFolder != true) {
      this.ParentID = fileid;
    }
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
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else {
        this.OnshowSearchedFiles(this.ParentID);
      }
    });
  }

  async viewTextEdit(fileid, title) {
    if (this.openFolder != true) {
      this.ParentID = fileid;
    }
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
      console.log("---object---", data.data)
      if (this.openFolder == true) {
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else {
        this.OnshowSearchedFiles(data.data.object);
      }
    });
  }

  // async viewPhoto(fileid, title) {
  //   if (this.openFolder != true) {
  //     this.ParentID = fileid;
  //   }
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
  //       this.OnshowAllFiles(this.ParentID);
  //     } else {
  //       this.OnshowSearchedFiles(this.ParentID);
  //     }
  //   });
  // }
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
          // console.log(this.uploadedPhoto)
        } else {
          this.uploadedPhoto = result.src;
          this.photo_id = result.id;
          this.pic_title = result.title;
          // console.log(this.uploadedPhoto);
          // console.log(this.pic_title);
        }
      });

    this.previewService.open(this.preview).subscribe({
      complete: () => console.info("complete"),
    });
  }
  get previewContent(): PolymorpheusContent {
    return "this.uploadedPhoto";
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
    // this.OnshowAllFiles(this.ParentID);
    if (this.openFolder == true) {
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
    } else {
      this.OnshowSearchedFiles(this.ParentID);
    }
    this.HighlightRow = null;
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
    this.notificationsService.show("Downloading...").subscribe();
  }

  // async viewVideo(fileid, title) {
  //   if (this.openFolder != true) {
  //     this.ParentID = fileid;
  //   }
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: "files",
  //     },
  //     backdropDismiss: false,
  //     component: VideoPlayerComponent,
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     if (this.openFolder == true) {
  //       this.OnshowAllFiles(this.ParentID);
  //     } else {
  //       this.OnshowSearchedFiles(this.ParentID);
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
        this.parentId;
    }
    // let data;
    // if (this.sharedType == "files" || this.sharedType == "self") {
    //   data =
    //     fileid + "?isShared=false&token=" +this.localService.getJsonValue(localData.token)
    // } else if (this.sharedType == "others" && this.filesType == "") {
    //   data =
    //     fileid + "?isShared=true&token=" +this.localService.getJsonValue(localData.token)
    // } else if (
    //   this.filesType == "insideFolder" &&
    //   this.sharedType == "others"
    // ) {
    //   data =
    //     fileid +
    //     "?isShared=true&token=" +
    //    this.localService.getJsonValue(localData.token) +
    //     "&folderId=" +
    //     this.parentId;
    // }
    this.filesService.viewVideo(this.url).subscribe((result: any) => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(result.value);
      // console.log(this.url);

      this.minio = result.object;
    });
    this.previewService.open(this.content || "").subscribe();
  }

  async viewAudio(fileid, title) {
    if (this.openFolder != true) {
      this.ParentID = fileid;
    }
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
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      } else {
        this.OnshowSearchedFiles(this.ParentID);
      }
    });
  }

  async OnmoveOrCopy(fileid) {
    if (this.openFolder != true) {
      this.ParentID = fileid;
    }
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
      if (this.openFolder == true) {
        this.showIcon = false;
        this.uploadedFile = [];
        this.toggleInfiniteScroll();
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
        this.selectedFiles = [];
      } else {
        this.OnshowSearchedFiles(this.ParentID);
        this.selectedFiles = [];
      }
    });
  }

  OnmoreDetails(id,versionId) {
    this.versionId = versionId;
    this.viewDetails = true;
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
      if (this.openFolder == true) {
        this.showIcon = false;
        this.uploadedFile = [];
        this.toggleInfiniteScroll();
        this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
      }else{
      this.OnshowSearchedFiles(this.ParentID);
      this.viewDetails = false;
      }
    });
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

  OncloseMenu() {
    this.viewDetails = false;
  }

  loadData(event){
    console.log("exzaexza") 
    if(this.filesCount > 20){
      setTimeout(() => { 
      console.log("Done ",event);
      console.log("123")
      this.page = this.page + 1;
      event.target.complete();
      this.OnshowAllFiles(this.ParentID,this.page,this.pageSize);
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
