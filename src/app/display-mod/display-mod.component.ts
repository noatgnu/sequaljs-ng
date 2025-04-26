import {Component, Input} from '@angular/core';
import {Modification} from 'sequaljs/dist/modification';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {ShowGlycanComponent} from '../show-glycan/show-glycan.component';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {UnimodService} from '../unimod.service';
import {PSIModService} from '../psi-mod.service';
import {UnimodDetailsDialogComponent} from '../unimod-details-dialog/unimod-details-dialog.component';
import {PSIModDetailsDialogComponent} from '../psi-mod-details-dialog/psi-mod-details-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {XLModService} from '../xl-mod.service';
import {XLModDetailsDialogComponent} from '../xl-mod-details-dialog/xl-mod-details-dialog.component';
import {RESIDDetailsDialogComponent, ResidDialogData} from '../resid-details-dialog/resid-details-dialog.component';
import {GlycanService} from '../glycan.service';
import {GlycanDetailsDialogComponent} from '../glycan-details-dialog/glycan-details-dialog.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-display-mod',
  imports: [
    MatTooltip,
    ShowGlycanComponent,
    MatIcon,
    MatProgressSpinner
  ],
  templateUrl: './display-mod.component.html',
  styleUrl: './display-mod.component.scss'
})
export class DisplayModComponent {
  @Input() modification: Modification | undefined = undefined;
  glycanLoading: boolean = false;


  constructor(private glycanService: GlycanService, private toast: MatSnackBar, private dialog: MatDialog, private unimodService: UnimodService, private psiModService: PSIModService, private xlModService: XLModService) {
  }

  showUnimodDetails(unimodValue: string): void {
    const numericId = unimodValue.includes(':') ?
      unimodValue.split(':')[1] : unimodValue;

    const modification = this.unimodService.getModification(numericId);

    if (modification) {
      this.dialog.open(UnimodDetailsDialogComponent, {
        data: modification,
        width: '500px'
      });
    } else {
      console.warn(`Unimod modification with ID ${numericId} not found`);
      this.toast.open(`Modification ${numericId} not found`, 'OK', {
        duration: 2000,
        panelClass: 'error-snackbar'
      });
    }
  }

  showPSIModDetails(modValue: string): void {
    const modId = modValue.includes(':') ? modValue : `MOD:${modValue}`;
    const modification = this.psiModService.getModification(modId);

    if (modification) {
      this.dialog.open(PSIModDetailsDialogComponent, {
        data: modification,
        width: '500px'
      });
    } else {
      console.warn(`PSI-MOD modification with ID ${modId} not found`);
      this.toast.open(`Modification ${modId} not found`, 'OK', {
        duration: 2000,
        panelClass: 'error-snackbar'
      });
    }
  }

  showXLModDetails(xlmodValue: string): void {
    const xlmodId = xlmodValue.toUpperCase().includes('XLMOD:') ?
      xlmodValue :
      (xlmodValue.toUpperCase().includes('XL:') ?
        xlmodValue.replace('XL:', 'XLMOD:') :
        `XLMOD:${xlmodValue}`);

    const crosslinker = this.xlModService.getCrosslinker(xlmodId);

    if (crosslinker) {
      this.dialog.open(XLModDetailsDialogComponent, {
        data: crosslinker,
        width: '500px'
      });
    } else {
      console.warn(`XLMOD crosslinker with ID ${xlmodId} not found`);
      this.toast.open(`Crosslinker ${xlmodId} not found`, 'OK', {
        duration: 2000,
        panelClass: 'error-snackbar'
      });
    }
  }

  showRESIDDetails(residueValue: string): void {
    const residueId = residueValue.includes(':') ?
      residueValue.split(':')[1] : residueValue;

    const modification = this.psiModService.getModificationByResid(residueId);

    if (modification) {
      this.dialog.open(RESIDDetailsDialogComponent, {
        data: {residId: residueId, psiMod: modification} as ResidDialogData,
        width: '500px'
      });
    } else {
      console.warn(`RESID modification with ID ${residueId} not found`);
      this.toast.open(`Modification ${residueId} not found`, 'OK', {
        duration: 2000,
        panelClass: 'error-snackbar'
      });
    }
  }

  showSynonymDetails(synonymValue: string): void {
    const searchTerm = synonymValue.trim();

    const psiModMatch = this.psiModService.findModificationsByNameExact(searchTerm);
    if (psiModMatch) {
      this.dialog.open(PSIModDetailsDialogComponent, {
        data: psiModMatch,
        width: '500px'
      });
      return;
    }

    const unimodMatch = this.unimodService.findModificationByNameExact(searchTerm);
    if (unimodMatch) {
      this.dialog.open(UnimodDetailsDialogComponent, {
        data: unimodMatch,
        width: '500px'
      });
      return;
    }

    console.warn(`No modification with name "${searchTerm}" found in PSI-MOD or Unimod`);
    this.toast.open(`Modification "${searchTerm}" not found`, 'OK', {
      duration: 2000,
      panelClass: 'error-snackbar'
    });
  }

  checkIfValueInUnimod(unimodValue: string): boolean {
    const numericId = unimodValue.includes(':') ?
      unimodValue.split(':')[1] : unimodValue;

    return this.unimodService.getModification(numericId) !== undefined;
  }

  checkIfValueInPSIMod(modValue: string): boolean {
    const modId = modValue.includes(':') ? modValue : `MOD:${modValue}`;
    return this.psiModService.getModification(modId) !== undefined;
  }

  checkIfValueInXLMod(xlmodValue: string): boolean {
    const xlmodId = xlmodValue.toUpperCase().includes('XLMOD:') ?
      xlmodValue :
      (xlmodValue.toUpperCase().includes('XL:') ?
        xlmodValue.replace('XL:', 'XLMOD:') :
        `XLMOD:${xlmodValue}`);

    return this.xlModService.getCrosslinker(xlmodId) !== undefined;
  }

  checkIfValueInRESID(residueValue: string): boolean {
    const residueId = residueValue.includes(':') ?
      residueValue.split(':')[1] : residueValue;

    return this.psiModService.getModificationByResid(residueId) !== undefined;
  }

  checkIfValueInSynonym(synonymValue: string): boolean {
    const searchTerm = synonymValue.trim();

    const psiModMatch = this.psiModService.findModificationsByNameExact(searchTerm);
    if (psiModMatch) {
      return true;
    }

    const unimodMatch = this.unimodService.findModificationByNameExact(searchTerm);
    if (unimodMatch) {
      return true;
    }

    return false;
  }

  showGlycanDetails(glycanValue: string): void {
    const gnoId = glycanValue.includes(':') ?
      glycanValue.split(':')[1] : glycanValue;

    if (!gnoId) return;

    this.glycanLoading = true;

    this.glycanService.getGlycanDetails(gnoId).subscribe({
      next: (details) => {
        this.glycanLoading = false;
        if (details) {
          this.dialog.open(GlycanDetailsDialogComponent, {
            data: details,
            width: '600px'
          });
        } else {
          console.warn(`No glycan found with ID: ${gnoId}`);
          this.toast.open(`Glycan ID "${gnoId}" not found`, 'OK', {
            duration: 2000,
            panelClass: 'error-snackbar'
          });
        }
      },
      error: (error) => {
        this.glycanLoading = false;
        console.error(`Error fetching glycan details:`, error);
        this.toast.open(`Error loading glycan details`, 'OK', {
          duration: 2000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  checkIfValueInGlycan(glycanValue: string): boolean|string {
    const gnoId = glycanValue.includes(':') ?
      glycanValue.split(':')[1] : glycanValue;

    return gnoId && (gnoId.startsWith('G') || glycanValue.toUpperCase().startsWith('GNO:'));
  }

}
