import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { ShowOriginalSizeGlycanImageDialogComponent } from './show-original-size-glycan-image-dialog.component';

describe('ShowOriginalSizeGlycanImageDialogComponent', () => {
  let component: ShowOriginalSizeGlycanImageDialogComponent;
  let fixture: ComponentFixture<ShowOriginalSizeGlycanImageDialogComponent>;

  beforeEach(async () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ShowOriginalSizeGlycanImageDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowOriginalSizeGlycanImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
