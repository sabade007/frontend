import { Component, OnInit } from '@angular/core';
import { ToastController, PopoverController,NavParams } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss'],
})
export class MoreDetailsComponent implements OnInit {
  details: any;

  constructor(  public toastController: ToastController,
    private popoverController: PopoverController,
    private navParams: NavParams,) { }

  ngOnInit() {
    this.details = this.navParams.data['details'];
    console.log(this.details);
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
