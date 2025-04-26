import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnimodDetailsDialogComponent } from './unimod-details-dialog.component';

describe('UnimodDetailsDialogComponent', () => {
  let component: UnimodDetailsDialogComponent;
  let fixture: ComponentFixture<UnimodDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnimodDetailsDialogComponent]
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
