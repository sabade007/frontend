import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "src/app/service/common.service";
import { FilesService } from "src/app/service/files.service";
import { timingSafeEqual } from "crypto";
//taiga
// import { TuiRootModule } from "@taiga-ui/core";
import {ChangeDetectionStrategy,Inject, TemplateRef, ViewChild} from '@angular/core';

import {PreviewDialogService} from '@taiga-ui/addon-preview';
import {clamp, TuiSwipe} from '@taiga-ui/cdk';
import {TuiDialogContext, TuiNotificationsService} from '@taiga-ui/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-photo-viewer",
  templateUrl: "./photo-viewer.component.html",
  styleUrls: ["./photo-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoViewerComponent implements OnInit {

  @ViewChild('preview')
  readonly preview?: TemplateRef<TuiDialogContext<void>>;

  @ViewChild('contentSample')
  readonly contentSample?: TemplateRef<{}>;

  index = 0;
  length ;
  base64file: any;
  fileTitle: any;
  fileid: number;
  uploadedPhoto: any = [];
  photo: string[];
  photosLength: any;
  sharedType: any;
  passwordData: any;
  token: any;
  parentId: any;
  filesType: any;
  photos: any = [];
  count: number = -1;
  page: any;
  previousBtn: boolean = false;
  nextBtn: boolean = false;
  // index: any;
  title: any = [];
  SharedFileId: any;
  SharedFileID: any;
  productName = environment.productname;

  constructor(
    private navParams: NavParams,
    private commonService: CommonService,
    private filesService: FilesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private readonly previewService: PreviewDialogService,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
  ) {}

  ngOnInit() {
    this.fileid = this.navParams.data["fileid"];
    console.log(this.fileid )
    this.fileTitle = this.navParams.data["fileTitle"];
    this.sharedType = this.navParams.data["sharedType"];
    this.passwordData = this.navParams.data["password"];
    this.token = this.navParams.data["token"];
    this.parentId = this.navParams.data["parentId"];
    this.filesType = this.navParams.data["filesType"];
    this.photos = this.navParams.data["photos"];
    this.page = this.navParams.data["page"];
    this.index = this.navParams.data["index"];
    this.SharedFileId = this.navParams.data["sharedFileId"];

    if (!this.token) {
      this.viewPhoto();
    } else if (this.token) {
      this.OnOpenDoc();
    }
  }

  viewPhoto() {
    //this.ngxService.start();


    let sharedFileId = -1;
    if (this.sharedType == "others") {
      sharedFileId = this.SharedFileId;
    }

    this.filesService
      .getBase64ofFile(
        this.fileid,
        this.sharedType,
        this.parentId,
        this.filesType,
        sharedFileId

      )
      .subscribe(
        (result: any) => {
          if (this.commonService.base64regex.test(result.src) == true) {
            this.uploadedPhoto = "data:image/png;base64," + result.src;
          } else {
            this.uploadedPhoto = result.src;
            console.log(this.uploadedPhoto)
          }
          if (this.sharedType == "files") {
            for (let i = 0; i < this.photos.length; i++) {
              this.title.push(this.photos[i].title);
            }
            // this.index = this.title.indexOf(result.title);
            if (this.index == this.photos.length - 1) {
              this.previousBtn = true;
              this.nextBtn = false;
            } else if (this.index == 0) {
              this.previousBtn = false;
              this.nextBtn = true;
            } else if (this.index < this.photos.length - 1) {
              this.previousBtn = true;
              this.nextBtn = true;
            }
          }

          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }

  getReadableFileSizeString(size: any) {
    throw new Error("Method not implemented.");
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  onNextImage() {
    this.index = this.index + 1;
    if (this.page == "photo") {
      if (
        this.commonService.base64regex.test(this.photos[this.index].src) == true
      ) {
        this.uploadedPhoto =
          "data:image/png;base64," + this.photos[this.index].src;
      } else {
        this.uploadedPhoto = this.photos[this.index].src;
      }
      this.previousBtn = true;
      if (this.index == this.photos.length - 1) {
        this.nextBtn = false;
      }
    } else if (this.page == "file" && this.index < this.photos.length) {
      this.fileid = this.photos[this.index].id;
      this.viewPhoto();
    }
  }
  get previewContent(): PolymorpheusContent {
    return  this.uploadedPhoto
}

show() {
console.log("show()")
    this.previewService.open(this.preview || '').subscribe({
        complete: () => console.info('complete')
    });
    console.log('show2()');
}

download() {
    this.notificationsService.show('Downloading...').subscribe();
    
}

delete() {
    this.notificationsService.show('Deleting...').subscribe();
}

onSwipe(swipe: TuiSwipe) {
    if (swipe.direction === 'left') {
        this.index = clamp(this.index + 1, 0, this.length - 1);
    }

    if (swipe.direction === 'right') {
        this.index = clamp(this.index - 1, 0, this.length - 1);
    }
}

  onPrevImage() {
    this.index = this.index - 1;
    if (this.page == "photo") {
      if (
        this.commonService.base64regex.test(this.photos[this.index].src) == true
      ) {
        this.uploadedPhoto =
          "data:image/png;base64," + this.photos[this.index].src;
      } else {
        this.uploadedPhoto = this.photos[this.index].src;
      }
      this.nextBtn = true;
      if (this.index == 0) {
        this.previousBtn = false;
      }
    } else if (this.page == "file" && this.index > -1) {
      this.fileid = this.photos[this.index].id;
      this.viewPhoto();
    }
  }

  //Open Documents in public share
  OnOpenDoc() {
    //this.ngxService.start();
    let previewData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService.OpenDocument(previewData,this.parentId, this.filesType, this.SharedFileID).subscribe(
      (result: any) => {
        if (this.commonService.base64regex.test(result.src) == true) {
          this.uploadedPhoto = "data:image/png;base64," + result.src;
        } else {
          this.uploadedPhoto = result.src;
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }
}
