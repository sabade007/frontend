import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "../../service/common.service";
import { FilesService } from "src/app/service/files.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { PopoverController } from "@ionic/angular";
import { FileDeleteConfirmComponent } from "./../modalpage/file-delete-confirm/file-delete-confirm.component";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { AudioPlayerComponent } from "../modalpage/audio-player/audio-player.component";
import { VideoPlayerComponent } from "../modalpage/video-player/video-player.component";
import { localData, mimetypes } from "src/environments/mimetypes";
import { DuplicateFilesComponent } from "../modalpage/duplicate-files/duplicate-files.component";
import { environment } from "src/environments/environment.prod";
import { IonInfiniteScroll } from '@ionic/angular';
import { T } from "@angular/cdk/keycodes";
import { LocalService } from "src/environments/local.service";

@Component({
  selector: "app-deleted-files",
  templateUrl: "./deleted-files.component.html",
  styleUrls: ["./deleted-files.component.scss"],
})
export class DeletedFilesComponent implements OnInit {
  resData: any;
  uploadedFile: any = [];
  fileListView: boolean = true;
  fileGridView: boolean = false;
  image: any;
  filesLength: number;
  restoreDeleteFileId: any = [];
  deleteFilesParmanently: any = [];
  parentId = this.localService.getJsonValue(localData.parentId);
  popover: any;
  selectedFiles: any = [];
  fileId: any = [];
  mimes = mimetypes;

  multiSelect: boolean = false;
  selectedId: any = [];
  allSelected: boolean = false;
  unselectId: any;
  extention: any;
  reNameFile: boolean = true;
  reNameId: any;
  reName: any;
  ParentID = this.localService.getJsonValue(localData.parentId);
  breadcrumb: any = [];
  breadcrumbfiles: any = [];
  deleteFileId: any = [];
  page: number = 1;
  sortList: any = "Title";
  sortValue = "title";
  removable: boolean = true;
  filesCount: any;
  selectedfileLength: any;
  selectedlength: boolean = false;
  id: any;

  pageEvent: PageEvent;
  pageSize: number = 20;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("AllselectCheckbox") AllselectCheckbox: ElementRef;
  @ViewChild("MultiselectCheckbox") MultiselectCheckbox: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @HostListener("window:mouseup", ["$event"])
  selectedOption: boolean = false;
  HighlightRow: number;
  selectedRows: any = [];
  ClickedRow: any;
  singleClickSelect: boolean = false;
  sortOrder: boolean = false;
  overwrite: any = "null";
  checkboxChecked: boolean = false;
  productName = environment.productname;
  lastPageEvent: boolean = false;
  isLoadingTrash: boolean = true;
  showIcon: boolean = false;
  page1:number = 1;
  pageSize1:number = 20;

  mouseUp() {
    console.log("--")
    // if (this.selectedOption == false) {
    //   this.multiSelect = false;
    //   this.HighlightRow = null;
    // }

    // if (this.AllselectCheckbox["checked"] == true) {
    //   this.multiSelect = true;
    // }
    // if (this.checkboxChecked == true) {
    //   console.log("selected");
    //   this.multiSelect = true;
    // }
  }

  constructor(
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private localService: LocalService,
    private popoverController: PopoverController
  ) {
    route.params.subscribe((val) => {
      this.showAllTrashFiles(this.page,this.pageSize);
      this.commonService.getDashboardInfo();
    });
    this.commonService.storeHeader("Trash");
    this.commonService.storeStorageinfo(true);

    this.ClickedRow = function (index, id, clickEvent) {
      this.HighlightRow = index;
      this.multiSelect = true;
      this.selectedFiles = id;
      this.singleClickSelect = true;
    };
  }

  ngOnInit() {}

  fileListViewShow() {
    this.isLoadingTrash = true;
    this.page = 1;
    this.uploadedFile = [];
    this.showIcon = false;
    this.showAllTrashFiles(this.page1,this.pageSize1);
    this.fileListView = true;
    this.fileGridView = false;
    this.multiSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
  }
  fileGridViewShow() {
    this.isLoadingTrash = true;
    this.page = 1;
    this.uploadedFile = [];
    this.showIcon = false;
    this.showAllTrashFiles(this.page1,this.pageSize1);
    this.fileGridView = true;
    this.fileListView = false;
    this.multiSelect = false;
    this.selectedlength = false;
    this.selectedFiles = [];
    this.AllselectCheckbox["checked"] = false;
    this.allSelected = false;
  }

  onFocusInMulti(event: any) {
    this.selectedOption = true;
    if (this.selectedOption == true) {
      this.multiSelect = true;
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

  Onbackbreadcrumb(id) {
    if (id) {
      var list = document.getElementById("list");
      var listItems = list.getElementsByTagName("li");
      var last = listItems[listItems.length - 1];
      list.removeChild(last);
      this.showAllTrashFiles(this.page,this.pageSize);
    }
  }

  OnhomeFiles() {
    this.showAllTrashFiles(this.page,this.pageSize);
    this.ParentID =this.localService.getJsonValue(localData.parentId);
    this.breadcrumbfiles = [];
  }

  getFolderByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType === mimeType);
  }

  getFilesByFilter(mimeType) {
    return this.uploadedFile.filter((x) => x.mimeType != mimeType);
  }

  moreActions(){
    this.multiSelect = false;
  }

  showAllTrashFiles(page,pageSize) {
    //this.ngxService.start();
    let data = {
      asc: this.sortOrder,
      pageNb: page,
      parentId: 0,
      sortBy: this.sortValue,
      step: pageSize,
    };
    this.filesService.showAllTrashedFiles(data).subscribe((result: any) => {
      this.ngxService.stop();
      if(this.page == 1)
        this.uploadedFile = []
      // this.multiSelect = false;
      this.HighlightRow = null;
      this.isLoadingTrash = false;
      this.showIcon = true;
      // this.uploadedFile = result.childern;
      this.uploadedFile = this.uploadedFile.concat(result.childern);
      this.filesCount = result.count;
      this.filesLength = this.uploadedFile.length;
      if (this.filesLength == 0 && this.lastPageEvent == true && this.filesCount != 0) {
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
        let size = this.getReadableFileSizeString(file.size);
        file.sizeRead = size;
        let mimeType = file.mimeType;
        if (!mimetypes[mimeType]) {
          file.mimeType = "UNKNOWN";
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
        this.showAllTrashFiles(this.page,this.pageSize);
        this.AllselectCheckbox["checked"] = false;
        this.selectedFiles = [];
        this.allSelected = false;
        this.selectedlength = false;
        this.multiSelect = false;
        }
        else{
            this.showAllTrashFiles(this.page,this.pageSize);
        }
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
    console.log("hello")
    this.page = 1;
    const content = document.querySelector('ion-content');
    setTimeout(() => {
      content.scrollToTop(0);
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
}


  onPageChange(event: PageEvent) {
    this.lastPageEvent = true;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.showAllTrashFiles(this.page,this.pageSize);
    this.AllselectCheckbox["checked"] = false;
    this.multiSelect = false;
    this.allSelected = false;
    this.selectedlength = false;
    this.selectedFiles = [];
  }

  getPevpage() {
    this.page = 1;
    this.showAllTrashFiles(this.page,this.pageSize);
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
      this.sortValue = "title";
    } else if (this.sortValue === "Trashed Time") {
      this.sortValue = "trashedDate";
    }
    this.uploadedFile = [];
    this.showIcon = false;
    this.toggleInfiniteScroll();
    this.showAllTrashFiles(this.page,this.pageSize);
  }

  matChipremove() {
    this.removable = false;
  }

  async restoreFile(FilesId) {
    this.fileId = FilesId;
    if (this.fileId.length > 0) {
      this.fileId = FilesId;
    } else {
      this.fileId = [FilesId];
    }
    this.restoreDeleteFileId = {
      fileIds: this.fileId,
      restoreFile: true,
      trashFile: false,
      overWrite: this.overwrite,
    };
    //this.ngxService.start();
    this.filesService
      .trashFiles(this.restoreDeleteFileId)
      .subscribe(async (result: any) => {
        this.showIcon = false;
        this.uploadedFile = [];
        this.toggleInfiniteScroll();
        this.showAllTrashFiles(this.page1,this.pageSize1);
        this.selectedlength = false;
        this.ngxService.stop();
        this.toastr.success(result.message);
        this.commonService.storeStorageinfo(true);
        this.multiSelect = false;
        this.HighlightRow = null;
        this.selectedFiles = [];
        this.AllselectCheckbox["checked"] = false;
        this.allSelected = false;
        if (result.status === 400) {
          this.ngxService.stop();
        }
        console.log("result.message");
        if (result.code === 409) {
          // this.ngxService.stop();
          console.log("File already exists");
          this.popover = await this.popoverController.create({
            component: DuplicateFilesComponent,
            componentProps: {
              type: true,
              path: result.path,
            },
            keyboardClose: false,
            translucent: true,
            backdropDismiss: false,
            cssClass: "custom-popupclass",
          });
          await this.popover.present();
          // return this.popover.onDidDismiss();
          console.log("------------------------------------------");
          console.log(FilesId + " ondismiss");
          return this.popover.onDidDismiss().then((data) => {
            this.overwrite = data.data.overWrite;
            console.log(data.data.overWrite + " overwrite");
            if (data.data.overWrite === "") {
              this.overwrite = "null";
              console.log("---restore---")
              return;
            }
            else if (data.data.overWrite != "" || data.data.restoreAll) {
              this.restoreFile(FilesId);
              console.log("restorefile", this.restoreFile(FilesId))
              this.overwrite = "null";
            } else if (data.data.overWrite != "" || !data.data.restoreAll) {
              this.restoreFile(this.fileId[0]);
              console.log("restoreee")
              this.overwrite = "null";
            } 
          });
        }
      });
  }

  deleteFile(FilesId) {
    this.fileId = FilesId;
    if (this.fileId.length > 0) {
      this.fileId = FilesId;
    } else {
      this.fileId = [FilesId];
    }
    this.deleteFileConfirm(this.fileId);
  }

  async deleteFileConfirm(id) {
    this.popover = await this.popoverController.create({
      component: FileDeleteConfirmComponent,
      keyboardClose: false,
      translucent: true,
      componentProps: {
        id: id,
        type: "trash",
      },
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });

    await this.popover.present();

    return this.popover.onDidDismiss().then((data) => {
      this.selectedfileLength = 0;
      this.showIcon = false;
      this.uploadedFile = [];
      this.toggleInfiniteScroll();
      this.showAllTrashFiles(this.page1,this.pageSize1);
      this.commonService.storeStorageinfo(true);
      this.selectedlength = false;
      this.selectedFiles = [];
      this.AllselectCheckbox["checked"] = false;
      this.allSelected = false;
      this.selectedlength = false;
      if (data.data) {
        this.deleteFiles(id);
      }
    })
    .finally(() => {
      this.selectedfileLength = 0;
      this.selectedFiles = [];
      this.selectedlength = false;
    });
  }

  deleteFiles(id) {
    this.deleteFilesParmanently = {
      fileId: id,
    };
    //this.ngxService.start();
    this.filesService.deleteFiles(this.deleteFilesParmanently).subscribe(
      (result: any) => {
        if (result.code === 200) {
          this.showIcon = false;
          this.uploadedFile = [];
          this.toggleInfiniteScroll();
          this.showAllTrashFiles(this.page1,this.pageSize1);
          this.selectedlength = false;
          this.multiSelect = false;
          this.selectedFiles = [];
          this.commonService.storeStorageinfo(true);
          this.AllselectCheckbox["checked"] = false;
          this.allSelected = false;
        }
        this.ngxService.stop();
        this.toastr.success(result.message);
      },
      (error) => {
        this.ngxService.stop();
        this.multiSelect = false;
        this.selectedlength = false;
        this.AllselectCheckbox["checked"] = false;
        this.allSelected = false;
      }
    );
  }

  getSelectedFiles(checkbox: MatCheckbox) {
    if (this.singleClickSelect == true) {
      this.selectedFiles = [];
      this.allSelected = false;
      this.multiSelect = false;
    }
    if (checkbox.checked === false) {
      this.singleClickSelect = false;
      this.checkboxChecked = true;
      this.selectedFiles.push(checkbox.value);
      this.multiSelect = true;
      for(let i = 0; i < this.selectedFiles.length;i++){
        this.selectedfileLength = this.selectedFiles.length;
        this.selectedlength = true;
      }
    } else if (checkbox.checked === true) {
      this.singleClickSelect = false;
      this.checkboxChecked = false;
      this.multiSelect = true;
      this.selectedfileLength = this.selectedFiles.length - 1;
      console.log("decrement", this.selectedfileLength)
      this.selectedlength = true;
      const index = this.selectedFiles.indexOf(checkbox.value);
      if (index > -1) {
        this.selectedFiles.splice(index, 1);
      }
      if (this.selectedFiles.length === 0) {
        this.multiSelect = false;
        this.selectedlength = false;
        this.selectedfileLength = 0;
      }
    }
  }

  getAllSelected(checkbox: MatCheckbox) {
    if (checkbox.checked === false) {
      this.allSelected = true;
      let selected: any = [];
      selected = checkbox.value;
      for (let i = 0; i < selected.length; i++) {
        this.selectedfileLength = selected.length;
        this.selectedlength = true;
        this.selectedFiles.push(selected[i].id);
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
        this.selectedlength = false;
      }
    }
  }

  async viewVideo(fileid, title) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
      },
      component: VideoPlayerComponent,
      backdropDismiss: false,
    });
    return this.popover.present();
  }

  async viewAudio(fileid, title) {
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileid,
        fileTitle: title,
      },
      component: AudioPlayerComponent,
      backdropDismiss: false,
    });
    return this.popover.present();
  }

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
  }
}
