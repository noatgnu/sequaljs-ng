import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IonNotationComponent } from './ion-notation.component';

describe('IonNotationComponent', () => {
  let component: IonNotationComponent;
  let fixture: ComponentFixture<IonNotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonNotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IonNotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
