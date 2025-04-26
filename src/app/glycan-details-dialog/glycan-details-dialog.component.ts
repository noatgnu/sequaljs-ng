import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { GlycanDetails } from '../glycan.service';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ShowGlycanComponent} from '../show-glycan/show-glycan.component';

@Component({
  selector: 'app-glycan-details-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatIcon,
    ShowGlycanComponent
  ],
  templateUrl: './glycan-details-dialog.component.html',
  styleUrl: './glycan-details-dialog.component.scss'
})
export class GlycanDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: GlycanDetails) {}
}
