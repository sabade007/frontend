import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { AllnotificationComponent } from './allnotification.component';
import { CommonService } from 'src/app/service/common.service';
import { of } from 'rxjs/internal/observable/of';
import { environment } from 'src/environments/environment.prod';

describe('AllnotificationComponent', () => {
  let component: AllnotificationComponent;
  let fixture: ComponentFixture<AllnotificationComponent>;
  UnitTestingModule.setUpTestBed(AllnotificationComponent);
  let commonService :CommonService;
  let captcha;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllnotificationComponent ],
    }).compileComponents();
    commonService = TestBed.inject(CommonService);
    fixture = TestBed.createComponent(AllnotificationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check captcha response', (done) => {
    commonService.captcha().subscribe((resp: any) => {
      expect(resp.captchaId).not.toBe(null);
      captcha = resp['captchaId'];
      done();
    });
  });

  it('check login response', (done) => {
    let data = {
      "captchaId": captcha,
      "captchaValue": '12345',
      "password": commonService.encryptpassword('Root@123'),
      "username": 'mouni'
    }
    commonService.userSignIn(data).subscribe((resp: any) => {
      environment.isLoggedIn = true
      sessionStorage.setItem('token', resp.token);
      sessionStorage.setItem('parentId', resp.parentId);
      expect(resp.responseCode).toBe(200);
      done();
    })
  });

  it('check getAllNotifications response', (done) => {
    commonService.getAllNotifications().subscribe( (resp: any) => {
     expect(resp).not.toBe('');
     done();
    })
  });

  it('dismissAllNotificationById', () => {
    const response: any = {
      "id": 3348,
      "status": 'REMOVE',
    };
    spyOn(commonService, 'dismissAllNotificationById').and.returnValue(of(response))
    component.dismissAllNotificationById('3348');
    expect(commonService.dismissAllNotificationById).toHaveBeenCalled();
  })

  // it('check dismissAllNotificationById response', (done) => {
  //   const response: any = {
  //     "id": 3348,
  //     "status": 'REMOVE',
  //   };
  //   commonService.dismissAllNotificationById(response).subscribe( (resp: any) => {
  //    expect(resp.code).toBe(200);
  //    done();
  //   })
  // });
  
});
