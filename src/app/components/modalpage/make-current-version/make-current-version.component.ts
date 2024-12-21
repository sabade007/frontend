import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { FilesService } from 'src/app/service/files.service';

@Component({
  selector: 'app-make-current-version',
  templateUrl: './make-current-version.component.html',
  styleUrls: ['./make-current-version.component.scss'],
})
export class MakeCurrentVersionComponent implements OnInit {

  fileid: any;
  clicked = false;

  constructor(private popoverController: PopoverController,
              private filesService: FilesService,
              private navParams: NavParams,
              private toastr: ToastrService,) { }

ngOnInit() {
  this.fileid = this.navParams.data["fileid"];
}

  makeCurrentVersion(){
   this.filesService.makeCurrentVersion(this.fileid).subscribe((result: any) => {
      if(result.code == 200){
        this.toastr.success(result.message);
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
