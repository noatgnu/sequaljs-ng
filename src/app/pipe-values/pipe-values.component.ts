import { Component, OnInit } from '@angular/core';
import { Sequence } from 'sequaljs/dist/sequence';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pipe-values',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './pipe-values.component.html',
  styleUrls: ['./pipe-values.component.scss']
})
export class PipeValuesComponent implements OnInit {
  sequenceExamples: {[key: string]: string} = {
    basic: 'ELVIS[INFO:newly discovered]K',
    withMod: 'ELVIS[Phospho|INFO:newly discovered]K',
    localization: 'PEPT[U:Phospho#g1(0.75)|+79.966]KIDE',
    multiple: 'PEPT[U:Phospho#1(0.75)|+79.966|INFO:newly discovered]KIDE',
    complex: 'PEP[U:Deamidation|+0.984]T[U:Phospho#g1(0.75)|+79.966]K[XL:DSS#XL2]IDE',
    withGlobal: "<[Carbamidomethyl|INFO:Global modification]@C>PEPTCDE"
  };

  currentSequence = this.sequenceExamples['basic'];
  sequenceResult = '';

  private _customSequence: string = '';
  set customSequence(value: string) {
    this._customSequence = value;
    this.parseCustomSequence();
  }
  get customSequence(): string {
    return this._customSequence;
  }

  codeExamples: {[key: string]: string} = {
    parsing: `// Parse a sequence with pipe values
import { Sequence } from 'sequaljs/dist/sequence';

// Parse a sequence with confidence score
const seq = Sequence.fromProforma("PEPT[Phospho#g1(0.75)|+79.966]KIDE");

// Access pipe modification at the 4th position
const mods = seq.seq[3].mods;

// Extract the first modification in the pipe
const firstMod = mods[0];
if (firstMod.modValue.localizationScore) {
  console.log(\`Confidence score: \${firstMod.modValue.localizationScore}\`);
}`,

    adding: `// Adding pipe values to a sequence
import { Sequence } from 'sequaljs/dist/sequence';
import { Modification, PipeValue } from 'sequaljs/dist/modification';

// Create a sequence
const seq = new Sequence("PEPTIDE");

// Add confidence score and mass delta as pipe values
const mod = new Modification("Phospho#g1(0.75)|+79.966");
seq.seq[3].push(Modification);

// Add additional info pipe value
const pipeValue = new PipeValue("Newly discovered", "info');
seq.seq[3].mods[0].pipeValues.push(pipeValue);

const proforma = seq.toProforma();
console.log(proforma); // "PEPT[Phospho#g1(0.75)|+79.966|INFO:Newly discovered]KIDE"`,

    working: `// Working with pipe values
import { Sequence } from 'sequaljs/dist/sequence';

// Parse a sequence with multiple pipe values
const seq = Sequence.fromProforma("PEPT[Phospho#g1(0.75)|+79.966|INFO:Newly discovered]KIDE");

// Access the modification at the 4th position
const modValue = seq.seq[3].mods[3].modValue;

// Access the first pipe value, which is an possible position of Phospho modification with localization at 0.75
console.log(modValue.pipeValues[0].localizationScore); // 0.75
console.log(modValue.pipeValues[0].ambiguityGroup); // g1
console.log(modValue.pipeValues[0].value); // Phospho

// Access the second pipe value, which is a mass delta of +79.966
console.log(modValue.pipeValues[1].mass); // +79.966

// Access the third pipe value, which is an info string
console.log(modValue.pipeValues[2].value); // Newly discovered`
  };

  ngOnInit(): void {
    this.parseSequence(this.currentSequence);
  }

  parseSequence(sequence: string): void {
    try {
      const seq = Sequence.fromProforma(sequence);
      const pipeInfoArray: any[] = [];
      // Extract pipe values information
      for (const mod of seq.globalMods) {
        const pipeValues = mod.modValue.pipeValues.map((pv: any) => ({
          localizationScore: pv.localizationScore,
          mass: pv.mass,
          value: pv.value,
          ambiguityGroup: pv.ambiguityGroup,
        }));
        pipeInfoArray.push({
          position: 0,
          pipeValues
        });
      }
      const nTermMods = seq.mods.get(-1);
      if (nTermMods) {
        for (const mod of nTermMods) {
          const pipeValues = mod.modValue.pipeValues.map((pv: any) => ({
            localizationScore: pv.localizationScore,
            mass: pv.mass,
            value: pv.value,
            ambiguityGroup: pv.ambiguityGroup,
          }));
          pipeInfoArray.push({
            position: 0,
            pipeValues
          });
        }

      }
      const cTermMods = seq.mods.get(-2);
      if (cTermMods) {
        for (const mod of cTermMods) {
          const pipeValues = mod.modValue.pipeValues.map((pv: any) => ({
            localizationScore: pv.localizationScore,
            mass: pv.mass,
            value: pv.value,
            ambiguityGroup: pv.ambiguityGroup,
          }));
          pipeInfoArray.push({
            position: 0,
            pipeValues
          });
        }

      }
      const labileMods = seq.mods.get(-3);
      if (labileMods) {
        for (const mod of labileMods) {
          const pipeValues = mod.modValue.pipeValues.map((pv: any) => ({
            localizationScore: pv.localizationScore,
            mass: pv.mass,
            value: pv.value,
            ambiguityGroup: pv.ambiguityGroup,
          }));
          pipeInfoArray.push({
            position: 0,
            pipeValues
          });
        }
      }

      const unknownPosMods = seq.mods.get(-4);
      if (unknownPosMods) {
        for (const mod of unknownPosMods) {
          const pipeValues = mod.modValue.pipeValues.map((pv: any) => ({
            localizationScore: pv.localizationScore,
            mass: pv.mass,
            value: pv.value,
            ambiguityGroup: pv.ambiguityGroup,
          }));
          pipeInfoArray.push({
            position: 0,
            pipeValues
          });
        }

      }
      for (const aa of seq.seq) {
        if (aa.mods.length >0) {
          for (const mod of aa.mods) {
            const pipeValues = mod.modValue.pipeValues.map((pv: any) => ({
              localizationScore: pv.localizationScore,
              mass: pv.mass,
              value: pv.value,
              ambiguityGroup: pv.ambiguityGroup,
            }));
            pipeInfoArray.push({
              position: aa.position,
              pipeValues
            });
          }
        }
      }

      this.sequenceResult = JSON.stringify(pipeInfoArray, null, 2);
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
