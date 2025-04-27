import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import {GlobalModification, Modification} from 'sequaljs/dist/modification';
import {DisplayModComponent} from '../../display-mod/display-mod.component';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatTooltip} from '@angular/material/tooltip';
import {NgClass} from '@angular/common';
import {Sequence} from 'sequaljs/dist/sequence';
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-parser-result',
  imports: [
    DisplayModComponent,
    MatTooltip,
    MatProgressSpinner,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatButton,
    MatIconButton
  ],
  templateUrl: './parser-result.component.html',
  styleUrl: './parser-result.component.scss'
})
export class ParserResultComponent {
  @ViewChild('sequenceContainer') sequenceContainer: ElementRef|undefined;
  private _sequence: Sequence|undefined = undefined
  isExporting = false;
  globalFixedModsMap: {[residue: string]: Modification[]} = {}
  sequenceAmbiguousResidues: string[] = []

  get sequence(): Sequence|undefined {
    return this._sequence
  }
  @Input() printMode = false;
  @Input() set sequence(value: Sequence|undefined) {
    this._sequence = value
    console.log(value)
    if (this._sequence) {
      this.globalFixedModsMap = {}
      this._sequence.globalMods.forEach((mod: GlobalModification) => {
        if (mod.globalModType === "fixed" && mod.targetResidues) {
          for (const t of mod.targetResidues) {
            if (!this.globalFixedModsMap[t]) {
              this.globalFixedModsMap[t] = []
            }
            this.globalFixedModsMap[t].push(mod)
          }
        }
      })
      this._sequence.sequenceAmbiguities.forEach(amigui => {
        for (const t of amigui.value) {
          this.sequenceAmbiguousResidues.push(t)
        }
      })
    }
  }

  exportAsPNG() {
    if (!this.sequenceContainer) return;
    const container = this.sequenceContainer.nativeElement;
    this.isExporting = true;

    // Create an off-screen container with proper styling
    const offScreenContainer = document.createElement('div');
    offScreenContainer.style.position = 'absolute';
    offScreenContainer.style.left = '-9999px';
    offScreenContainer.style.top = '0';
    offScreenContainer.style.width = 'max-content';
    offScreenContainer.style.height = 'max-content';
    offScreenContainer.style.overflow = 'visible';
    offScreenContainer.style.backgroundColor = '#ffffff';

    // Clone the sequence container content
    const clone = container.cloneNode(true);
    offScreenContainer.appendChild(clone);
    document.body.appendChild(offScreenContainer);

    // Get the exact dimensions of the cloned content
    const fullWidth = clone.scrollWidth;
    const fullHeight = clone.scrollHeight;

    // Capture the entire sequence
    html2canvas(clone, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: true, // Temporarily enable for debugging
      allowTaint: true,
      useCORS: true,
      width: fullWidth,
      height: fullHeight,
      imageTimeout: 0,
      foreignObjectRendering: true
    }).then(canvas => {
      // Save the image
      canvas.toBlob(blob => {
        if (blob) {
          saveAs(blob, `proforma-sequence-${Date.now()}.png`);
        }
        // Clean up
        document.body.removeChild(offScreenContainer);
        this.isExporting = false;
      });
    }).catch(error => {
      console.error('Error generating PNG:', error);
      document.body.removeChild(offScreenContainer);
      this.isExporting = false;
    });
  }

  openPrintablePage() {
    if (!this.sequence) return;

    const proformaString = this.sequence.toProforma();
    window.open(`/#/printable/?seq=${encodeURIComponent(proformaString)}`, '_blank');
  }
}
