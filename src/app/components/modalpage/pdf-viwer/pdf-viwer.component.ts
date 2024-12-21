import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { FilesService } from "src/app/service/files.service";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-pdf",
  templateUrl: "./pdf-viwer.component.html",
  styleUrls: ["./pdf-viwer.component.scss"],
})
export class PdfViwerComponent implements OnInit {
  base64file: any;
  fileTitle: any;
  fileid: number;
  sharedType: any;
  passwordData: any;
  token: any;
  parentId: any;
  filesType: any;
  pdfDataResult: any;
  sharedFileId:any;
  SharedFileID: any;

  constructor(
    private navParams: NavParams,
    private filesService: FilesService,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.fileid = this.navParams.data["fileid"];
    this.fileTitle = this.navParams.data["fileTitle"];
    this.sharedType = this.navParams.data["sharedType"];
    this.passwordData = this.navParams.data["password"];
    this.token = this.navParams.data["token"];
    this.parentId = this.navParams.data["parentId"];
    this.filesType = this.navParams.data["filesType"];
    this.sharedFileId = this.navParams.data["sharedFileId"];
    if (!this.token) {
      this.viewPdf();
    } else if (this.token) {
      this.OnOpenDoc();
    }
  }

  viewPdf() {
    //this.ngxService.start();
    this.filesService
      .getBase64ofFile(
        this.fileid,
        this.sharedType,
        this.parentId,
        this.filesType,
        this.sharedFileId, 
      )
      .subscribe((result: any) => {
        this.ngxService.stop();
        this.pdfDataResult = this.commonService.base64regex.test(result.src);
        if (this.commonService.base64regex.test(result.src) == true) {
          this.ngxService.stop();
          this.base64file = result.src;
        } else {
          let base64Pdf = result.src || "";
          this.ngxService.stop();
          this.base64file = base64Pdf;
        }
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
      (result: any) => {
        this.pdfDataResult = this.commonService.base64regex.test(result.src);
        if (this.commonService.base64regex.test(result.src) == true) {
          this.ngxService.stop();
          this.base64file = result.src;
        } else {
          let base64Pdf = result.src || "";
          this.ngxService.stop();
          this.base64file = base64Pdf;
        }
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }
}
