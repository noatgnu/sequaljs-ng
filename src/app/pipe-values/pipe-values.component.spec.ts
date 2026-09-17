import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeValuesComponent } from './pipe-values.component';

describe('PipeValuesComponent', () => {
  let component: PipeValuesComponent;
  let fixture: ComponentFixture<PipeValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipeValuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('labels a global-mod pipe value distinctly from a residue-0 pipe value', () => {
    component.setSequenceExample('withGlobal');
    const result = JSON.parse(component.sequenceResult);
    expect(result[0].position).toBe('global');
    expect(result.some((entry: any) => entry.position === 0)).toBeFalse();
  });
});
