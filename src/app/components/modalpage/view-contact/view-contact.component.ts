import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.scss'],
})
export class ViewContactComponent implements OnInit {

  contactDetails : any;
  productName = environment.productname;
  
  constructor(private navParams: NavParams,
              private popoverController: PopoverController,) { }

  ngOnInit() {
    this.contactDetails = this.navParams.data["contactDetails"];
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
