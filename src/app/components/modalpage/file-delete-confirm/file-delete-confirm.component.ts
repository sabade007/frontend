import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavParams, PopoverController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FilesService } from 'src/app/service/files.service';


@Component({
  selector: 'app-file-delete-confirm',
  templateUrl: './file-delete-confirm.component.html',
  styleUrls: ['./file-delete-confirm.component.scss'],
})
export class FileDeleteConfirmComponent implements OnInit {
  fileid: any;
  type: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private navParams: NavParams,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private filesService: FilesService, ) { }

  ngOnInit() {
    this.fileid = this.navParams.data['id'];
    this.type = this.navParams.data['type'];
  }
  
  deleteFile(fileid){
    setTimeout(() => {
      this.popoverController.dismiss(fileid);
    }, 500);
  }  

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
