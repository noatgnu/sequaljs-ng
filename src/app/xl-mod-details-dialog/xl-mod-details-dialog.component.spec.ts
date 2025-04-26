import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XLModDetailsDialogComponent } from './xl-mod-details-dialog.component';

describe('XLModDetailsDialogComponent', () => {
  let component: XLModDetailsDialogComponent;
  let fixture: ComponentFixture<XLModDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XLModDetailsDialogComponent]
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
