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
  selector: 'app-full-screen-popup',
  templateUrl: './full-screen-popup.component.html',
  styleUrls: ['./full-screen-popup.component.scss'],
})
export class FullScreenPopupComponent implements OnInit {
  safeURL: any;
  fileid: any;
  fileTitle: any;
  isShared: any;
  publicShared: any;
  token =this.localService.getJsonValue(localData.token)
  btn = "";
  password = "";
  action: any;
  @ViewChild("editor") myForm: ElementRef;

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
    console.log("filetitle collabra", this.fileTitle)
    this.fileTitle = this.navParams.data["fileTitle"];
    this.isShared = this.navParams.data["isShared"];
    this.publicShared = this.navParams.data["publicShared"];
    this.password = this.navParams.data["password"];
    if (this.publicShared) {
      this.token = this.password;
    }

    if (this.isShared) {
      this.token = this.password + ";" + this.token;
    }

    this.action = collaboraUrl + API_URL + "wopi/files/" + this.fileid;
    console.log(this.action);

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
  // closepopup() {
  //   setTimeout(() => {
  //     this.popoverController.dismiss();
  //   }, 500);
  // }

  closepopup() {
    this.popoverController.dismiss();
  }

  ngAfterViewInit() {
    this.myForm.nativeElement.submit();
  }

}
