import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlycanSearchResultsDialogComponent } from './glycan-search-results-dialog.component';

describe('GlycanSearchResultsDialogComponent', () => {
  let component: GlycanSearchResultsDialogComponent;
  let fixture: ComponentFixture<GlycanSearchResultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlycanSearchResultsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlycanSearchResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
