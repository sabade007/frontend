import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeletedFilesComponent } from './deleted-files.component';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/service/files.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';

describe('DeletedFilesComponent', () => {
  let component: DeletedFilesComponent;
  let fixture: ComponentFixture<DeletedFilesComponent>;
  let service: FilesService;
  let service1: CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(DeletedFilesComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedFilesComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {params: of({ abc: 'testABC' }) }}
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedFilesComponent);
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

  it('check show all delete files response', (done) => {
    let data = {
      asc: false,
      pageNb: 1,
      parentId: 0,
      sortBy: "title",
      step: 10
    }
    service.showAllTrashedFiles(data).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check restore files response', (done) => {
    let deleteFileId = {
      fileIds: [111],
      restoreFile: true,
      trashFile: false,
    }
    service.trashFiles(deleteFileId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check delete permanently files response', (done) => {
    let deleteFilesParmanently = {
      fileId: [113],
    }
    service.deleteFiles(deleteFilesParmanently).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });


});
