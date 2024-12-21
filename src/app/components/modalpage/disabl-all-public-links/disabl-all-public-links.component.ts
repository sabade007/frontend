import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-disabl-all-public-links',
  templateUrl: './disabl-all-public-links.component.html',
  styleUrls: ['./disabl-all-public-links.component.scss'],
})
export class DisablAllPublicLinksComponent implements OnInit {

  fileid: any;

  constructor(private popoverController: PopoverController,
              private commonService: CommonService,
              private navParams: NavParams,
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.fileid = this.navParams.data["fileId"];
  }

  deleteLink(){
    this.commonService.disableAllPublicLinks(this.fileid).subscribe((result: any) => {
      this.toastr.success(result.value);
      this.closepopup();
    });
  }

  closepopup(){
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
