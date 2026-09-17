import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GlycanDetailsDialogComponent } from './glycan-details-dialog.component';
import { GlycanDetails } from '../glycan.service';

describe('GlycanDetailsDialogComponent', () => {
  let component: GlycanDetailsDialogComponent;
  let fixture: ComponentFixture<GlycanDetailsDialogComponent>;

  beforeEach(async () => {
    const mockData = { glytoucan: { glytoucan_ac: 'G00000AB', glytoucan_url: '' } } as unknown as GlycanDetails;

    await TestBed.configureTestingModule({
      imports: [GlycanDetailsDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlycanDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
