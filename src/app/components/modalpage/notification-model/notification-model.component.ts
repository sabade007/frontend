import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";
import { CommonService } from "src/app/service/common.service";

@Component({
  selector: "app-notification-model",
  templateUrl: "./notification-model.component.html",
  styleUrls: ["./notification-model.component.scss"],
})
export class NotificationModelComponent implements OnInit {
  id: 269;
  message: "mi shared  files with you .";
  objectId: 1;
  status: "VIEWED";
  subject: "1 Files shared with you";
  emailID: any;
  showMe: boolean = false;

  constructor(
    private commonService: CommonService,
    private popoverController: PopoverController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    // this.fileid = this.navParams.data['fileid'];
    // this.fileTitle = this.navParams.data['fileTitle'];
    // this.sharedType = this.navParams.data['sharedType'];
    // this.passwordData = this.navParams.data['password'];

    this.message = this.navParams.data["message"];
    this.status = this.navParams.data["status"];
    this.subject = this.navParams.data["subject"];
  }

  OnSelect() {
    this.showMe = !this.showMe;
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }
}
