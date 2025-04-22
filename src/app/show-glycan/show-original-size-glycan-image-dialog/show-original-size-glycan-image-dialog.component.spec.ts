import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOriginalSizeGlycanImageDialogComponent } from './show-original-size-glycan-image-dialog.component';

describe('ShowOriginalSizeGlycanImageDialogComponent', () => {
  let component: ShowOriginalSizeGlycanImageDialogComponent;
  let fixture: ComponentFixture<ShowOriginalSizeGlycanImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowOriginalSizeGlycanImageDialogComponent]
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
