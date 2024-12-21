import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilesComponent } from './files.component';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/service/files.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';


describe('FilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  let service: FilesService;
  let service1: CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(FilesComponent);
   
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {params: of({ abc: 'testABC' }) }}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    component.newFolder = true;
    component.newTextDoc = true;
    component.openMenu = true;
    fixture.detectChanges();
  }));
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  it('should create', () => {
    expect(component).toBeTruthy();
  });

 // const newfolder = fixture.debugElement.query(By.css('#newFolder'));


  it('check newfolder value',(done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newfolder');
    nameInput.value = 'test';
    nameInput.dispatchEvent(new Event('input'));
    expect( nameInput.value ).not.toBe('');
    done();
  });


  it('check newfolder empty',(done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newfolder');
    nameInput.dispatchEvent(new Event('input'));
    expect( nameInput.value ).toBe('');
    done();
  });

  it('check newTextDoc value',(done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newTextDoc');
    nameInput.value = 'test';
    nameInput.dispatchEvent(new Event('input'));
    expect( nameInput.value ).not.toBe('');
    done();
  });


  it('check newTextDoc empty',(done) => {
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector('#newTextDoc');
    nameInput.dispatchEvent(new Event('input'));
    expect( nameInput.value ).toBe('');
    done();
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
    service.OnshowFiles(data).subscribe((resp: any) => {
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
    service1.CreateReName(678, "Newfolders").subscribe( (resp: any) => {
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
    service1.saveTextFile(response).subscribe( (resp: any) => {
     expect(resp.code).toBe(200);
     done();
    })
  });

  it('check new folder file response', (done) => {
    service1.CreateNewFile("Impr", "any", "109").subscribe( (resp: any) => {
     expect(resp.responseCode).toBe(201);
     done();
    })
  });

  // it('check upload response', (done) => {
  //   let payload = new FormData();
  //   service1.uploadFiles(payload).subscribe( (resp: any) => {
  //    expect(resp.responseCode).toBe(201);
  //    done();
  //   })
  // });

});
