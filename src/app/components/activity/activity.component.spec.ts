import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';
import { UnitTestingModule } from '../../unit-testing-module';
import { of } from 'rxjs';
import { ActivityComponent } from './activity.component';
import { ActivatedRoute } from '@angular/router';
import { ActivityServiceService } from 'src/app/service/activity-service.service';
import { environment } from 'src/environments/environment.prod';
import * as moment from 'moment';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let service: CommonService;
  let service1: ActivityServiceService;
  let captcha;
  UnitTestingModule.setUpTestBed(ActivityComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ abc: 'testABC' }) } }
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    service1 = TestBed.inject(ActivityServiceService);
    fixture.detectChanges();
  }));
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check captcha response', (done) => {
    service.captcha().subscribe((resp: any) => {
      expect(resp.captchaId).not.toBe(null);
      captcha = resp['captchaId'];
      done();
    });
  });

  it('check login response', (done) => {
    let data = {
      "captchaId": captcha,
      "captchaValue": '12345',
      "password": service.encryptpassword('Root@123'),
      "username": 'mouni'
    }
    service.userSignIn(data).subscribe((resp: any) => {
      environment.isLoggedIn = true
      sessionStorage.setItem('token', resp.token);
      sessionStorage.setItem('parentId', resp.parentId);
      expect(resp.responseCode).toBe(200);
      done();
    })
  });
  
  it('check show recent activity response', (done) => {
    let data={
      Date:moment(new Date()).format('DD/M/YYYY')
    }
    service1.getActivitiesList(data).subscribe((resp: any) => {
      expect(resp).not.toBe(null);
      done();
    })
  });

  it('check show activity count response', (done) => {
    let activityCount={
      numberOfDays:42,
      startDate: "26/07/2021"
    }
    service1.getActivitiesCount(activityCount).subscribe((resp: any) => {
      expect(resp).not.toBe(null);
      done();
    })
  });

});
