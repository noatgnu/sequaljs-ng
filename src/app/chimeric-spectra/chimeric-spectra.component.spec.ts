import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChimericSpectraComponent } from './chimeric-spectra.component';

describe('ChimericSpectraComponent', () => {
  let component: ChimericSpectraComponent;
  let fixture: ComponentFixture<ChimericSpectraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChimericSpectraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChimericSpectraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('parses a chimeric peptidoform whose first member is itself a multichain ion', () => {
    component.setSequenceExample('chimericMultichain');
    expect(component.sequenceResult).not.toContain('Error');
    const result = JSON.parse(component.sequenceResult);
    expect(result.chargeInfo.length).toBe(2);
    expect(result.proformaOutput).toBe('PEPTIDE/2//ANOTHER/2+THIRD/3');
  });
});
