import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharedComponent } from './shared.component';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/service/files.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';

describe('SharedComponent', () => {
  let component: SharedComponent;
  let fixture: ComponentFixture<SharedComponent>;
  let service: FilesService;
  let service1: CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(SharedComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {params: of({ abc: 'testABC' }) }}
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    fixture.detectChanges();
  }));
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
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
      "username": 'anushats'
    }
    service1.userSignIn(data).subscribe((resp: any) => {
      environment.isLoggedIn = true
     sessionStorage.setItem('token', resp.token);
     sessionStorage.setItem('parentId', resp.parentId);
      expect(resp.responseCode).toBe(200);
      done();
    })
  });

  it('check show all shared files response', (done) => {
    let sharedData = {
      asc: false,
      pageNb: 1,
      parentId: "2223",
      sharedType: "others",
      sortBy: "sharedTime",
      step: 10
    }
    service.getSharedFiles(sharedData).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check download shared files response', (done) => {
    let downloadFilesId = {
      fileId: [1513],
      sharedFile: true
    }
    service.downloadFiles(downloadFilesId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check remove shared files response', (done) => {
    let deleteFileId = {
      fileId: [1529],
      sharedFile: true
    }
    service.removeSharedFiles(deleteFileId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check open shared withme folders response', (done) => {
    let sharedData = {
      asc: false,
      pageNb: 1,
      parentId: 2150,
      sortBy: "modifiedAt",
      step: 10
    }
    service.getOpenSharedFiles(sharedData, 2150).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

});
