import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {PSIModModification} from '../psi-mod.service';

export interface ResidDialogData {
  residId: string;
  psiMod?: PSIModModification;
}

@Component({
  selector: 'app-resid-details-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton
  ],
  templateUrl: './resid-details-dialog.component.html',
  styleUrl: './resid-details-dialog.component.scss'
})
export class RESIDDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ResidDialogData) {}
}
