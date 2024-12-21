import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, PopoverController, ToastController } from '@ionic/angular';
import { FilesService } from 'src/app/service/files.service';
import * as moment from "moment";
import { DeleteFileVersionComponent } from '../delete-file-version/delete-file-version.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { localData, mimetypes } from "src/environments/mimetypes";
import { ToastrService } from 'ngx-toastr';
import { saveAs } from "file-saver";
import { environment } from 'src/environments/environment.prod';
import { MakeCurrentVersionComponent } from '../make-current-version/make-current-version.component';
import { Upload } from 'tus-js-client';
import { DuplicateFilesComponent } from '../duplicate-files/duplicate-files.component';
import { CommonService } from 'src/app/service/common.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { LocalService } from 'src/environments/local.service';

@Component({
  selector: 'app-manage-versions',
  templateUrl: './manage-versions.component.html',
  styleUrls: ['./manage-versions.component.scss'],
})
export class ManageVersionsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  popover: any;
  fileid : any;
  fileName: any;
  mimeType: any;
  filesCount: any;
  fileVersions : any = [];
  page: number = 1;
  pageSize: number = 30;
  pageEvent: PageEvent;
  mimes = mimetypes;
  fileicon: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fileStatus = { status: "", requestType: "", percent: 0 };
  filenames: string[] = [];
  productName = environment.productname;
  uploadFileSize : any;
  uploadFileSize1: any;
  uploadFileCount : any;
  uploadProgress = 0;
  overwrite: string = "null";
  API_URL = environment.apiUrl;
  AuthorizartionToken =this.localService.getJsonValue(localData.token)
  errormsg: any;
  multiUploadedFiles: any = [];
  index = 0;
  uploadLoader: boolean = false;
  UploadProgress: boolean = false;
  Uploadcompleted: boolean = false;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  headercancelUpload: boolean = false;
  versionId: any;
  // page1: number = 1;
  // pageSize1:number = 20;
  fileVersion: any = [];

  constructor(private popoverController: PopoverController,
              private filesService: FilesService,
              private navParams: NavParams,
              private toastr: ToastrService,
              public toastCtrl: ToastController,
              private localService: LocalService,
              private commonService: CommonService,) { }

  ngOnInit() {
    this.fileid = this.navParams.data["fileid"];
    this.versionId = this.navParams.data["versionId"];
    this.mimeType = this.navParams.data["mimeType"];
    this.getFileVersions();
    this.getDashboardInfo();
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getFileVersions();
  }

  getDashboardInfo() {
    this.commonService.getDashboardInfos().subscribe((result: any) => {
      this.uploadFileCount = result.limit; 
      this.uploadFileSize = result.maxFileSize;
      this.uploadFileSize1 = this.getReadableFileSizeString(this.uploadFileSize);
    });
  }


  getFileVersions(clearList=false){
    if (clearList){
      this.fileVersions = [];
    }
    let data = {
      versionId: this.versionId,
      sortBy: "modifiedAt",
      asc: false,
      pageNb: this.page,
      step: this.pageSize
    }
    this.filesService.getFileVersions(data).subscribe((result: any) => {
      // this.fileVersions = result.fileVersions;
      if(this.page == 1)
          this.fileVersions = []
      this.fileVersions = this.fileVersions.concat(result.fileVersions);
      this.filesCount = result.totalFiles;
      this.fileVersions.forEach(file => {
        file.modifiedAtRead = moment(
          file.modifiedAt).format("DD MMM YYYY hh:mm A");
        let size = this.getReadableFileSizeString(file.size);
        file.sizeRead = size;
        let mimeType = file.mimeType;
        if (!mimetypes[mimeType]) {
          file.mimeType = "UNKNOWN";
        }
      })
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

  async trashFile(fileId){
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: fileId,
      },
      backdropDismiss: false,
      component: DeleteFileVersionComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.fileVersions = [];
      this.getFileVersions();
    });
  }

  OnDownload(fileId){
    let data = {
      fileId: [fileId]   
    }
    this.filesService.downloadfileVersion(data).subscribe((result: any) => {
      this.resportProgress(result);
    });
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

  uploadnewVersion(event){
    console.log("----", event)
    if (event.target.files.length <= this.uploadFileCount) {
      this.multiUploadedFiles = [];
      this.multiUploadedFiles = event.target.files;
      console.log("upload file", event.target.files)
      this.OnchunkUpload(this.multiUploadedFiles[this.index],this.fileid);
    } else if (event.target.files.size > this.uploadFileSize) {
      this.toastr.error("One of the file size is more than " + this.uploadFileSize1);
    }
    event.target.value = "";
  }

  OnchunkUpload(item, parentId) {
    if (
      !item.startupload &&
      item.size <= this.uploadFileSize &&
      item.size > 0
    ) {
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

      const upload = new Upload(item, {
        endpoint: `${this.API_URL}file/upload?version=true&parentId=${this.fileid}&overwrite=${this.overwrite}`,
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

          const toast = await this.toastCtrl.create({
            message: "Upload failed: " + error,
            duration: 3000,
            position: "top",
          });
          this.errormsg = error.toString().includes("File Already Exist")
            ? "File Already Exist"
            : "Something";

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
                  if (this.index < this.multiUploadedFiles.length) {
                    this.OnchunkUpload(
                      this.multiUploadedFiles[this.index],
                      this.fileid
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
          //this.changeDetectionRef.detectChanges();
        },
        onSuccess: async () => {
          // if (item.size > 9771209) {
          this.commonService.storeStorageinfo(true);
          // console.log("inside if")
          // }
          this.uploadProgress = 100;
          this.uploadLoader = true;
          this.fileVersions = [];
          this.getFileVersions(true);
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
          // if (this.index == this.multiUploadedFiles.length) {
          //   this.createFolders();
          //   this.index = 0;
          //   return;
          // }
          // this.OnchunkUpload(
          //   this.multiUploadedFiles[this.index++],
          //   this.fileid
          // );
          // this.multiUploadedFiles = [];
        },
      });

      this.overwrite = "null";
      upload.start();
    } else if (item.size > this.uploadFileSize) {
      this.toastr.warning(+
        "File which is more than " + this.uploadFileSize1 + " cannot upload",
        item.name,
        { timeOut: 3000 }
      );
      if (this.index == this.multiUploadedFiles.length) {
        this.index = 0;
        return;
      }
      this.OnchunkUpload(this.multiUploadedFiles[this.index], this.fileid);
    }
  }

  async makeCurrentVersion(id){
    this.popover = await this.popoverController.create({
      componentProps: {
        fileid: id,
      },
      backdropDismiss: false,
      component: MakeCurrentVersionComponent,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.fileVersions = [];
      this.getFileVersions();
    });
  }
}
