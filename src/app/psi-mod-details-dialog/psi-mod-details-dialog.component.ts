import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {UnimodDetailsDialogComponent} from '../unimod-details-dialog/unimod-details-dialog.component';
import {PSIModModification, PSIModService} from '../psi-mod.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-psi-mod-details-dialog',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatButton
  ],
  templateUrl: './psi-mod-details-dialog.component.html',
  styleUrl: './psi-mod-details-dialog.component.scss'
})
export class PSIModDetailsDialogComponent {
  linkedUnimodId?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PSIModModification,
    private dialog: MatDialog,
    private psiModService: PSIModService,
  ) {
    this.linkedUnimodId = this.psiModService.getUnimodId(this.data.id);
  }

  showLinkedUnimod() {
    if (this.linkedUnimodId) {
      this.dialog.closeAll();
      const unimodMod = this.psiModService.findByUnimodId(this.linkedUnimodId);
      if (unimodMod) {
        this.dialog.open(UnimodDetailsDialogComponent, {
          data: unimodMod,
          width: '500px'
        });
      }
    }
  }

}
