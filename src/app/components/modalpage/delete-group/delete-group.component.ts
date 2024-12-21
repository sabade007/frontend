import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.scss'],
})
export class DeleteGroupComponent implements OnInit {

  groupId: any;

  constructor(private navParams: NavParams,
              private popoverController: PopoverController,
              private commonService: CommonService, 
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.groupId = this.navParams.data['groupId'];
  }
  
  deleteFile(){
    console.log("groupId: " + this.groupId);
    this.commonService.deleteGroup(this.groupId).subscribe((data: any) => {
      if (data["responseCode"] == 200) {
        this.toastr.success(data.message);
        setTimeout(() => {
          this.popoverController.dismiss();
        }, 500);
      }
    });
  }  

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
