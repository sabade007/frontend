import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {

  fileTitle: any;
  fileid: number;
  url: any;
  sharedType: any;
  isShared: boolean;
  parentId: any;
  filesType: any;
  passwordData: any;
  token :any;
  minio:any ="not minio";
  SharedFileID: any;

  constructor(private navParams: NavParams,
    private commonService: CommonService,
    private filesService: FilesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private localService: LocalService) { }

  ngOnInit() {
    this.fileid =  this.navParams.data['fileid'];
    this.fileTitle =  this.navParams.data['fileTitle'];
    this.sharedType = this.navParams.data['sharedType'];
    this.parentId = this.navParams.data['parentId'];
    this.filesType = this.navParams.data['filesType'];
    this.passwordData = this.navParams.data["password"];
    this.token = this.navParams.data["token"];
    this.SharedFileID = this.navParams.data["sharedFileId"];
    if (!this.token) {

      this.viewAudio();
    } else if (this.token) {
      this.viewSharedAudio();
    } 
    // this.viewAudio();
  }


  viewAudio(){
    if(this.sharedType == 'files' || this.sharedType == 'self' || this.sharedType == 'bylink'){
      this.url = 'video/playVideo/' + this.fileid+'?isShared=false&token='+this.localService.getJsonValue(localData.token);
    }else if(this.sharedType == 'others' && this.filesType == ''){
      this.url = 'video/playVideo/' + this.fileid+'?isShared=true&token='+this.localService.getJsonValue(localData.token);
    }else if(this.filesType == 'insideFolder' && this.sharedType == 'others'){
      this.url = 'video/playSharedWithMeFiles/' + this.fileid+'?isShared=true&token='+this.localService.getJsonValue(localData.token)+'&folderId='+ this.SharedFileID;
    }
    // let data;
    // if(this.sharedType == 'files' || this.sharedType == 'self'){
    //   data = this.fileid+'?isShared=false&token='+this.localService.getJsonValue(localData.token)
    // }else if(this.sharedType == 'others' && this.filesType == ''){
    //   data = this.fileid+'?isShared=true&token='+this.localService.getJsonValue(localData.token);
    // }else if(this.filesType == 'insideFolder' && this.sharedType == 'others'){
    //   data = this.fileid+'?isShared=true&token='+this.localService.getJsonValue(localData.token)+'&folderId='+this.parentId;
    // }
    this.filesService.viewVideo(this.url).subscribe((result: any) => {
      this.url = result.value;
      this.minio = result.object;
    })
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }
  




  //Open video
    viewSharedAudio() {
    let previewData = {
      password: this.passwordData,
      token: this.token,
    };
    this.filesService.OpenDocument(previewData,this.parentId, this.filesType, this.SharedFileID).subscribe((data: any) => {
      this.url = data.src;
      if (this.url.startsWith("http")) {
        this.minio = "minio/resource";
      }
      this.ngxService.stop();
      (error) => {
        this.ngxService.stop();
      };
    });
  }

}
