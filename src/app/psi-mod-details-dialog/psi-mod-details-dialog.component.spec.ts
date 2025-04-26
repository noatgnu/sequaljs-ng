import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PSIModDetailsDialogComponent } from './psi-mod-details-dialog.component';

describe('PSIModDetailsDialogComponent', () => {
  let component: PSIModDetailsDialogComponent;
  let fixture: ComponentFixture<PSIModDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PSIModDetailsDialogComponent]
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
