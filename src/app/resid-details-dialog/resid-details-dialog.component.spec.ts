import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RESIDDetailsDialogComponent, ResidDialogData } from './resid-details-dialog.component';

describe('RESIDDetailsDialogComponent', () => {
  let component: RESIDDetailsDialogComponent;
  let fixture: ComponentFixture<RESIDDetailsDialogComponent>;

  beforeEach(async () => {
    const mockData: ResidDialogData = { residId: 'AA0001' };

    await TestBed.configureTestingModule({
      imports: [RESIDDetailsDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RESIDDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
