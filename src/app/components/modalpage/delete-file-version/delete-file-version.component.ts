import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { FilesService } from 'src/app/service/files.service';

@Component({
  selector: 'app-delete-file-version',
  templateUrl: './delete-file-version.component.html',
  styleUrls: ['./delete-file-version.component.scss'],
})
export class DeleteFileVersionComponent implements OnInit {

  fileid: any;

  constructor(private popoverController: PopoverController,
              private filesService: FilesService,
              private navParams: NavParams,
              private toastr: ToastrService,) { }

ngOnInit() {
  this.fileid = this.navParams.data["fileid"];
}

  deletefileVersion(){
    this.filesService.deletefileVersion(this.fileid).subscribe((result: any) => {
     if(result.code == 200){
      this.toastr.success(result["message"]);
      this.closepopup();
     }
     else if(result.code == 204){
      this.toastr.error(result["message"]);
      this.closepopup();
     }
    });
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
