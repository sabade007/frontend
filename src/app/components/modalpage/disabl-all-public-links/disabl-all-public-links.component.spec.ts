import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisablAllPublicLinksComponent } from './disabl-all-public-links.component';

describe('DisablAllPublicLinksComponent', () => {
  let component: DisablAllPublicLinksComponent;
  let fixture: ComponentFixture<DisablAllPublicLinksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisablAllPublicLinksComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisablAllPublicLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
