import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PSIModDetailsDialogComponent } from './psi-mod-details-dialog.component';
import { PSIModModification } from '../psi-mod.service';

describe('PSIModDetailsDialogComponent', () => {
  let component: PSIModDetailsDialogComponent;
  let fixture: ComponentFixture<PSIModDetailsDialogComponent>;

  beforeEach(async () => {
    const mockData: PSIModModification = { id: 'MOD:00001', name: 'Test PSIMod' };

    await TestBed.configureTestingModule({
      imports: [PSIModDetailsDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PSIModDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
