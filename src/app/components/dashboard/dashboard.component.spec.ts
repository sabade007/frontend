import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { DashboardComponent } from './dashboard.component';
import { CommonService } from 'src/app/service/common.service';
import { UnitTestingModule } from '../../unit-testing-module';
import { of } from 'rxjs';
import * as moment from 'moment';
import { FilesService } from 'src/app/service/files.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: CommonService;
  let service1: FilesService;
  let captcha;
  UnitTestingModule.setUpTestBed(DashboardComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ abc: 'testABC' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    service1 = TestBed.inject(FilesService);
    component.newFolder = true;
    component.newTextDoc = true;
    component.openMenu = true;
    fixture.detectChanges();
  }));
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check newfolder value', (done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newfolder');
    nameInput.value = 'doc';
    nameInput.dispatchEvent(new Event('input'));
    expect(nameInput.value).not.toBe('');
    done();
  });


  it('check newfolder empty', (done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newfolder');
    nameInput.dispatchEvent(new Event('input'));
    expect(nameInput.value).toBe('');
    done();
  });

  it('check newTextDoc value', (done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newTextDoc');
    nameInput.value = 'doc';
    nameInput.dispatchEvent(new Event('input'));
    expect(nameInput.value).not.toBe('');
    done();
  });


  it('check newTextDoc empty', (done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newTextDoc');
    nameInput.dispatchEvent(new Event('input'));
    expect(nameInput.value).toBe('');
    done();
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

  it('check storage response', (done) => {
    service.getStorageInfos().subscribe((resp: any) => {
      expect(resp.totalSpace).not.toBe(null);
      done();
    })
  });

  it('check show recent files response', (done) => {
    let data = {
      parentId: '541',
      step: 10
    }
    service.showAllFiles(data).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check show recent activity response', (done) => {
    let data={
      Date:moment(new Date()).format('DD/M/YYYY')
    }
    service.getActivitiesList(data).subscribe((resp: any) => {
      expect(resp).not.toBe(null);
      done();
    })
  });

  it('check user details response', (done) => {
    service.userDetails().subscribe((resp: any) => {
      expect(resp.spaceConsumed).not.toBe(null);
      done();
    })
  });

  it('check dashboard event response', (done) => {
    service.getDashboardInfos().subscribe((resp: any) => {
      expect(resp.totalSpaceUsed).not.toBe(null);
      done();
    })
  });

  it('check new folder file response', (done) => {
    service.CreateNewFile("Documents", "any", "109").subscribe( (resp: any) => {
     expect(resp.responseCode).toBe(201);
     done();
    })
  });

  it('check rename response', (done) => {
    service.CreateReName(2150, "picsss").subscribe( (resp: any) => {
     expect(resp.code).toBe(200);
     done();
    })
  });

  it('check new text file response', (done) => {
    const response: any = {
      'content': window.btoa('mouna'),
      'fileName': 'pdfvikkewm123.txt',
      'id': 2207,
      'newFile': false
    };
    service.saveTextFile(response).subscribe( (resp: any) => {
     expect(resp.code).toBe(200);
     done();
    })
  });

  it('check trash files response', (done) => {
    let deleteFileId = {
      fileIds: [2191],
      restoreFile: false,
      trashFile: true,
    }
    service1.trashFiles(deleteFileId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check add favorite files response', (done) => {
    let favoriteFile = {
      flag: true,
      id: 1539,
    }
    service1.addFavorites(favoriteFile).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check download files response', (done) => {
    let downloadFilesId = {
      fileId: [1535],
    }
    service1.downloadFiles(downloadFilesId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });


});
