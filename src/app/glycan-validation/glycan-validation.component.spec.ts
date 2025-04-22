import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlycanValidationComponent } from './glycan-validation.component';

describe('GlycanValidationComponent', () => {
  let component: GlycanValidationComponent;
  let fixture: ComponentFixture<GlycanValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlycanValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlycanValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
