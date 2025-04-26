import { Component } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {UnimodModification} from '../unimod.service';
import {Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-unimod-details-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './unimod-details-dialog.component.html',
  styleUrl: './unimod-details-dialog.component.scss'
})
export class UnimodDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UnimodModification) {}
}
