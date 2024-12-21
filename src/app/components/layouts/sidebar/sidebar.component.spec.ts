import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SidebarComponent } from './sidebar.component';
import { of } from 'rxjs/internal/observable/of';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { environment } from 'src/environments/environment.prod';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  UnitTestingModule.setUpTestBed(SidebarComponent);
  let service: FilesService;
  let service1: CommonService;
  let captcha;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
    }).compileComponents();
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check captcha response', (done) => {
    service1.captcha().subscribe((resp: any) => {
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
    service1.userSignIn(data).subscribe((resp: any) => {
      environment.isLoggedIn = true
      sessionStorage.setItem('token', resp.token);
      sessionStorage.setItem('parentId', resp.parentId);
      expect(resp.responseCode).toBe(200);
      done();
    })
  });

  it('check userDetails response', (done) => {
    service1.userDetails().subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check getNotifications response', (done) => {
    service1.getNotifications().subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check getDashboardInfos response', (done) => {
    service1.getDashboardInfos().subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check dismissAllNotifications response', (done) => {
    service1.dismissAllNotifications().subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check dismissAllNotificationById response', (done) => {
    const response = {
      "id": 3307,
      "status": "DELETED",
    }
    service1.dismissAllNotificationById(response).subscribe((resp: any) => {
      expect(resp.code).toBe(200);
      done();
    })
  });

  it('check getStorageInfos response', (done) => {
    service1.getStorageInfos().subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

});
