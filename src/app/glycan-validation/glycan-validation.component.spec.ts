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

  it('validates Kdo/Kdn as a valid glycan structure (previously rejected)', () => {
    component.setGlycanExample('kdoKdn');
    expect(component.validationResult).toContain('"isValid": true');
  });

  it('accepts Kdo/Kdn inside a sequence-attached glycan modification', () => {
    component.setSequenceExample('kdoKdn');
    expect(component.sequenceResult).not.toContain('Error');
    expect(component.sequenceResult).toContain('"isValid": true');
  });
});
