import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UnimodDetailsDialogComponent } from './unimod-details-dialog.component';
import { UnimodModification } from '../unimod.service';

describe('UnimodDetailsDialogComponent', () => {
  let component: UnimodDetailsDialogComponent;
  let fixture: ComponentFixture<UnimodDetailsDialogComponent>;

  beforeEach(async () => {
    const mockData: UnimodModification = { id: '1', numericId: '1', name: 'Test Unimod', specificities: [] };

    await TestBed.configureTestingModule({
      imports: [UnimodDetailsDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnimodDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
