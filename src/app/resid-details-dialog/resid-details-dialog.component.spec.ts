import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RESIDDetailsDialogComponent } from './resid-details-dialog.component';

describe('RESIDDetailsDialogComponent', () => {
  let component: RESIDDetailsDialogComponent;
  let fixture: ComponentFixture<RESIDDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RESIDDetailsDialogComponent]
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
