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
    aIon: 'PEPTIDE-[a-type-ion]',
    cIon: 'PEPTIDE-[c-type-ion]',
    zIon: 'PEPTIDE-[z-type-ion]',
    withMods: 'PEPS[Phospho]TIDE-[b-type-ion]',
    withCharge: 'PEPTIDE-[y-type-ion]/2'
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

// Ion type notation is C-terminal only
const seq = Sequence.fromProforma("PEPTIDE-[b-type-ion]");

const cTermMods = seq.mods.get(-2);
if (cTermMods) {
  cTermMods.forEach(mod => {
    console.log(\`Is ion type: \${mod.isIonType}\`);
    console.log(\`Ion name: \${mod.modValue.primaryValue}\`);
  });
}

console.log(seq.toProforma()); // "PEPTIDE-[b-type-ion]"`,
    adding: `import { Sequence } from 'sequaljs/dist/sequence';
import { Modification } from 'sequaljs/dist/modification';
import { ModificationValue } from 'sequaljs/dist/modification';

const seq = new Sequence("PEPTIDE");

// Create ion type modification (C-terminal only)
const ionMod = new Modification();
ionMod.modValue = new ModificationValue("b-type-ion");
ionMod.isIonType = true;

// Add to C-terminal position (-2)
if (!seq.mods.has(-2)) {
  seq.mods.set(-2, []);
}
seq.mods.get(-2)!.push(ionMod);

console.log(seq.toProforma()); // "PEPTIDE-[b-type-ion]"`,
    withMods: `import { Sequence } from 'sequaljs/dist/sequence';

// Ion notation with other modifications
const seq = Sequence.fromProforma("PEPS[Phospho]TIDE-[b-type-ion]");

const cTermMods = seq.mods.get(-2);
if (cTermMods) {
  cTermMods.forEach(mod => {
    if (mod.isIonType) {
      console.log(\`Ion type: \${mod.modValue.primaryValue}\`);
    }
  });
}

console.log(seq.toProforma());`,
    withCharge: `import { Sequence } from 'sequaljs/dist/sequence';

// Ion notation with charge state
const seq = Sequence.fromProforma("PEPTIDE-[y-type-ion]/2");

console.log('Charge:', seq.charge); // 2

const cTermMods = seq.mods.get(-2);
if (cTermMods) {
  console.log('Ion type:', cTermMods[0].modValue.primaryValue);
}

console.log(seq.toProforma()); // "PEPTIDE-[y-type-ion]/2"`
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
        ionTypes: []
      };

      // Ion type notation is C-terminal only
      const cTermMods = this.parsedSequence.mods.get(-2);
      if (cTermMods) {
        cTermMods.forEach((mod: any) => {
          if (mod.isIonType) {
            ionInfo.ionTypes.push({
              ionType: mod.modValue.primaryValue,
              position: 'C-terminal',
              isIonType: mod.isIonType
            });
          }
        });
      }

      const result: any = {
        ionNotation: ionInfo,
        proforma: this.parsedSequence.toProforma()
      };

      if (this.parsedSequence.charge) {
        result.charge = this.parsedSequence.charge;
      }

      this.output = JSON.stringify(result, null, 2);
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
