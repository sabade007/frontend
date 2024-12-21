import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { PhotosService } from 'src/app/service/photos.service';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { environment } from 'src/environments/environment.prod';

import { PhotosComponent } from './photos.component';

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let service: FilesService;
  let service1: CommonService;
  let service2: PhotosService
  let captcha;
  UnitTestingModule.setUpTestBed(PhotosComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {params: of({ abc: 'testABC' }) }}
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    service2 = TestBed.inject(PhotosService);
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

  it('check show all photos response', (done) => {
    let data = {
      asc: false,
      pageNb: 1,
      parentId: 0,
      sortBy: "title",
      step: 10
    }
    service2.showAllPhots(data).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check add favorite files response', (done) => {
    let favoriteFile = {
      flag: true,
      id: 468,
    }
    service.addFavorites(favoriteFile).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check trash files response', (done) => {
    let deleteFileId = {
      fileIds: [116],
      restoreFile: false,
      trashFile: true,
    }
    service.trashFiles(deleteFileId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

});
