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
  selector: 'app-placement-controls',
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
  templateUrl: './placement-controls.component.html',
  styleUrl: './placement-controls.component.scss',
})
export class PlacementControlsComponent implements OnInit {
  examples: {[key: string]: string} = {
    position: '<[TMT6plex|Position:M,C]@K>MTPEILTCNSIGCLKG',
    limit: '<[Oxidation|Limit:2]@M>MMMMMMMM',
    comkp: '<[Phospho|CoMKP]@S,T,Y>STYPEPTIDE',
    comup: '<[Oxidation|CoMUP]@M>MMMPEPTIDE',
    combined: '<[TMT6plex|Position:M,C|Limit:1|CoMKP]@K,N-term>MTPEILTCNSIGCLKG',
    multiple: '<[TMT6plex|Position:M|Limit:1]@K><[Oxidation|Limit:2]@M>MKPEPTMDE'
  };

  currentExample: string = this.examples['position'];
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

  placementCode: {[key: string]: string} = {
    position: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("<[TMT6plex|Position:M,C]@K>MTPEILTCNSIGCLKG");

const globalMod = seq.globalMods[0];
console.log(\`Modification: \${globalMod.modValue.primaryValue}\`);
console.log(\`Position constraint: \${globalMod.positionConstraint}\`);
console.log(\`Target residues: \${globalMod.targetResidues}\`);`,
    limit: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma("<[Oxidation|Limit:2]@M>MMMMMMMM");

const globalMod = seq.globalMods[0];
console.log(\`Modification: \${globalMod.modValue.primaryValue}\`);
console.log(\`Limit per position: \${globalMod.limitPerPosition}\`);
console.log(\`Target: \${globalMod.targetResidues}\`);`,
    colocalize: `import { Sequence } from 'sequaljs/dist/sequence';

const seq1 = Sequence.fromProforma("<[Phospho|CoMKP]@S,T,Y>STYPEPTIDE");
const seq2 = Sequence.fromProforma("<[Oxidation|CoMUP]@M>MMMPEPTIDE");

console.log(\`CoMKP (Colocalize with Known): \${seq1.globalMods[0].colocalizeKnown}\`);
console.log(\`CoMUP (Colocalize with Unknown): \${seq2.globalMods[0].colocalizeUnknown}\`);`,
    combined: `import { Sequence } from 'sequaljs/dist/sequence';

const seq = Sequence.fromProforma(
  "<[TMT6plex|Position:M,C|Limit:1|CoMKP]@K,N-term>MTPEILTCNSIGCLKG"
);

const globalMod = seq.globalMods[0];
console.log(\`Modification: \${globalMod.modValue.primaryValue}\`);
console.log(\`Position constraint: \${globalMod.positionConstraint}\`);
console.log(\`Limit per position: \${globalMod.limitPerPosition}\`);
console.log(\`CoMKP: \${globalMod.colocalizeKnown}\`);
console.log(\`Targets: \${globalMod.targetResidues}\`);`
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

      const globalModsInfo = this.parsedSequence.globalMods.map((mod: any, index: number) => {
        return {
          index,
          modValue: mod.modValue.primaryValue,
          targets: mod.targetResidues,
          positionConstraint: mod.positionConstraint || null,
          limitPerPosition: mod.limitPerPosition || null,
          colocalizeKnown: mod.colocalizeKnown || false,
          colocalizeUnknown: mod.colocalizeUnknown || false
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

  parseCustomSequence(): void {
    if (this.customSequence.trim()) {
      this.currentExample = this.customSequence.trim();
      this.parseExample();
    }
  }
}
