import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";
import { FilesService } from "src/app/service/files.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-text-editor",
  templateUrl: "./text-editor.component.html",
  styleUrls: ["./text-editor.component.scss"],
})
export class TextEditorComponent implements OnInit {
  fileTitle: any;
  fileid: number;
  changed: any;
  sharedType: any;
  passwordData: any;
  token: any;
  parentId: any;
  filesType: any;
  permission: any;
  sharedFileId: any;
  SharedFileID: any;

  constructor(
    private filesService: FilesService,
    private navParams: NavParams,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private toastr: ToastrService,

    private popoverController: PopoverController
  ) {}

  private text;
  textEditor: any = "";

  ngOnInit() {
    this.fileid = this.navParams.data["fileid"];
    this.fileTitle = this.navParams.data["fileTitle"];
    this.sharedType = this.navParams.data["sharedType"];
    this.passwordData = this.navParams.data["password"];
    this.token = this.navParams.data["token"];
    this.parentId = this.navParams.data["parentId"];
    this.filesType = this.navParams.data["filesType"];
    this.permission = this.navParams.data["permission"];
    this.sharedFileId = this.navParams.data["sharedFileId"];

    if (!this.token) {
      this.getbase64();
    } else if (this.token) {
      this.OnOpenDoc();
    }
  }

  getbase64() {
    //this.ngxService.start();

    this.filesService
      .getBase64ofFile(
        this.fileid,
        this.sharedType,
        this.parentId,
        this.filesType,
        this.sharedFileId
      )
      .subscribe((data) => {
        if (this.commonService.base64regex.test(data.src) == true) {
          this.text = new Buffer(data["src"], "base64");
          this.textEditor = this.text.toString();
        } else {
          this.textEditor = data.src;
          fetch(data.src)
            .then((file) => file.text())
            .then((text) => (this.textEditor = text));
        }
        this.ngxService.stop();
      });
  }

  edited(isedited) {
    let thistext = isedited.target.value;
    this.changed = thistext === this.text.toString() ? "" : "(edited)";
  }

  getdata() {
    const encodedData = window.btoa(this.textEditor);
    let data = {
      content: encodedData,
      fileName: this.fileTitle,
      id: this.fileid,
      newFile: false,
    };
    let isShared =
      this.permission == "undefined" || this.permission == null ? false : true;
    this.commonService.saveTextFile(data, isShared).subscribe((result: any) => {
      if (result.code === 200) {
        this.toastr.success("Successfully Updated");
        this.changed = "";
        setTimeout(() => {
          this.popoverController.dismiss(result);
        }, 500);
      }
      this.ngxService.stop();
    });
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  //Open Documents
  OnOpenDoc() {
    //this.ngxService.start();
    let previewData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService.OpenDocument(previewData,this.parentId, this.filesType, this.sharedFileId).subscribe(
      (data: any) => {
        if (this.commonService.base64regex.test(data.src) == true) {
          this.text = new Buffer(data["src"], "base64");
          this.textEditor = this.text.toString();
        } else {
          this.textEditor = data.src;
          fetch(data.src)
            .then((file) => file.text())
            .then((text) => (this.textEditor = text));
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }
}
