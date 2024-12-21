import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { FilesService } from "src/app/service/files.service";
import { environment } from "src/environments/environment.prod";
//taiga

import { ChangeDetectionStrategy} from '@angular/core';
import{ Inject, TemplateRef} from '@angular/core';
// import {changeDetection} from '@demo/emulate/change-detection';
// import {encapsulation} from '@demo/emulate/encapsulation';
import {PreviewDialogService} from '@taiga-ui/addon-preview';
import {TuiDialogContext} from '@taiga-ui/core';
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit {
  fileTitle: any;
  fileid: number;
  url: any;
  sharedType: any;
  isShared: boolean;
  parentId: any;
  passwordData: any;
  token: any;
  filesType: any;
  minio: any = "not minio";
  SharedFileID: any;

  constructor(
    private navParams: NavParams,
    private commonService: CommonService,
    private filesService: FilesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private localService: LocalService,
    private popoverController: PopoverController,
    @Inject(PreviewDialogService)
      private readonly previewDialogService: PreviewDialogService,
  ) {}

  ngOnInit() {
    this.fileid = this.navParams.data["fileid"];
    this.fileTitle = this.navParams.data["fileTitle"];
    this.sharedType = this.navParams.data["sharedType"];
    this.parentId = this.navParams.data["parentId"];
    this.filesType = this.navParams.data["filesType"];
    this.passwordData = this.navParams.data["password"];
    this.token = this.navParams.data["token"];
    if (!this.token) {
      this.viewVideo();
    } else if (this.token) {
      this.viewSharedVideo();
    }
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }


  @ViewChild('preview')
  readonly preview?: TemplateRef<TuiDialogContext<void>>;

  
  show() {
    console.log('show');
      this.previewDialogService.open(this.preview || '').subscribe({   complete: () => console.info('complete'),
    });
      console.log('show2')
  }

  viewVideo() {
    if (this.sharedType == "files" || this.sharedType == "self") {
      this.url =
        environment.apiUrl +
        "video/playVideo/" +
        this.fileid +
        "?isShared=false&token=" +
       this.localService.getJsonValue(localData.token)



    } else if (this.sharedType == "others" && this.filesType == "") {
      this.url =
        environment.apiUrl +
        "video/playVideo/" +
        this.fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token)
    } else if (
      this.filesType == "insideFolder" &&
      this.sharedType == "others"
    ) {
      this.url =
        environment.apiUrl +
        "video/playSharedWithMeFiles/" +
        this.fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token) +
        "&folderId=" +
        this.parentId;
    }
    let data;
    if (this.sharedType == "files" || this.sharedType == "self") {
      data =
        this.fileid + "?isShared=false&token=" +this.localService.getJsonValue(localData.token)
    } else if (this.sharedType == "others" && this.filesType == "") {
      data =
        this.fileid + "?isShared=true&token=" +this.localService.getJsonValue(localData.token)
    } else if (
      this.filesType == "insideFolder" &&
      this.sharedType == "others"
    ) {
      data =
        this.fileid +
        "?isShared=true&token=" +
       this.localService.getJsonValue(localData.token)+
        "&folderId=" +
        this.parentId;
    }
    this.filesService.viewVideo(data).subscribe((result: any) => {

      this.url = result.value;
      
      this.minio = result.object;
    });
  }
  //Open video
  viewSharedVideo() {
    //this.ngxService.start();

    let previewData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService.OpenDocument(previewData,this.parentId, this.filesType, this.SharedFileID).subscribe((data: any) => {
      this.url = data.src;
      console.log(this.url);
      if (this.url.startsWith("http")) {
        this.minio = "minio/resource";
      }
      this.ngxService.stop();
      (error) => {
        this.ngxService.stop();
      };
    });
  }
  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }
}
