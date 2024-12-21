import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocalService } from 'src/environments/local.service';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss'],
})
export class SessionExpiredComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private localService: LocalService ) { }

  ngOnInit() {}

  login() {
    setTimeout(() => {
      this.router.navigate(['/'], {relativeTo: this.route});
      this.router.navigate(["/login"]);
      this.popoverController.dismiss();
      this.localService.clearToken();
      sessionStorage.clear();
      setTimeout(() => {
        location.reload();
      }, 500);
    }, 500);
  }
}
