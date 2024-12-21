import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-delete-public-link',
  templateUrl: './delete-public-link.component.html',
  styleUrls: ['./delete-public-link.component.scss'],
})
export class DeletePublicLinkComponent implements OnInit {

  fileid: any;

  constructor(private popoverController: PopoverController,
              private commonService: CommonService,
              private navParams: NavParams,
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.fileid = this.navParams.data["id"];
  }

  deleteLink(){
    this.commonService.deletePublicLinks(this.fileid).subscribe((result: any) => {
      this.toastr.success(result.value);
      var data = {
        closePopup : true
      }
      setTimeout(() => {
        this.popoverController.dismiss(data);
      }, 500);
    });
  }

  closepopup(){
    var data = {
      closePopup : false
    }
    setTimeout(() => {
      this.popoverController.dismiss(data);
    }, 500);
  }

}
