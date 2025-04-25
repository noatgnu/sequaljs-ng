import { Component } from '@angular/core';
import { ModificationValue } from 'sequaljs/dist/modification';
import { Modification } from 'sequaljs/dist/modification';
import { Sequence } from 'sequaljs/dist/sequence';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-chimeric-spectra',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatList,
    MatListItem,
    MatTable,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatButton,
    MatRow,
    MatRowDef,
    MatCell,
    MatTab,
    MatTabGroup,
    MatDivider,
    MatIcon,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonToggle,
    MatButtonToggleGroup
  ],
  templateUrl: './chimeric-spectra.component.html',
  styleUrls: ['./chimeric-spectra.component.scss']
})
export class ChimericSpectraComponent {
  sequenceExamples: {[key: string]: string} = {
    single: 'PEPTIDE/2',
    singleWithSpecies: 'PEPTIDE/2[+Na+]',
    multiple: 'PEPTIDE/2+PEPTIDE/2[+Na+]',
    complex: '[Acetyl]-PEPS[Phospho]TIDE-[Amidated]/2[+Na+]'
  };

  currentSequence = this.sequenceExamples['single'];
  sequenceResult = '';

  private _customSequence: string = '';
  set customSequence(value: string) {
    this._customSequence = value;
    this.parseCustomSequence();
  }
  get customSequence(): string {
    return this._customSequence;
  }

  constructor() { }

  terminalCode: {[key: string]: string} = {
    parsing: `// Parse a sequence with charges data
import { Sequence } from 'sequaljs/dist/sequence';

// +2 proton peptide sequence
const seq = Sequence.fromProforma("PEPTIDE/2");

// Access N-terminal modifications
const charge = seq.charge;
if (charge) {
  console.log(\`Charge: \${charge}\`);
}`, adding: `// Adding charge and ionic species to a sequence
import { Sequence } from 'sequaljs/dist/sequence';

// Create a sequence
const seq = new Sequence("PEPTIDE");

seq.charge = 2; // Set the charge to +2
seq.isChimeric = true; // Set the sequence as chimeric
// Add N-terminal acetylation
seq.ionicSpecies = "+Na+"

const proforma = seq.toProforma();
console.log(proforma); // "PEPTIDE/2[+Na+]"`,
    chimeric: `import { Sequence } from 'sequaljs/dist/sequence';

// Create a chimeric sequence
const seq1 = new Sequence("PEPTIDE");
const seq2 = new Sequence("PEPTIDE");

seq1.isChimeric = true; // Set the sequence as chimeric
seq1.charge = 2; // Set the charge to +2
seq2.isChimeric = true; // Set the sequence as chimeric
seq2.charge = 2; // Set the charge to +2
seq1.ionicSpecies = "+Na+"; // Set the ionic species to +Na+

const seq1.peptidoforms = [seq1, seq2]; // Add the chimeric sequence to the peptidoforms
const proforma = seq1.toProforma();
console.log(proforma); // "PEPTIDE/2[+Na+]+PEPTIDE/2";
`

  }
  ngOnInit(): void {
    this.parseSequence(this.currentSequence);
  }

  parseSequence(sequence: string): void {
    try {
      const seq = Sequence.fromProforma(sequence);

      // Get charges and species info
      const sequenceInfo: any[] = []

      for (const p of seq.peptidoforms) {
        const ionInfo: any = {
          charge: p.charge,
          ionicSpecies: p.ionicSpecies,
          isChimeric: p.isChimeric,
          sequence: p.toStrippedString()
        }
        sequenceInfo.push(ionInfo);
      }

      this.sequenceResult = JSON.stringify({
        chargeInfo: sequenceInfo,
        proformaOutput: seq.toProforma()
      }, null, 2);
    } catch (error) {
      this.sequenceResult = `Error parsing sequence: ${error}`;
    }
  }

  setSequenceExample(key: string): void {
    this.currentSequence = this.sequenceExamples[key];
    this.parseSequence(this.currentSequence);
  }

  parseCustomSequence(): void {
    if (this.customSequence.trim()) {
      this.currentSequence = this.customSequence.trim();
      this.parseSequence(this.currentSequence);
    }
  }
}
