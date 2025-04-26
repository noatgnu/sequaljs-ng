import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlycanDetailsDialogComponent } from './glycan-details-dialog.component';

describe('GlycanDetailsDialogComponent', () => {
  let component: GlycanDetailsDialogComponent;
  let fixture: ComponentFixture<GlycanDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlycanDetailsDialogComponent]
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
