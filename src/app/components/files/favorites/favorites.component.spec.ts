import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { FavoritesComponent } from './favorites.component';
import { FilesService } from 'src/app/service/files.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';
import { UnitTestingModule } from 'src/app/unit-testing-module';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let service: FilesService;
  let service1: CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(FavoritesComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {params: of({ abc: 'testABC' }) }}
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
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

  it('check show all files response', (done) => {
    let data = {
      asc: 'false',
      pageNb: 1,
      parentId: '109',
      sortBy: 'createdAt',
      step: 10
    }
    service1.getshowAllFiles(data).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check show all favorite files response', (done) => {
    let data = {
      asc: 'false',
      pageNb: 1,
      parentId: '109',
      sortBy: 'createdAt',
      step: 10
    }
    service.showAllFavorites(data).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check trash files response', (done) => {
    let deleteFileId = {
      fileIds: [111],
      restoreFile: false,
      trashFile: true,
    }
    service.trashFiles(deleteFileId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check add favorite files response', (done) => {
    let favoriteFile = {
      flag: true,
      id: 112,
    }
    service.addFavorites(favoriteFile).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check download files response', (done) => {
    let downloadFilesId = {
      fileId: [116],
      sharedFile: false,
    }
    service.downloadFiles(downloadFilesId).subscribe((resp: any) => {
      expect(resp.length).not.toBe(null);
      done();
    })
  });

  it('check rename response', (done) => {
    service1.CreateReName(678, "Newfolde").subscribe( (resp: any) => {
     expect(resp.code).toBe(200);
     done();
    })
  });

});
