import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
} from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IonInfiniteScroll } from '@ionic/angular';

import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import * as moment from "moment";
import { FilesService } from "src/app/service/files.service";
import { PhotosService } from "src/app/service/photos.service";
import { ToastController, PopoverController } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { PhotoViewerComponent } from "../../modalpage/photo-viewer/photo-viewer.component";
import { MoreDetailsComponent } from "../../modalpage/more-details/more-details.component";

//taiga changes
import { ChangeDetectionStrategy, Inject, TemplateRef } from "@angular/core";
// import {changeDetection} from '@demo/emulate/change-detection';
// import {encapsulation} from '@demo/emulate/encapsulation';
import { PreviewDialogService } from "@taiga-ui/addon-preview";
import { clamp, TuiSwipe } from "@taiga-ui/cdk";
import { TuiDialogContext, TuiNotificationsService } from "@taiga-ui/core";
import { PolymorpheusContent } from "@tinkoff/ng-polymorpheus";
import { saveAs } from "file-saver";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { environment } from "src/environments/environment.prod";
@Component({
  selector: "app-photos-favorites",
  templateUrl: "./photos-favorites.component.html",
  styleUrls: ["./photos-favorites.component.scss"],
})
export class PhotosFavoritesComponent implements OnInit {
  @ViewChild("preview")
  readonly preview?: TemplateRef<TuiDialogContext<void>>;

  @ViewChild("contentSample")
  readonly contentSample?: TemplateRef<{}>;
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  index = 0;
  length;
  productName = environment.productname;
  photo: any = [];
  uploadedPhoto: any = [];
  photosLength: number;
  forceShowNavButton: boolean = true;
  transitionDurations: number = 500;
  page: number = 1;
  filesCount: any;
  sortList: any = "Modified At";
  sortValue = "modifiedAt";
  removable: boolean = true;
  pageEvent: PageEvent;
  pageSize: number = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fileId: any = [];
  deleteFileId: any = [];
  favoriteFile: any = [];
  popover: any;
  createdTime: boolean = false;
  dashboardResult: any = [];
  extention: any;
  selectedOption: boolean = false;
  HighlightRow: number;
  selectedRows: any = [];
  pDetails: any;
  @HostListener("window:mouseup", ["$event"])
  ClickedRow: any;
  multiSelect: boolean = false;
  selectedFiles: any;
  currentIndex: any = -1;
  showFlag: any = false;
  fullImage: any = [];
  //DOWNLOAD
  downloadID: any = [];
  downloadFilesId: any = [];
  ParentID = this.localService.getJsonValue(localData.parentId);
  fileStatus = { status: "", requestType: "", percent: 0 };
  filenames: string[] = [];
  allSelected: boolean = false;
  image_id: any;
  uploadedPhto: any;
  photo_id: any;
  pic_title: any;
  newIndex: any;
  SharedFileID: number = -1;
  sharedType: any = "files";
  filesType: any = "";
  dblclick: boolean = true;
  newarr: any;
  photo_title: any;
  selectedpic: any;
  isMobile: boolean = false;
  lastPageEvent: boolean = false;
  page1:number = 1;
  pageSize1:number = 20;
  isLoadingPhotosFav:boolean = true;

  mouseUp() {
    if (this.selectedOption == false) {
      this.multiSelect = false;
      this.HighlightRow = null;
    }
  }

  sortOrder: boolean = false;

  constructor(
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private filesService: FilesService,
    private photosService: PhotosService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    private toastr: ToastrService,
    private popoverController: PopoverController,
    private localService: LocalService,
    @Inject(PreviewDialogService)
    private readonly previewService: PreviewDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    route.params.subscribe((val) => {
      this.allFavotitesPhotos(this.page,this.pageSize);
      this.commonService.getDashboardInfo();
    });
    this.commonService.storeHeader("Photos / Favorites");

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
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
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

  allFavotitesPhotos(page,pageSize) {
    // this.ngxService.start();
    let data = {
      asc: this.sortOrder,
      pageNb: page,
      parentId: 0,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.photosService.allFavotitesPhoto(data).subscribe((result: any) => {
      if(this.page == 1)
          this.uploadedPhoto = []
      this.uploadedPhoto = this.uploadedPhoto.concat(result.childern);
      // this.uploadedPhoto = result.childern;

      var arr = [];
      this.uploadedPhoto.forEach(function (i) {
        arr.push({ imageid: i.id });
      });
      this.fullImage = arr;
      console.log(this.fullImage);
      this.filesCount = result.count;
      this.multiSelect = false;
      this.HighlightRow = null;
      this.isLoadingPhotosFav = false;
      let test = [];
      test = this.uploadedPhoto;
      this.photosLength = this.uploadedPhoto.length;
      if (this.photosLength == 0 && this.lastPageEvent == true && this.filesCount != 0) {
        this.getPevpage();
      }
      this.uploadedPhoto.forEach(file => {
        if (
          this.commonService.base64regex.test(file.icon) ==
          true
        ) {
          this.photo = test.map((a) => "data:image/png;base64," + a.src);
        } else {
          this.photo = test.map((a) => a.src);
        }
        let date = moment(file.modifiedAt).fromNow();
        file.createdAtRead = moment(
          file.createdAt
        ).fromNow();
        file.modifiedAtRead = date;
        let size = this.getReadableFileSizeString(file.size);
        file.sizeRead = size;
        if (
          this.commonService.base64regex.test(file.icon) ==
          true
        ) {
          file.icon =
            "data:image/png;base64," + file.icon;
        }
        this.extention = file.title.split(".").pop();
        file.extention = this.extention;
        let extn: any;
        extn = file.title;
        if (extn.indexOf(".") == -1) {
          this.extention = "Unknown";
          file.extention = this.extention;
        }
      });
      this.ngxService.stop();
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
      this.allFavotitesPhotos(this.page,this.pageSize);
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

  getPevpage() {
    this.page = 1;
    this.allFavotitesPhotos(this.page,this.pageSize);
  }
  

  //Get sort value
  // OngetSort(value) {
  //   this.sortList = value;
  //   this.removable = true;
  //   this.sortValue = value;
  //   if (this.sortValue === "Title") {
  //     if (this.sortOrder == false) {
  //       this.sortOrder = true;
  //     } else if (this.sortOrder == true) {
  //       this.sortOrder = false;
  //     }
  //     this.createdTime = false;
  //     this.sortValue = "title";
  //   } else if (this.sortValue === "Size") {
  //     this.createdTime = false;
  //     this.sortValue = "size";
  //   } else if (this.sortValue === "Created At") {
  //     this.createdTime = true;
  //     this.sortValue = "createdAt";
  //   } else if (this.sortValue === "Modified At") {
  //     this.createdTime = false;
  //     this.sortValue = "modifiedAt";
  //   }
  //   this.allFavotitesPhotos();
  // }

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
    this.uploadedPhoto = [];
    this.toggleInfiniteScroll();
    this.allFavotitesPhotos(this.page1,this.pageSize1);
  }

  matChipremove() {
    this.removable = false;
  }

  onPageChange(event: PageEvent) {
    this.lastPageEvent = true
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.allFavotitesPhotos(this.page,this.pageSize);
  }

  onFocusInMulti(event: any) {
    this.selectedOption = true;
    if (this.selectedOption == true) {
      this.multiSelect = true;
    }
  }

  trashFile(FilesId) {
    this.deleteFileId = {
      fileIds: [FilesId],
      restoreFile: false,
      trashFile: true,
    };
    this.ngxService.start();
    this.filesService.trashFiles(this.deleteFileId).subscribe((result: any) => {
      this.uploadedPhoto = [];
      this.toggleInfiniteScroll();
      this.allFavotitesPhotos(this.page1,this.pageSize1);
      this.ngxService.stop();
      this.selectedOption = false;
      this.toastr.success(result.message);
      if (result.status === 400) {
        this.ngxService.stop();
      }
    });
  }

  removeFavorite(id) {
    this.favoriteFile = {
      flag: false,
      id: id,
    };
    this.ngxService.start();
    this.filesService
      .addFavorites(this.favoriteFile)
      .subscribe((result: any) => {
        this.uploadedPhoto = [];
        this.toggleInfiniteScroll();
        this.allFavotitesPhotos(this.page1,this.pageSize1);
        this.ngxService.stop();
        this.toastr.success(result.message);
      });
  }

  // async viewPhoto(fileid, title , index) {
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       fileid: fileid,
  //       fileTitle: title,
  //       sharedType: 'files',
  //       photos: this.uploadedPhoto,
  //       page: 'photo',
  //       index:index
  //     },
  //     component: TaigaFavviewerComponent,
  //   });
  //   await this.popover.present();

  //   return this.popover.onDidDismiss().then(
  //     (data) => {
  //       this.multiSelect = false;
  //       this.HighlightRow = null;
  //     }
  //   );
  // }

  async OnmoreDetails(details) {
    this.popover = await this.popoverController.create({
      componentProps: {
        details: details,
      },
      component: MoreDetailsComponent,
    });
    await this.popover.present();

    return this.popover.onDidDismiss().then((data) => {
      this.multiSelect = false;
      this.HighlightRow = null;
      this.selectedOption = false;
      this.uploadedPhoto = [];
      this.toggleInfiniteScroll();
      this.allFavotitesPhotos(this.page1,this.pageSize1);
    });
  }

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
    this.commonService.storeBackBtnVal("true");
  }

  // showLightbox(index) {
  //   this.currentIndex = index;
  //   this.showFlag = true;

  // }
  // closeEventHandler() {
  //   this.showFlag = false;
  //   this.currentIndex = -1;

  // }
  //   get previewContent(): PolymorpheusContent {
  //     return this.fullImage[this.index].image
  // }

  // show(idx) {
  //   // console.log("show()")
  //   this.currentIndex = idx;
  //   this.previewService.open(this.preview).subscribe({
  //     complete: () => console.info("complete"),
  //   });
  // }
  async viewPhoto(id, title, index) {
    console.log(
      title,
      id,
      this.sharedType,
      this.ParentID,
      this.filesType,
      this.SharedFileID,
      "dataaaaaae4rr"
    );

    this.newIndex = index;
    console.log(this.newIndex);
    console.log("show");
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
          console.log(this.photo_id);
          console.log(this.uploadedPhto);
          console.log(this.pic_title);
        }
        this.onclick(this.photo_id);
        this.previewService.open(this.preview).subscribe({
          complete: () => console.info("complete"),
        });
      });
  }

  get previewContent(): PolymorpheusContent {
    if (this.dblclick == true) {
      this.selectedpic = this.uploadedPhto;
    } else {
      this.selectedpic = this.newarr;
    }
    return this.selectedpic;
  }

  onclick(idx) {
    this.dblclick = false;
    console.log(idx);

    this.filesService.traversePhoto(idx).subscribe((data) => {
      console.log(data.src);
      this.newarr = data.src;
      this.photo_title = data.title;
    });
  }

  ondownload(filesid): void {
    // alert('hello');
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
    this.allFavotitesPhotos(this.page,this.pageSize);
    this.HighlightRow = null;
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
    this.notificationsService.show("Downloading...").subscribe();
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

  download(filesid): void {
    // alert('hello');
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
    this.allFavotitesPhotos(this.page,this.pageSize);
    this.HighlightRow = null;
    this.AllselectCheckbox["checked"] = false;
    this.selectedFiles = [];
    this.allSelected = false;
    this.notificationsService.show("Downloading...").subscribe();
  }
  keydown(event) {
    this.keyup(event);
    console.log(event);
    // event.stopImmediatePropagation();

    // event.preventDefault();
    // return false;
    if (event.keyCode == 37) {
      event.stopImmediatePropagation();
      // event.preventDefault();
      // return false;
    } else if (event.keyCode == 39) {
      event.stopImmediatePropagation();
    }
  }
  keyup(event) {
    console.log(event);
    // event.stopImmediatePropagation();

    // event.preventDefault();
    // return false;
    if (event.keyCode == 37) {
      event.stopImmediatePropagation();
      // event.preventDefault();
      // return false;
    } else if (event.keyCode == 39) {
      event.stopImmediatePropagation();
    }
  }

  closePreview(){
    this.uploadedPhoto = [];
    this.toggleInfiniteScroll();
    this.allFavotitesPhotos(this.page1,this.pageSize1);
  }
}
