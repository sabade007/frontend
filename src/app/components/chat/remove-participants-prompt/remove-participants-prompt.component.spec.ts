import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RemoveParticipantsPromptComponent } from './remove-participants-prompt.component';

describe('RemoveParticipantsPromptComponent', () => {
  let component: RemoveParticipantsPromptComponent;
  let fixture: ComponentFixture<RemoveParticipantsPromptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveParticipantsPromptComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveParticipantsPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
