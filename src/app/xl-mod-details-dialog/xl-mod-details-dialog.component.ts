import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {XLModEntity} from '../xl-mod.service';

@Component({
  selector: 'app-xl-mod-details-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './xl-mod-details-dialog.component.html',
  styleUrl: './xl-mod-details-dialog.component.scss'
})
export class XLModDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: XLModEntity) {}
}
