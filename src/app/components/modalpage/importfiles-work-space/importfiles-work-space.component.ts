import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, PopoverController, NavParams } from '@ionic/angular';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Component({
  selector: 'app-importfiles-work-space',
  templateUrl: './importfiles-work-space.component.html',
  styleUrls: ['./importfiles-work-space.component.scss'],
})
export class ImportfilesWorkSpaceComponent implements OnInit {

  newFolder: boolean = false;
  newFolderName: any;
  resData: any;
  uploadedFile: any = [];
  fileListView: boolean = true;
  fileGridView: boolean = false;
  image: any;
  ParentID: any;
  breadcrumb: any = [];
  breadcrumbfiles: any = [];
  filesCount: any;
  fileid: any = [];
  folderTitle: any;
  openMenu: boolean = false;
  listener: () => void;
  errorFolder: string;
  breadcrumbfileslist: any = [];
  productName = environment.productname;
  isMobile: boolean = false;

  constructor(
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    private toastr: ToastrService,
    private popoverController: PopoverController,
    private navParams: NavParams,
    private renderer: Renderer2,
    private localService: LocalService
  ) {
    this.fileid = this.navParams.data["fileid"];
    this.ParentID = this.navParams.data["parentId"];

    this.OnshowAllFolders(this.ParentID);
  }

  ngOnInit() {
    if(window.screen.width <= 912){
      this.isMobile = true;
    }
  }

  OnopenMenu() {
    this.openMenu ? this.handleClose() : this.handleOpen();
  }

  handleOpen() {
    this.openMenu = true;
    this.addListener();
  }

  handleClose() {
    this.openMenu = false;
    this.newFolder = false;
    this.errorFolder = "";
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

  fileListViewShow() {
    this.fileListView = true;
    this.fileGridView = false;
    this.openMenu = false;
    this.newFolder = false;
    this.errorFolder = "";
  }
  fileGridViewShow() {
    this.fileGridView = true;
    this.fileListView = false;
    this.openMenu = false;
    this.newFolder = false;
    this.errorFolder = "";
  }

  createNewFile() {
    this.newFolder = true;
  }

  OncreateFolder($event) {
    this.newFolderName = $event.target.value;
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
          if (data.responseCode === 201) {
            this.toastr.success("Folder Created Successfully");
            this.OnshowAllFolders(this.ParentID);
            this.openMenu = false;
            this.newFolderName = "";
            this.errorFolder = "";
          } else if (data.responseCode === 406) {
            this.toastr.error(data["message"]);
            this.openMenu = false;
            this.newFolderName = "";
          }
        },
        (error) => {
          this.newFolderName = "";
          this.ngxService.stop();
          this.openMenu = false;
          if (error.status === 400) {
            this.errorFolder = "Please Enter New Folder Name";
            this.openMenu = true;
            this.newFolder = true;
          }
        }
      );
  }

  onFocusInNewFolder() {
    this.errorFolder = "";
  }

  OnshowAllFolders(ParentID) {
    //this.ngxService.start();
    let id: any = this.fileid;
    if (id.length > 0) {
      this.fileid = id;
    } else {
      this.fileid = [id];
    }
    let folderData = {
      exceptionalIds: this.fileid,
      parentId: ParentID,
    };
    this.filesService.getFolders(folderData).subscribe((result: any) => {
      this.ngxService.stop();
      this.uploadedFile = result.childern;
      this.filesCount = result.count;
      for (let i = 0; i < this.uploadedFile.length; i++) {
        this.uploadedFile[i].icon =
          "data:image/png;base64," + this.uploadedFile[i].icon;
        this.uploadedFile[i].modifiedAt = moment(
          this.uploadedFile[i].modifiedAt
        ).fromNow();
        let size = this.getReadableFileSizeString(this.uploadedFile[i].size);
        this.uploadedFile[i].size = size;
      }
      if (result.status === 500) {
        this.ngxService.stop();
      }
    });
  }

  getReadableFileSizeString(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  OnopenFile(id, mimeType, title, versionId) {
    this.folderTitle = "to" + " " + title;
    this.breadcrumbfileslist.push(id);
    if (id && mimeType === "httpd/unix-directory") {
      this.ParentID = id;
      this.OnshowAllFolders(id);
      this.breadcrumb = {
        title: title,
        id: id,
      };
      this.breadcrumbfiles.push(this.breadcrumb);
      this.openMenu = false;
      this.newFolder = false;
      this.errorFolder = "";
    }
  }

  Onbackbreadcrumb(id, title) {
    this.folderTitle = "to" + " " + title;
    let index = this.breadcrumbfileslist.findIndex((x) => x === id);
    this.breadcrumbfileslist.splice(index + 1);
    this.breadcrumbfileslist.length = index + 1;
    if (id) {
      this.breadcrumbfiles.length = index + 1;
      this.OnshowAllFolders(id);
      this.ParentID = id;
    }
  }

  OnhomeFiles() {
    this.OnshowAllFolders(this.localService.getJsonValue(localData.parentId));
    this.ParentID = this.localService.getJsonValue(localData.parentId);
    this.folderTitle = "";
    this.breadcrumbfiles = [];
    this.breadcrumbfileslist = [];
    this.openMenu = false;
    this.newFolder = false;
    this.errorFolder = "";
  }

  OnMovenCopy(value) {
    //this.ngxService.start();
    let id = this.fileid;
    if (id.length > 0) {
      this.fileid = id;
    } else {
      this.fileid = [id];
    }
    let moveData = {
      keepcopy: value,
      sourceFileId: this.fileid,
      targetFileId: this.ParentID,
    };
    this.filesService.OnMovenCopy(moveData).subscribe(
      (result: any) => {
        this.ngxService.stop();
        if (result.code === 200) {
          if (result.conflict.length > 0) {
            this.toastr.success(result.conflict + " " + "is conflicted");
          } else {
            this.toastr.success(result.message);
          }
          this.popoverController.dismiss(this.ParentID, this.breadcrumbfiles);
        } else if (result.code === 208) {
          this.toastr.error(result.message);
          this.popoverController.dismiss();
        } else if (result.code === 204) {
          this.toastr.success(result.message);
          this.popoverController.dismiss();
        }
      },
      (error) => {
        this.ngxService.stop();
        this.popoverController.dismiss();
      }
    );
  }

  closepopup() {
    setTimeout(() => {
      this.folderTitle = "";
      this.popoverController.dismiss();
    }, 500);
  }
}
