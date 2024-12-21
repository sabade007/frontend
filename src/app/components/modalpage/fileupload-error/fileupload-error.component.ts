import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-fileupload-error',
  templateUrl: './fileupload-error.component.html',
  styleUrls: ['./fileupload-error.component.scss'],
})
export class FileuploadErrorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController, ) { }

  ngOnInit() {}

  ok() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }
}
