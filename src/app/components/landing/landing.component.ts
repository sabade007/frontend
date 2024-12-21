import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { I } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment.prod'
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  
  @ViewChild(IonContent) content: IonContent;
  isLogin: any;
  dashboard: boolean = false;
  login: boolean = true;
  allowSignup: any;
  showSignup: any;
  noLanding: any;
  showLandingPage: boolean = false;
  helpCenter: any = environment.helpCenter;
  contactUs: any = environment.contactUs;
  PrivacyPolicyLanding: any = environment.PrivacyPolicyLanding;
  LicenceAgreement: any = environment.LicenceAgreement;
  facebooKURL : any = environment.facebooKURL;
  twitterURL : any = environment.twitterURL;
  linkedinURL : any = environment.linkedinURL;
  productName = environment.productname;
  constructor(public dialog: MatDialog, 
              private commonService: CommonService,
              private router: Router,
              private localService: LocalService) {
                this.allowPage();          
              }
  
  allowPage() {
    this.commonService.allowPage().subscribe((result: any) => {
      this.allowSignup = result;
      console.log("allowSignup", this.allowSignup, typeof(this.allowSignup));
      this.localService.setJsonValue(localData.allowPage, this.allowSignup);
      this.localService.setJsonValue(localData.allowSignUp, result);
      if(this.allowSignup){
        this.router.navigate(['/']); 
      }else{
        this.router.navigate(['/login']);
      }

    });
  }
              
  ngOnInit() {
    setTimeout( ()=> { this.showLandingPage = true; }, 1000)
    this.isLogin = this.localService.getJsonValue(localData.isLogin);
    if(this.isLogin) {
      console.log(this.isLogin);
      this.dashboard = true; 
      this.login = false;     
    }
    else if(!this.isLogin) {
      console.log(this.isLogin);
      this.dashboard = false; 
      this.login = true;  
    }
  }



  goToPricing(){
    document.getElementById("pricing").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  goToFeatures(){
    document.getElementById("features").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  goToSupport(){
    document.getElementById("support").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  goToEncryption(){
    document.getElementById("encryption").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  slideOpts = {  
    initialSlide: 1,  
    speed: 300,  
    effect: 'flip',  
    slideShadows: true,
    depth: 100,
    modifier: 1,
    autoplay:true
  }; 
 
  ScrollToTop(){
    this.content.scrollToTop(1500);
  }

  // openVideo() {
  //   const dialogRef = this.dialog.open(VideoComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  navigateSignUp(){
    this.router.navigate(['/create-account']);
  }

 navigateToDashboard(){
  this.router.navigateByUrl('/user/dashboard');
 }

 gotoSignUp(email){
   this.router.navigate(['/create-account']);
   sessionStorage.setItem("userEmail", email);
 }

}
