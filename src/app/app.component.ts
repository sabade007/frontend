import { Component } from "@angular/core";
import { AlertController, Platform } from "@ionic/angular";
import { UserIdleService } from "angular-user-idle";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionTimeoutComponent } from "./components/modalpage/session-timeout/session-timeout.component";
import { PopoverController } from "@ionic/angular";
import { environment } from "src/environments/environment.prod";
import { AuthGuardService } from "./service/auth-guard.service";
import { isDevMode } from "@angular/core";
import $ from "jquery";
import { Subscription, timer } from "rxjs";
import { CommonService } from "./service/common.service";
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Location } from '@angular/common';
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { map } from "rxjs/internal/operators/map";
import { SessionExpiredComponent } from "./components/modalpage/session-expired/session-expired.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  sessionexp: any;
  popover: any;
  isLogin: any;
  loginUrl: string;
  signupUrl: string;
  url: string;
  subscriptionUploadData: Subscription;
  multiUploadedFiles: any = [];
  multiUploadedFiles1: any = [];
  UploadProgress: boolean = false;
  Uploadcompleted: boolean = false;
  headerUploadProgress: boolean = false;
  headerUploadcompleted: boolean = false;
  uploadLoader: boolean = false;
  dropUploadLoader: boolean = false;
  dropUploadedFiles: any = [];
  OntogglePopup: boolean = true;
  timerSubscription: Subscription; 
  isTokenValid: any;

  constructor(
    private authService: AuthGuardService,
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private userIdle: UserIdleService,
    private router: Router,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private commonService: CommonService,
    private _location: Location,
    private localService: LocalService,
    // private statusBar: StatusBar,
    public alertController: AlertController
  ) {
    this.initializeApp();
    this.initializeApp1();
    // this.initializeWebSocketConnection();
    this.isLogin = this.localService.getJsonValue(localData.isLogin);
  }


  ngOnInit() {
    // timer(0, 10000) call the function immediately and every 1 min 
    this.timerSubscription = timer(0, 60000).pipe( map(() => {
      this.isLogin = this.localService.getJsonValue(localData.isLogin);
      this.getvalidToken();
      }) 
    ).subscribe(); 
    document.body.classList.toggle('dark', false);
    this.loginUrl = environment.loginUrl;
    this.signupUrl = environment.signupUrl;
    this.url = environment.url;
    if (isDevMode()) {
      console.log = function () {};
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    toggleDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

    // Add or remove the "dark" class based on if the media query matches
    function toggleDarkTheme(shouldAdd) {
      document.body.classList.toggle('dark', shouldAdd);
    }

    this.subscriptionUploadData = this.commonService
      .getUploadProgress()
      .subscribe((message) => {
        this.multiUploadedFiles.push(message);
        this.multiUploadedFiles.reverse()
        this.multiUploadedFiles = this.multiUploadedFiles.filter(
          (el, i, a) => i === a.indexOf(el)
        );
        this.multiUploadedFiles1.push(message);
        this.multiUploadedFiles1.reverse()
        this.multiUploadedFiles1 = this.multiUploadedFiles1.filter(
          (el, i, a) => i === a.indexOf(el)
        );
        this.commonService.storeUploadedFiles(this.multiUploadedFiles1);
        console.log("multiUploadedFiles", this.multiUploadedFiles)
        if (this.multiUploadedFiles.length != 0) {
          for (let i = 0; i < this.multiUploadedFiles.length; i++) {
            if (
              this.multiUploadedFiles[i].percentDone >= 0 ||
              this.multiUploadedFiles[i].percentDone == 100
            ) {
              this.uploadLoader = true;
            }
            if (this.multiUploadedFiles[i].percentDone < 100) {
              this.headerUploadProgress = true;
              this.headerUploadcompleted = false;
              console.log(
                "pecrent done---",
                this.multiUploadedFiles[i].percentDone
              );
            } else if (this.multiUploadedFiles[i].percentDone === 100) {
              this.headerUploadcompleted = true;
              this.headerUploadProgress = false;
              console.log(
                "---pecrent done---",
                this.multiUploadedFiles[i].percentDone
              );
            }
          }
        }
      });
  }

  getvalidToken(){
    if(this.isLogin &&
      window.location.href != this.loginUrl &&
      window.location.href != this.signupUrl &&
      window.location.href != this.url &&
      !window.location.href.includes('/publicShare/')){
        this.loadData(); // load data contains the http request 
    }
  }

  loadData(){
    let data = this.localService.getJsonValue(localData.token);
    this.commonService.validToken(data).subscribe((result: any) => {
      this.isTokenValid = result;
      if(this.isTokenValid == false){
        this.popoverController.dismiss();
        this.sessionTimeOut();
        // this.timerSubscription.unsubscribe();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.userIdle.startWatching();
      this.userIdle.onTimerStart().subscribe((count) => {});
      this.sessionexp = this.userIdle.onTimeout().subscribe(() => {
        if (
          this.isLogin &&
          window.location.href != this.loginUrl &&
          window.location.href != this.signupUrl &&
          window.location.href != this.url &&
          !window.location.href.includes('/publicShare/')
        ) {
          this.sessionExpire();
          this.sessionexp.unsubscribe();
        }
      });
    });

    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });

  }

  async sessionTimeOut() {
    this.popover = await this.popoverController.create({
      component: SessionExpiredComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      // this.timerSubscription.unsubscribe();
    });
  }

  async sessionExpire() {
    this.popover = await this.popoverController.create({
      component: SessionTimeoutComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.reset();
    });
  }

  reset() {
    this.initializeApp();
  }

  //Cancel Loader popup
  OncancelUploadbox() {
    this.commonService.storeCancelProgress("true");
    this.uploadLoader = false;
    this.dropUploadLoader = false;
    this.multiUploadedFiles = [];
    this.dropUploadedFiles = [];
  }

  //Toggle popup
  OntoggleLoaderpopUp() {
    var toggle = document.getElementById("toggle");
    if (toggle.style.display === "none") {
      this.OntogglePopup = true;
      toggle.style.display = "block";
    } else {
      this.OntogglePopup = false;
      toggle.style.display = "none";
    }
  }
  // sendMessage(message) {
  //   this.stompClient.send("/send/message", {}, message);
  //   $("#input").val("");
  // }




  initializeApp1() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });

  this.platform.backButton.subscribeWithPriority(10, () => {
    console.log('Back press handler!');
    if (this._location.isCurrentPathEqualTo('/user/dashboard')) {
      // Show Exit Alert!
      console.log('Show Exit Alert!');
      this.showExitConfirm();
      // processNextHandler();
    } else {
      // Navigate to back page
      console.log('Navigate to back page');
      this._location.back();

    }

  });

  this.platform.backButton.subscribeWithPriority(5, () => {
    console.log('Handler called to force close!');
    this.alertController.getTop().then(r => {
      if (r) {
        navigator['app'].exitApp();
      }
    }).catch(e => {
      console.log(e);
    })
  });

  }

  showExitConfirm() {
    this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'App termination',
      message: 'Do you want to exit Indryve app?',
      backdropDismiss: false,
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Yes',
        handler: () => {
          navigator['app'].exitApp();
          localStorage.removeItem('token');
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }



}
