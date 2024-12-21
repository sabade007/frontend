import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.scss'],
})
export class ContactAdminComponent implements OnInit {

  constructor(private popoverController: PopoverController,) { }

  ngOnInit() {}

  okay(){
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }
}
