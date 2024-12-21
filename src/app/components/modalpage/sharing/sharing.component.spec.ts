import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { SharingComponent } from './sharing.component';
import { FilesService } from 'src/app/service/files.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';

describe('SharingComponent', () => {
  let component: SharingComponent;
  let fixture: ComponentFixture<SharingComponent>;
  UnitTestingModule.setUpTestBed(SharingComponent);
  let service: FilesService;
  let service1: CommonService;
  let captcha;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharingComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    fixture.detectChanges();
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
      "username": 'anusha'
    }
    service1.userSignIn(data).subscribe((resp: any) => {
      environment.isLoggedIn = true
     sessionStorage.setItem('token', resp.token);
     sessionStorage.setItem('parentId', resp.parentId);
      expect(resp.responseCode).toBe(200);
      done();
    })
  });

  it('check shared Files UsersList response', (done) => {
    let Data = {
      "fileId": [3236],
      "reSharing": false,
      "sharedFile": true
    }
    service.sharedFilesUsersList(Data).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check shared Files UsersList response', (done) => {
    let Data = {
      "fileId": [3236],
      "reSharing": false,
      "sharedFile": true
    }
    service.sharedFilesUsersList(Data).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check Find Users response', (done) => {
    let userData = {
      'userNames': 'm'
    }
    service.OnFindUsers(userData).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check Shared Docs response', (done) => {
    let sharedData = {
      "editing": true,
      "expiryTime": 1625635967,
      "fileIds": [3236],
      "hideDownload": false,
      "note": 'message',
      "reSharing": true,
      "userNames": ["mounabm"],
      "viewing": true,
      "filePermissions":  "CAN_VIEW"
    }
    service.OnSharedDocs(sharedData).subscribe((resp: any) => {
      expect(resp.code).toBe(200);
      done();
    })
  });

  it('check update permissions response', (done) => {
    let data = {
      "expiryTime": 1626352678190,
      "fileId": [3236],
      "filePermissions": "CAN_EDIT",
      "hideDownload": true,
      "reSharing": true,
      "username": "mounabm"
    }
    service.updatePermissions(data).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check remove file users response', (done) => {
    let data = {
      "fileId": [3236],
      "username":"mounabm"
    }
    service.removeFileUsers(data).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check get Public Link Status response', (done) => {
    let data = {
      "fileId": 3242,
    }
    service.getPublicLinkStatus(data).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check get Public Link Disabled response', (done) => {
    let data = {
      "fileId": 3370,
    }
    service.getPublicLinkDisabled(data).subscribe((resp: any) => {
      expect(resp.code).toBe(203);
      done();
    })
  });

  it('check get Public Link response', (done) => {
    let data = {
      "fileId": 3242,
      "filePermissions": "CAN_VIEW",
      "sharingType": "EVERYONE"
    }
    service.getPublicLink(data).subscribe((resp: any) => {
      expect(resp).not.toBe('');
      done();
    })
  });

  it('check get Public Link response', (done) => {
    let emailData = {
      "mailIds": ["mouna@gmail.com"],
      "sharingId": 2910
    }
    service.publinkSend(emailData).subscribe((resp: any) => {
      expect(resp.code).toBe(200);
      done();
    })
  });

});
