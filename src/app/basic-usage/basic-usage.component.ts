import { Component } from '@angular/core';
import {MatInput} from '@angular/material/input';
import { Sequence } from 'sequaljs/dist/sequence';
import {MatCardHeader, MatCard, MatCardTitle, MatCardContent} from '@angular/material/card';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';


@Component({
  selector: 'app-basic-usage',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatInput,
    MatList,
    MatListItem,
    FormsModule,
    MatLabel,
    MatFormField
  ],
  templateUrl: './basic-usage.component.html',
  styleUrl: './basic-usage.component.scss'
})
export class BasicUsageComponent {
  basicExample = 'ELVIS[Phospho]K';
  parsedSequence: any;
  output: string = '';

  codeExamples = {
    installation: `npm install sequaljs`,
    importExample: `import { Sequence } from 'sequaljs';`,
    basicParsing: `// Parse a simple peptide with modification
const seq = Sequence.fromProforma('ELVIS[Phospho]K');
console.log(seq.seq[4].value); // "S"
console.log(seq.seq[4].mods[0].modValue.primaryValue); // "Phospho"`,
    basicOutput: `// Convert back to ProForma notation
console.log(seq.toProforma()); // "ELVIS[Phospho]K"`
  };

  constructor() { }

  ngOnInit(): void {
    this.parseSequence();
  }

  parseSequence(): void {
    try {
      this.parsedSequence = Sequence.fromProforma(this.basicExample);
      this.output = `Sequence: ${this.basicExample}

Parsed information:
- Base sequence: ${this.parsedSequence.toStrippedString()}
- Modified residue: ${this.parsedSequence.seq[4].value}
- Modification name: ${this.parsedSequence.seq[4].mods[0].modValue.primaryValue}
- Regenerated ProForma: ${this.parsedSequence.toProforma()}`;
    } catch (error) {
      this.output = `Error parsing sequence: ${error}`;
    }
  }

  updateSequence(): void {
    this.parseSequence();
  }

}
