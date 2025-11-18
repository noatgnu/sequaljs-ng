import { Component, OnInit } from '@angular/core';
import { Sequence } from 'sequaljs/dist/sequence';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ParserResultComponent} from '../parser/parser-result/parser-result.component';

@Component({
  selector: 'app-named-entities',
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
    MatButtonToggle,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    ParserResultComponent
  ],
  templateUrl: './named-entities.component.html',
  styleUrl: './named-entities.component.scss',
})
export class NamedEntitiesComponent implements OnInit {
  examples: {[key: string]: string} = {
    peptidoform: '(>TMT-labeled peptide)PEPTIDEK',
    peptidoformIon: '(>>Precursor z=2)PEPTIDEK/2',
    compoundIon: '(>>>Chimeric Spectrum 1234)PEPTIDEK/2',
    all: '(>>>Chimeric Spectrum 1234)(>>Precursor z=2)(>Phospho-peptide)PEPS[Phospho]T/2',
    withMods: '(>TMT-labeled peptide)<[TMT6plex]@K,N-term>PEPTIDEK/2',
    chimeric: '(>>>MS2 Scan 5678)(>>First component z=2)(>Component A)PEPTIDE/2+(>>Second component z=3)(>Component B)ANOTHER/3'
  };

  currentExample: string = this.examples['peptidoform'];
  parsedSequence: any;
  output: string = '';

  private _customSequence: string = '';
  set customSequence(value: string) {
    this._customSequence = value;
    this.parseCustomSequence();
  }
  get customSequence(): string {
    return this._customSequence;
  }

  namedCode: {[key: string]: string} = {
    peptidoform: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("(>TMT-labeled peptide)PEPTIDEK");

console.log(\`Peptidoform name: \${seq.peptidoformName}\`);
console.log(\`Sequence: \${seq.toStrippedString()}\`);
console.log(\`ProForma: \${seq.toProforma()}\`);`,
    peptidoformIon: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("(>>Precursor z=2)PEPTIDEK/2");

console.log(\`Peptidoform Ion name: \${seq.peptidoformIonName}\`);
console.log(\`Charge: \${seq.charge}\`);
console.log(\`ProForma: \${seq.toProforma()}\`);`,
    compoundIon: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("(>>>Chimeric Spectrum 1234)PEPTIDEK/2");

console.log(\`Compound Ion name: \${seq.compoundIonName}\`);
console.log(\`ProForma: \${seq.toProforma()}\`);`,
    all: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma(
  "(>>>Chimeric Spectrum 1234)(>>Precursor z=2)(>Phospho-peptide)PEPS[Phospho]T/2"
);

console.log(\`Compound Ion: \${seq.compoundIonName}\`);
console.log(\`Peptidoform Ion: \${seq.peptidoformIonName}\`);
console.log(\`Peptidoform: \${seq.peptidoformName}\`);
console.log(\`Sequence: \${seq.toStrippedString()}\`);
console.log(\`Charge: \${seq.charge}\`);`,
    adding: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = new Sequence("PEPTIDEK");

seq.peptidoformName = "TMT-labeled peptide";
seq.peptidoformIonName = "Precursor z=2";
seq.compoundIonName = "Chimeric Spectrum 1234";
seq.charge = 2;

console.log(seq.toProforma());
// "(>>>Chimeric Spectrum 1234)(>>Precursor z=2)(>TMT-labeled peptide)PEPTIDEK/2"`
  };

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

      const entityInfo: any = {
        sequence: this.parsedSequence.toStrippedString(),
        peptidoformName: this.parsedSequence.peptidoformName || null,
        peptidoformIonName: this.parsedSequence.peptidoformIonName || null,
        compoundIonName: this.parsedSequence.compoundIonName || null,
        charge: this.parsedSequence.charge || null,
        isChimeric: this.parsedSequence.isChimeric || false
      };

      if (this.parsedSequence.isChimeric && this.parsedSequence.peptidoforms.length > 0) {
        entityInfo.peptidoforms = this.parsedSequence.peptidoforms.map((pep: any) => ({
          sequence: pep.toStrippedString(),
          peptidoformName: pep.peptidoformName || null,
          peptidoformIonName: pep.peptidoformIonName || null,
          charge: pep.charge || null
        }));
      }

      this.output = JSON.stringify({
        namedEntities: entityInfo,
        proforma: this.parsedSequence.toProforma()
      }, null, 2);
    } catch (error) {
      this.output = `Error parsing sequence: ${error}`;
    }
  }

  parseCustomSequence(): void {
    if (this.customSequence.trim()) {
      this.currentExample = this.customSequence.trim();
      this.parseExample();
    }
  }
}
