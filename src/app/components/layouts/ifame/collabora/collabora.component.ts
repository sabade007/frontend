import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { FilesService } from "src/app/service/files.service";
import { environment } from "src/environments/environment.prod";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const collaboraUrl = environment.collaboraUrl;
const API_URL = environment.apiUrl;
@Component({
  selector: "app-collabora",
  templateUrl: "./collabora.component.html",
  styleUrls: ["./collabora.component.scss"],
})
export class CollaboraComponent implements OnInit, AfterViewInit {
  safeURL: any;
  fileid: any;
  fileTitle: any;
  isShared: any;
  publicShared: any;
  token =this.localService.getJsonValue(localData.token);
  btn = "";
  password = "";
  action: any;
  @ViewChild("editor") myForm: ElementRef;
  pubFolder: string;
  sharedFileID: any;
  versionId: any;

  constructor(
    private navParams: NavParams,
    private commonService: CommonService,
    private filesService: FilesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private localService: LocalService,
    private popoverController: PopoverController
  ) {
    console.log("collabora");
  }

  ngOnInit() {
    this.fileid = this.navParams.data["fileid"];
    this.fileTitle = this.navParams.data["fileTitle"];
    this.isShared = this.navParams.data["isShared"];
    this.publicShared = this.navParams.data["publicShared"];
    this.password = this.navParams.data["password"];
    this.sharedFileID = this.navParams.data["sharedFileID"];
    this.versionId = this.navParams.data["versionId"];

    if (this.publicShared) {
      this.token = this.password;
    }

    console.log("this.sharedFileI ", this.sharedFileID);
    console.log("this.fileid", this.fileid);
    console.log("this.versionId");
    console.log();
    console.log();
    if (this.sharedFileID === this.fileid || this.sharedFileID === undefined) {
      this.action = collaboraUrl + API_URL + "wopi/files/" + this.versionId;
    } else {
      this.action =
        collaboraUrl +
        API_URL +
        "wopi/files/folder/" +
        this.sharedFileID +
        "/file/" +
        this.versionId;
    }

    if (this.isShared) {
      this.token = this.password + ";" + this.token;
    }
    this.pubFolder = "pubFolder";

    // this.action = collaboraUrl + API_URL + "wopi/files/" + this.fileid;
    // this.action = collaboraUrl + API_URL + "wopi/files/folder/6564/file/6831";

    // this.safeURL =
    //   collaboraUrl +
    //   "?" +
    //   "WOPISrc=" +
    //   API_URL +
    //   "wopi/files/" +
    //   this.fileid +
    //   "/" +
    //   this.token +
    //   "/" +
    //   this.isShared;
    // console.log(this.safeURL);
  }

  closepopup() {
    this.popoverController.dismiss();
  }

  ngAfterViewInit() {
    this.myForm.nativeElement.submit();
  }
}
