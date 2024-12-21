import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-delete-work-space',
  templateUrl: './delete-work-space.component.html',
  styleUrls: ['./delete-work-space.component.scss'],
})
export class DeleteWorkSpaceComponent implements OnInit {

  workSpaceId: any;

  constructor(private popoverController: PopoverController,
              private commonService: CommonService,
              private navParams: NavParams,
              private toastr: ToastrService,) { }

ngOnInit() {
  this.workSpaceId = this.navParams.data["workSpaceId"];
}

deleteWorkSpace(){
    this.commonService.deleteWorkSpace(this.workSpaceId).subscribe((result: any) => {
     if(result.responseCode == 200){
      this.toastr.success(result["message"]);
      this.closepopup();
     }
     else if(result.responseCode == 204){
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