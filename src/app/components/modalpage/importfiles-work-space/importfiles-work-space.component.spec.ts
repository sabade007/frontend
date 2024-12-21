import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportfilesWorkSpaceComponent } from './importfiles-work-space.component';

describe('ImportfilesWorkSpaceComponent', () => {
  let component: ImportfilesWorkSpaceComponent;
  let fixture: ComponentFixture<ImportfilesWorkSpaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportfilesWorkSpaceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportfilesWorkSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
