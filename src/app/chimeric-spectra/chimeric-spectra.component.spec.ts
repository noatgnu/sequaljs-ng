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
});
