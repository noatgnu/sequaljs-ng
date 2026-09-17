import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GlycanSearchResultsDialogComponent, GlycanSearchResultsDialogData } from './glycan-search-results-dialog.component';

describe('GlycanSearchResultsDialogComponent', () => {
  let component: GlycanSearchResultsDialogComponent;
  let fixture: ComponentFixture<GlycanSearchResultsDialogComponent>;

  beforeEach(async () => {
    const mockData: GlycanSearchResultsDialogData = { results: [], searchTerm: '', resultCount: 0, listId: 'test' };
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [GlycanSearchResultsDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
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
