import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FilesService } from 'src/app/service/files.service';
import { UnitTestingModule } from 'src/app/unit-testing-module';

import { PublicShareComponent } from './public-share.component';

describe('PublicShareComponent', () => {
  let component: PublicShareComponent;
  let fixture: ComponentFixture<PublicShareComponent>;
  let service : FilesService;
  let activatedRoute : ActivatedRoute;
  UnitTestingModule.setUpTestBed(PublicShareComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicShareComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {token:'C0V5CuTRU0RCkx4bI6r0spa48wayl5'}}} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicShareComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check public shared response', (done) => {
    service.getPublicShared('C0V5CuTRU0RCkx4bI6r0spa48wayl5').subscribe((resp: any) => {
    expect(resp.fileStructure).toEqual(null);
    done();
    })
  });

  // it('check public share download response', (done) => {
  //   let downloadData = {
  //     "password": service.encryptpassword('root'+"C0V5CuTRU0RCkx4bI6r0spa48wayl5"),
  //     "token": "C0V5CuTRU0RCkx4bI6r0spa48wayl5"
  //   }
  //   service.pubShareddownloadFiles(downloadData).subscribe((resp: any) => {
  //     expect(resp.length).not.toEqual(null);
  //     done();
  //   })
  // });

  it('check password verify response', (done) => {
    let passwordData = {
      "password": service.encryptpassword('root'+"C0V5CuTRU0RCkx4bI6r0spa48wayl5"),
      "token": "C0V5CuTRU0RCkx4bI6r0spa48wayl5"
    }
    service.OnPubPassVrify(passwordData).subscribe( (resp: any) => {
     expect(resp.code).toEqual(200);
     done();
    })
  });

});
