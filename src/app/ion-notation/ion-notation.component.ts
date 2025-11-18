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
  selector: 'app-ion-notation',
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
  templateUrl: './ion-notation.component.html',
  styleUrl: './ion-notation.component.scss',
})
export class IonNotationComponent implements OnInit {
  examples: {[key: string]: string} = {
    bIon: 'PEPTIDE-[b-type-ion]',
    yIon: 'PEPTIDE-[y-type-ion]',
    aIon: '[a-type-ion]-PEPTIDE',
    cIon: 'PEPTIDE-[c-type-ion]',
    multiple: '[a-type-ion]-PEPTIDE-[y-type-ion]',
    withMods: '[a-type-ion]-PEPS[Phospho]TIDE-[b-type-ion]'
  };

  currentExample: string = this.examples['bIon'];
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

  ionCode: {[key: string]: string} = {
    parsing: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("PEPTIDE-[b-type-ion]");

const cTermMods = seq.mods.get(-2);
if (cTermMods) {
  cTermMods.forEach(mod => {
    console.log(\`Is ion type: \${mod.isIonType}\`);
    console.log(\`Ion name: \${mod.modValue.primaryValue}\`);
  });
}

console.log(seq.toProforma());`,
    adding: `import { Sequence } from 'sequaljs/dist/sequence';
import { Modification } from 'sequaljs/dist/modification';
import { ModificationValue } from 'sequaljs/dist/modification';

const seq = new Sequence("PEPTIDE");

const ionMod = new Modification();
ionMod.modValue = new ModificationValue("b-type-ion");
ionMod.isIonType = true;

if (!seq.mods.has(-2)) {
  seq.mods.set(-2, []);
}
seq.mods.get(-2)!.push(ionMod);

console.log(seq.toProforma());`,
    nTerminal: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("[a-type-ion]-PEPTIDE");

const nTermMods = seq.mods.get(-1);
if (nTermMods) {
  nTermMods.forEach(mod => {
    if (mod.isIonType) {
      console.log(\`N-terminal ion: \${mod.modValue.primaryValue}\`);
    }
  });
}`,
    both: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("[a-type-ion]-PEPTIDE-[y-type-ion]");

const nTermMods = seq.mods.get(-1);
const cTermMods = seq.mods.get(-2);

if (nTermMods) {
  console.log(\`N-terminal: \${nTermMods[0].modValue.primaryValue}\`);
}
if (cTermMods) {
  console.log(\`C-terminal: \${cTermMods[0].modValue.primaryValue}\`);
}`
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

      const ionInfo: any = {
        sequence: this.parsedSequence.toStrippedString(),
        nTerminalIons: [],
        cTerminalIons: []
      };

      const nTermMods = this.parsedSequence.mods.get(-1);
      if (nTermMods) {
        nTermMods.forEach((mod: any) => {
          if (mod.isIonType) {
            ionInfo.nTerminalIons.push({
              ionType: mod.modValue.primaryValue,
              isIonType: mod.isIonType
            });
          }
        });
      }

      const cTermMods = this.parsedSequence.mods.get(-2);
      if (cTermMods) {
        cTermMods.forEach((mod: any) => {
          if (mod.isIonType) {
            ionInfo.cTerminalIons.push({
              ionType: mod.modValue.primaryValue,
              isIonType: mod.isIonType
            });
          }
        });
      }

      this.output = JSON.stringify({
        ionNotation: ionInfo,
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
