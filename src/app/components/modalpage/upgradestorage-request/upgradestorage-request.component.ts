import { Component, Input, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-upgradestorage-request',
  templateUrl: './upgradestorage-request.component.html',
  styleUrls: ['./upgradestorage-request.component.scss'],
})
export class UpgradestorageRequestComponent implements OnInit {
  @Input() StorageRequestresult: string;

  successMessage: any;
  constructor(  private popoverController: PopoverController,
                private navParams: NavParams,
              ) { }

  ngOnInit() {
    console.log(this.navParams.data['message']);
    this.successMessage = this.navParams.data['message'];
  }

  ok() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
