import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-parser-result',
  imports: [
    DisplayModComponent,
    MatTooltip,
  ],
  templateUrl: './parser-result.component.html',
  styleUrl: './parser-result.component.scss'
})
export class ParserResultComponent {
  private _sequence: Sequence|undefined = undefined
  get sequence(): Sequence|undefined {
    return this._sequence
  }
  @Input() set sequence(value: Sequence|undefined) {
    this._sequence = value
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
  globalFixedModsMap: {[residue: string]: Modification[]} = {}
  sequenceAmbiguousResidues: string[] = []

}
