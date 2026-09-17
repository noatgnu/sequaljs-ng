import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {MatDialogContent, MatDialogTitle, MatDialogRef, MatDialogActions} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-show-original-size-glycan-image-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './show-original-size-glycan-image-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './show-original-size-glycan-image-dialog.component.scss'
})
export class ShowOriginalSizeGlycanImageDialogComponent {
  @Input() imageUrl: string = "";

  constructor(private dialogRef: MatDialogRef<ShowOriginalSizeGlycanImageDialogComponent>) {
  }

  close() {
    this.dialogRef.close();
  }



}
