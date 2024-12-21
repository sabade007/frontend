import { Component, OnInit, Renderer2 } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { CreateWorkspaceComponent } from '../modalpage/create-workspace/create-workspace.component';
import { DeleteWorkSpaceComponent } from '../modalpage/delete-work-space/delete-work-space.component';
import { EditWorkspaceComponent } from '../modalpage/edit-workspace/edit-workspace.component';
import { WorkSpaceInfoComponent } from '../modalpage/work-space-info/work-space-info.component';
import * as moment from "moment";
import { localData, mimetypes } from 'src/environments/mimetypes';
import { environment } from 'src/environments/environment.prod';
import { Upload } from 'tus-js-client';
import { DuplicateFilesComponent } from '../modalpage/duplicate-files/duplicate-files.component';
import { ImportfilesWorkSpaceComponent } from '../modalpage/importfiles-work-space/importfiles-work-space.component';
import { LocalService } from 'src/environments/local.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {

  popover: any;
  pageSize: number = 10;
  page: number = 1;
  workSpaceList: any = [];
  userName: any;
  workSpaceOwner: any;
  workSpaceName: any;
  workSpaceCount: any; 
  createdType: any;
  yourWorkSpace: boolean = true;
  sharedWorkspace: boolean = false;
  searchValue: any;
  showWorkSpaceFiles: boolean = false;
  workSpaceFiles: any = [];
  workSpaceFilesCount: any;
  mimes = mimetypes;
  breadcrumbfiles: any = [];
  breadcrumbfileslist: any = [];
  openWorkspaceName: any;
  fileListView: boolean = true;
  fileGridView: boolean = false;
  openMenu: boolean = false;
  listener: () => void;
  errorFolder: string;
  newFolder: boolean = false;
  newFolderName: any;
  uploadFileSize = environment.maxFileSize;
  uploadFileCount = sessionStorage.getItem("uploadFileCount")
  multiUploadedFiles: any = [];
  openedWorkSpaceId: any;
  reNameFile: boolean = true;
  onFocusInput: boolean = false;
  reNameDoc: any;
  reNameId: any;
  reName: any;
  strname: any;
  extenstion: any;
  renameMimeType: any;
  name: any;
  workspaceParentId: any;
  uploadProgress = 0;
  overwrite: string = "null";
  API_URL = environment.apiUrl;
  AuthorizartionToken =this.localService.getJsonValue(localData.token)
  errormsg: any;
  index = 0;
  uploadLoader: boolean = false;
  UploadProgress: boolean = false;
  Uploadcompleted: boolean = false;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  headercancelUpload: boolean = false;
  workSpace: boolean = true;
  pageEvent: PageEvent;
  lastPageEvent: boolean = false;
  HighlightRow: number;
  productName = environment.productname;


  mouseUp() {
    if (this.onFocusInput == false) {
      this.reNameFile = true;
    }
  }

  constructor(private popoverController: PopoverController,
              private router: Router,
              private commonService: CommonService,
              private NgxService: NgxUiLoaderService,
              private toastr: ToastrService,
              private renderer: Renderer2,
              private localService: LocalService,
              public toastCtrl: ToastController) { }

  ngOnInit() {
    this.ShowWorkSpace();
    this.userName =this.localService.getJsonValue(localData.username)
  }

  onFocusInEvent(event: any) {
    this.onFocusInput = true;
    if (this.onFocusInput == true) {
      this.reNameFile = false;
      // this.multicheckSelect = false;
    }
  }

  async createWorkSpace(){
    this.popover = await this.popoverController.create({
      component: CreateWorkspaceComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.ShowWorkSpace();
    });
  }

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
  }

  onPageChange(event: PageEvent) {
    this.lastPageEvent = true;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.ShowWorkSpace();
  }

  ShowWorkSpace(){
    this.commonService.showWorkSpace(this.page, this.pageSize, this.workSpace).subscribe(
      (data: any) => {
        this.workSpaceCount = data.count;
        this.workSpaceList = data.workSpace;     
      },
    );
  }

  OnCreatedOrder(val){
    if(val == 'you'){
      this.createdType = 'you'
      this.workSpace = true;
      this.yourWorkSpace = true;
      this.sharedWorkspace = false;
      this.ShowWorkSpace();
    }
    else{
      this.createdType = 'others'
      this.workSpace = false;
      this.sharedWorkspace = true;
      this.yourWorkSpace = false;
      this.ShowWorkSpace();
    }
  }

  OnSearchValue(value){
    this.commonService.searchWorkSpace(this.page, this.pageSize, value, this.workSpace).subscribe(
      (data: any) => {
        this.workSpaceList = data.workSpace;
        this.NgxService.stop();
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  OncancelSearch() {
    this.ShowWorkSpace();
  }

  async onView(id){
    this.popover = await this.popoverController.create({
      componentProps: {
        workSpaceId: id
      },
      component: WorkSpaceInfoComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.ShowWorkSpace();
    });
  }

  async onDelete(id){
    this.popover = await this.popoverController.create({
      componentProps: {
        workSpaceId: id
      },
      component: DeleteWorkSpaceComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.workSpaceList = [];
      this.ShowWorkSpace();
    });
  }

  async onEdit(id){
    this.popover = await this.popoverController.create({
      componentProps: {
        workSpaceId: id
      },
      component: EditWorkspaceComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.ShowWorkSpace();
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

  fileListViewShow() {
    this.fileListView = true;
    this.fileGridView = false;
    this.openMenu = false;
  }
  fileGridViewShow() {
    this.fileGridView = true;
    this.fileListView = false;
    this.openMenu = false;
  }

  onOpenWorkSpace(id, name, parentId){
    this.commonService.workSpaceFiles(id, this.page, this.pageSize).subscribe(
      (data: any) => {
      this.showWorkSpaceFiles = true;
      this.openedWorkSpaceId = id;
      this.openWorkspaceName = name;
      this.workSpaceFiles = data.files;
      this.workspaceParentId = parentId;
      this.workSpaceFilesCount = data.totalFiles;
      for (let i = 0; i < this.workSpaceFiles.length; i++) {
        if (this.commonService.base64regex.test(this.workSpaceFiles[i].icon) == true) {
          this.workSpaceFiles[i].icon ="data:image/png;base64," +this.workSpaceFiles[i].icon;
        }
        this.workSpaceFiles[i].modifiedAt = moment(this.workSpaceFiles[i].modifiedAt).fromNow();
        let size = this.getReadableFileSizeString(
        this.workSpaceFiles[i].size);
        this.workSpaceFiles[i].size = size;
        let mimeType = this.workSpaceFiles[i].mimeType;
        if (!mimetypes[mimeType]){
          this.workSpaceFiles[i].mimeType = "UNKNOWN";
        }
        // this.workSpaceFiles[i].shareWith = this.workSpaceFiles[i].shareWith.filter((item) => item);
      }
    });
  }

  OnhomeFiles(){
    this.showWorkSpaceFiles = false;
    this.ShowWorkSpace();
    this.openMenu = false;
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

  OncreateFolder($event) {
    this.newFolderName = $event.target.value;
  }

  createNewFile() {
    this.newFolder = true;
  }

  onFocusInNewFolder() {
    this.errorFolder = "";
  }

  uploadFile(event){
    if (event.target.files.length <= this.uploadFileCount) {
      this.multiUploadedFiles = [];
      this.multiUploadedFiles = event.target.files;
      console.log("upload file", event.target.files)
      this.OnchunkUpload(this.multiUploadedFiles[this.index],this.workspaceParentId);
    } else if (event.target.files.size > this.uploadFileSize) {
      this.toastr.error("One of the file size is more than 100 MB");
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
      this.openMenu = false;
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
        endpoint: `${this.API_URL}file/upload?version=false&workSpace=${this.openedWorkSpaceId}&parentId=${this.workspaceParentId}&overwrite=${this.overwrite}`,
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
                      this.workspaceParentId
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
          this.onOpenWorkSpace(this.openedWorkSpaceId, this.openWorkspaceName, this.workspaceParentId);
          item.percentDone = this.uploadProgress;
          item.Uploadcompleted = true;
          this.headerUploadProgress = false;
          this.headerUploadcompleted = true;
          this.openMenu = false;
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
      this.OnchunkUpload(this.multiUploadedFiles[this.index], this.workspaceParentId);
    }
  }

  OnNewFolder() {
    if(this.newFolderName == '' || this.newFolderName == null){
      this.toastr.error("Please enter the folder name")
    }
    else{
      let  data = {
        parentId: this.workspaceParentId,
        folderName: this.newFolderName,
        workSpaceId: this.openedWorkSpaceId
      }
      this.commonService.createWorkSpaceFolder(data).subscribe((data) => {
        this.newFolder = false;
        if (data.statusCodeValue === 201) {
          this.toastr.success(data.body.message);
          this.onOpenWorkSpace(this.openedWorkSpaceId, this.openWorkspaceName, this.workspaceParentId);
          this.openMenu = false;
          this.newFolderName = "";
          this.errorFolder = "";
        } 
        else if (data.responseCode === 403) {
          this.toastr.error(data.message);
          this.openMenu = false;
          this.newFolderName = "";
          }
      },
      (error) => {
        this.newFolderName = "";
        this.openMenu = false;
        if (error.status === 400) {
          this.errorFolder = "Please Enter New Folder Name";
          this.openMenu = true;
          this.newFolder = true;
        }
      });
    }
  }

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
    if (this.reName === this.reNameDoc || this.reName == " ") {
      this.reNameFile = true;
    } else {
      let data ={
        workSpaceId: this.openedWorkSpaceId,
        fileId: id,
        newName: this.name
      }
      this.commonService.renameFileWorkSpace(data).subscribe(
        (data) => {
          if (data.code == 200) {
            this.reNameFile = true;
            this.onOpenWorkSpace(this.openedWorkSpaceId, this.openWorkspaceName, this.workspaceParentId);
            this.toastr.success("File Renamed Successfully");
          } else if (data.code == 304) {
            this.reNameFile = true;
            this.onOpenWorkSpace(this.openedWorkSpaceId, this.openWorkspaceName, this.workspaceParentId);
            this.toastr.error(data.message);
          }
          this.reName = "";
          this.onFocusInput = false;
        },
        (error) => {
          this.reNameFile = true;
        }
      );
    }
  }

  async importFile(){
    this.popover = await this.popoverController.create({
      componentProps: {
        workSpaceId: this.openedWorkSpaceId
      },
      component: ImportfilesWorkSpaceComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.ShowWorkSpace();
    });
  }

}
