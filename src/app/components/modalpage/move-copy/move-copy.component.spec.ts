import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { MoveCopyComponent } from './move-copy.component';
import { FilesService } from 'src/app/service/files.service';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';
import { of } from 'rxjs/internal/observable/of';

describe('MoveCopyComponent', () => {
  let component: MoveCopyComponent;
  let fixture: ComponentFixture<MoveCopyComponent>;
  UnitTestingModule.setUpTestBed(MoveCopyComponent);
  let service: FilesService;
  let service1: CommonService;
  let captcha;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveCopyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoveCopyComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    // fixture.detectChanges();
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

  it('check show folder response', (done) => {
    const response = {
      "exceptionalIds":[3417, 3248],
      "parentId":"541"
    }
    spyOn(service, 'getFolders').and.returnValue(of(response))
    component.OnshowAllFolders("541");
    expect(service.getFolders).toHaveBeenCalled();
  });
  
});
