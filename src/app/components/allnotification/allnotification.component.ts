import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

@Component({
  selector: "app-allnotification",
  templateUrl: "./allnotification.component.html",
  styleUrls: ["./allnotification.component.scss"],
})
export class AllnotificationComponent implements OnInit {
  allnotifications: any = [];
  dissmissNoti: any = [];
  allnotificationsLength: any;

  constructor(
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.getAllNotification();
  }

  subject: any;
  message: any;
  objectType: any;
  status: any;
  timestamp: any;

  ngOnInit() {
    // this.subject =  this.navParams.data['fileid'];
    // this.fileTitle =  this.navParams.data['fileTitle'];
    // this.sharedType = this.navParams.data['sharedType'];
    this.message = "Verify your Email to access our best quality features ! ";
    this.objectType = "EMAIL_VERIFICATION";
    this.status = "VIEWED_BUT_UNREAD";
    this.subject = "Verify Email";
    this.timestamp = 1637998848023;
  }

  // Get All notification
  getAllNotification() {
    //this.ngxService.start();
    this.commonService.getAllNotifications().subscribe((result: any) => {
      this.ngxService.stop();
      this.allnotifications = result;
      this.allnotificationsLength = this.allnotifications.length;
      for(let i = 0; i < this.allnotifications.length; i++){
        this.allnotifications[i].timestamp = moment(this.allnotifications[i].timestamp).format("DD/M/YYYY hh:mm A");
      }
    });
  }

  //Dissmiss Notification By ID
  dismissAllNotificationById(id) {
    this.dissmissNoti = {
      id: id,
      status: "REMOVE",
    };
    //this.ngxService.start();
    this.commonService
      .dismissAllNotificationById(this.dissmissNoti)
      .subscribe((result: any) => {
        this.ngxService.stop();
        if (result["code"] == 200) {
          this.ngxService.stop();
          this.toastr.success(result["message"]);
          this.getAllNotification();
          this.ngxService.stop();
        }
      });
  }
}
