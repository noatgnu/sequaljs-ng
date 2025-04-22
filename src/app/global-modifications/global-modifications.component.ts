import { Component, OnInit } from '@angular/core';
import { Sequence } from 'sequaljs/dist/sequence';
import {MatCard, MatCardHeader, MatCardTitle, MatCardContent} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-global-modifications',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatButtonToggleGroup,
    MatTab,
    MatList,
    MatListItem,
    MatDivider,
    MatTabGroup,
    MatButtonToggle
  ],
  templateUrl: './global-modifications.component.html',
  styleUrl: './global-modifications.component.scss'
})
export class GlobalModificationsComponent implements OnInit {
  examples: {[key: string]: string} = {
    globalMod: '<[Carbamidomethyl]@C>PEPTCDE',
    multipleMods: '<[Carbamidomethyl]@C><[Oxidation]@M>PEPTCMEK',
    isotopeLabel: '<13C6>PEPTIDERK'
  };

  currentExample: string = this.examples['globalMod'];
  parsedSequence: any;
  output: string = '';

  constructor() { }

  ngOnInit(): void {
    this.parseExample();
  }

  setExample(example: string): void {
    this.currentExample = this.examples[example];
    this.parseExample();
  }

  parseExample(): void {
    try {
      this.parsedSequence = Sequence.fromProforma(this.currentExample);
      const globalModsInfo = this.parsedSequence.globalMods.map((mod: any, index: number) => {
        return {
          index,
          modValue: mod.modValue.primaryValue,
          targets: mod.targetResidues.join(','),
          source: mod.source || 'N/A',
          formula: mod.modValue.pipeValues.some((pv: any) => pv.isValidFormula) ? 'Yes' : 'No'
        };
      });

      this.output = JSON.stringify({
        globalMods: globalModsInfo,
        proforma: this.parsedSequence.toProforma(),
        sequence: this.parsedSequence.toStrippedString()
      }, null, 2);
    } catch (error) {
      this.output = `Error parsing sequence: ${error}`;
    }
  }
}
