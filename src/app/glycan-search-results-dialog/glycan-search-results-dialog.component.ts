import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { GlycanListItem } from '../glycan.service';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface GlycanSearchResultsDialogData {
  results: GlycanListItem[];
  searchTerm: string;
  resultCount: number;
  listId: string;
}

@Component({
  selector: 'app-glycan-search-results-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    MatProgressSpinner,
    DecimalPipe,
    MatIcon
  ],
  templateUrl: './glycan-search-results-dialog.component.html',
  styleUrl: './glycan-search-results-dialog.component.scss',
})
export class GlycanSearchResultsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GlycanSearchResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GlycanSearchResultsDialogData
  ) {}

  onSelectGlycan(glycan: GlycanListItem): void {
    this.dialogRef.close(glycan);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getGlyGenUrl(): string {
    return `https://glygen.org/glycan-list/${this.data.listId}`;
  }
}
