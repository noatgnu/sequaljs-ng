import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { XLModDetailsDialogComponent } from './xl-mod-details-dialog.component';
import { XLModEntity } from '../xl-mod.service';

describe('XLModDetailsDialogComponent', () => {
  let component: XLModDetailsDialogComponent;
  let fixture: ComponentFixture<XLModDetailsDialogComponent>;

  beforeEach(async () => {
    const mockData: XLModEntity = { id: 'XLMOD:00001', name: 'Test XLMod' };

    await TestBed.configureTestingModule({
      imports: [XLModDetailsDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XLModDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
