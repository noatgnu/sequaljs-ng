import { Component } from '@angular/core';
import { ModificationValue } from 'sequaljs/dist/modification';
import { Sequence } from 'sequaljs/dist/sequence';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-glycan-validation',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTable,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatCell,
    MatCellDef,
    MatRowDef,
    MatList,
    MatListItem,
    MatDivider,
    MatRow,
    MatColumnDef,
    MatTab,
    MatTabGroup,
    FormsModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption
  ],
  templateUrl: './glycan-validation.component.html',
  styleUrl: './glycan-validation.component.scss'
})
export class GlycanValidationComponent {
  glycanExamples: {[key: string]: string} = {
    valid1: 'HexNAc(1)Hex(3)NeuAc(2)',
    valid2: 'Fuc(1)HexNAc(2)Hex(8)',
    valid3: 'HexNAc(2)Hex(5)NeuAc(2)',
    valid4: 'Hex',
    valid5: 'HexNAc2Hex',
    custom1: '{C8H13N1O5}1Hex2',
    custom2: '{C11H17N1O9}2Hex3HexNAc2',
    customIsotope: '{C8H13[15N1]O5}2Hex1',
    customCharged: '{C8H13N1O5Na1:z+1}2Hex1HexNAc1',
    invalid1: 'HexNAc(A)Hex(3)',
    invalid2: 'Hex%NeuAc(2)',
    invalid3: 'HexNAcHex',
    invalid4: '{C8H13N1O5}Hex2'
  };

  sequenceExamples: {[key: string]: string} = {
    labile: '{Glycan:HexNAc(2)Hex(5)}PEPTIDEK',
    attached: 'PEPTN[GNO:G59626AS]IDEK',
    custom: 'PEPTN[Glycan:HexNAc(1)Hex(3)]IDEK',
    customMono: 'N[Glycan:{C8H13N1O5}1Hex2]PEPTIDE',
    customLabile: '{Glycan:{C8H13N1O5}1Hex2}PEPTIDE',
    customIsotope: 'N[Glycan:{C8H13[15N1]O5}2Hex1]PEPTIDE',
    customCharged: 'N[Glycan:{C8H13N1O5Na1:z+1}2Hex1HexNAc1]K'
  };

  private _customGlycan = '';
  set customGlycan(glycan: string) {
    this._customGlycan = glycan;
    this.validateCustomGlycan();
  }

  get customGlycan(): string {
    return this._customGlycan;
  }
  private _customSequence = '';
  set customSequence(sequence: string) {
    this._customSequence = sequence;
    this.parseCustomSequence();
  }
  get customSequence(): string {
    return this._customSequence;
  }
  currentGlycan = this.glycanExamples['valid1'];
  currentSequence = this.sequenceExamples['labile'];
  selectedGlycanExample = 'valid1';
  selectedSequenceExample = 'labile';
  validationResult = '';
  sequenceResult = '';

  glycanCode: {[key: string]: string} = {
    customMono: `// ProForma 2.1: Custom monosaccharides
import { Sequence } from 'sequaljs/dist/sequence';

// Custom monosaccharide notation using chemical formula in braces
const seq = Sequence.fromProforma("N[Glycan:{C8H13N1O5}1Hex2]PEPTIDE");

const mod = seq.seq[0].mods[0];
console.log(\`Source: \${mod.modValue.source}\`); // "Glycan"
console.log(\`Value: \${mod.modValue.primaryValue}\`); // "{C8H13N1O5}1Hex2"
console.log(\`Is valid glycan: \${mod.modValue.pipeValues[0].isValidGlycan}\`); // true

// Mixed custom and standard monosaccharides
const seq2 = Sequence.fromProforma("N[Glycan:{C11H17N1O9}2Hex3HexNAc2]PEPTIDE");
console.log(seq2.seq[0].mods[0].modValue.pipeValues[0].isValidGlycan); // true

// Custom monosaccharides with isotopes
const seq3 = Sequence.fromProforma("N[Glycan:{C8H13[15N1]O5}2Hex1]PEPTIDE");
console.log(seq3.seq[0].mods[0].modValue.pipeValues[0].isValidGlycan); // true`,
    findAll: `// Find all glycans in a sequence
function findAllGlycans(seq) {
  const glycans = [];

  // Check for labile glycans
  const labileMods = seq.mods.get(-3);
  if (labileMods) {
    labileMods.forEach(mod => {
      if (mod.source === 'Glycan') {
        glycans.push({
              type: 'labile',
              value: mod.modValue.primaryValue,
              isValid: mod.modValue.pipeValues[0].isValidGlycan || false
        });
      }
    });
  }

  // Check for attached glycans
  for (let i = 0; i < seq.seq.length; i++) {
    const mods = seq.seq[i].mods || [];
    mods.forEach(mod => {
              if (mod.source === 'Glycan' || mod.source === 'GNO') {
        glycans.push({
              type: 'attached',
              position: i,
              residue: seq.seq[i].value,
              source: mod.source,
              value: mod.modValue.primaryValue,
              isValid: mod.modValue.pipeValues[0].isValidGlycan || false
        });
      }
    });
  }

  return glycans;
}

const seq = Sequence.fromProforma("{Glycan:Hex}PEPTN[Glycan:HexNAc(2)]IDE");
console.log(findAllGlycans(seq));`,
    gno: `// Parse sequence with GNO glycan notation
const seq = Sequence.fromProforma("PEPTN[GNO:G59626AS]IDEK");

// Access the N-linked glycan at position 4
const nResidueIndex = 4; // zero-based indexing
const nResidue = seq.seq[nResidueIndex];
// By default, GNO or G source annotation will be given valid glycan status
if (nResidue.mods && nResidue.mods.length > 0) {
  const gnoMod = nResidue.mods[0];
  console.log(\`GNO ID: \${gnoMod.modValue.primaryValue}\`);
  console.log(\`Source: \${gnoMod.source}\`); // Should be "GNO"
  console.log(\`Is valid: \${gnoMod.modValue.pipeValues[0].isValidGlycan}\`);
}`,
    accessLabile: `// Parse sequence with labile glycan
const seq = Sequence.fromProforma("{Glycan:HexNAc(2)Hex(5)}PEPTIDEK");

// Get labile modifications
const labileMods = seq.mods.get(-3);
if (labileMods) {
  labileMods.forEach(mod => {
  if (mod.source === 'Glycan') {
      console.log(\`Glycan: \${mod.modValue.primaryValue}\`);
      console.log(\`Is valid structure: \${mod.modValue.pipeValues[0].isValidGlycan}\`);
    }
  });
}`,
    monoParsing: `// Parse individual monosaccharides from a glycan
function parseMonosaccharides(glycan) {
  const result = [];
  const glycanClean = glycan.replace(/\\s/g, '');
  let i = 0;

  while (i < glycanClean.length) {
    if (glycanClean[i] === '{') {
      const closeBrace = glycanClean.indexOf('}', i);
      if (closeBrace === -1) break;

      const formula = glycanClean.substring(i + 1, closeBrace);
      i = closeBrace + 1;

      const countMatch = glycanClean.substring(i).match(/^((\\([1-9]\\d*\\))|[1-9]\\d*)?/);
      let count = 1;
      if (countMatch && countMatch[0]) {
        const countStr = countMatch[0].replace(/[()]/g, '');
        if (countStr) {
          count = parseInt(countStr);
          i += countMatch[0].length;
        }
      }

      result.push({ type: 'custom', formula: formula, count: count });
    } else {
      const monoMatch = glycanClean.substring(i).match(/^([A-Za-z]+)((\\(([1-9]\\d*)\\))|[1-9]\\d*)?/);
      if (!monoMatch) { i++; continue; }

      const monoType = monoMatch[1];
      let count = 1;
      if (monoMatch[2]) {
        const countStr = monoMatch[2].replace(/[()]/g, '');
        if (countStr) count = parseInt(countStr);
      }

      result.push({ type: monoType, count: count });
      i += monoMatch[0].length;
    }
  }
  return result;
}

const glycanStruct = 'HexNAc(2)Hex(3)NeuAc(1)';
console.log(parseMonosaccharides(glycanStruct));
// [
//   { type: "HexNAc", count: 2 },
//   { type: "Hex", count: 3 },
//   { type: "NeuAc", count: 1 }
// ]

const customGlycan = '{C8H13N1O5}2Hex3HexNAc';
console.log(parseMonosaccharides(customGlycan));
// [
//   { type: "custom", formula: "C8H13N1O5", count: 2 },
//   { type: "Hex", count: 3 },
//   { type: "HexNAc", count: 1 }
// ]`, validatingGlycan: `
// Import the ModificationValue class
import { ModificationValue } from 'sequaljs/dist/modification';

// Validate standard glycan structures
const glycan1 = 'HexNAc(1)Hex(3)NeuAc(2)';
console.log(\`Valid: \${ModificationValue.validateGlycan(glycan1)}\`); // true

// Count can be omitted if monosaccharide is at end
const glycan2 = 'HexNAc2Hex';
console.log(\`Valid: \${ModificationValue.validateGlycan(glycan2)}\`); // true

// Custom monosaccharide with count
const glycan3 = '{C8H13N1O5}1Hex2';
console.log(\`Valid: \${ModificationValue.validateGlycan(glycan3)}\`); // true

// Custom with isotopes
const glycan4 = '{C8H13[15N1]O5}2Hex1';
console.log(\`Valid: \${ModificationValue.validateGlycan(glycan4)}\`); // true

// Invalid: monosaccharide not at end without count
const invalid1 = 'HexNAcHex';
console.log(\`Valid: \${ModificationValue.validateGlycan(invalid1)}\`); // false

// Invalid: custom monosaccharide not at end without count
const invalid2 = '{C8H13N1O5}Hex2';
console.log(\`Valid: \${ModificationValue.validateGlycan(invalid2)}\`); // false`

  }

  constructor() { }

  ngOnInit(): void {
    this.validateGlycan(this.currentGlycan);
    this.parseSequence(this.currentSequence);
  }

  validateGlycan(glycan: string): void {
    try {
      const isValid = ModificationValue.validateGlycan(glycan);
      const monosaccharides = this.extractMonosaccharides(glycan);

      this.validationResult = JSON.stringify({
        glycanStructure: glycan,
        isValid: isValid,
        monosaccharides: monosaccharides
      }, null, 2);
    } catch (error) {
      this.validationResult = JSON.stringify({
        glycanStructure: glycan,
        isValid: false,
        error: `${error}`
      }, null, 2);
    }
  }

  parseSequence(sequence: string): void {
    try {
      const seq = Sequence.fromProforma(sequence);
      const glycans: any = [];

      const labileMods = seq.mods.get(-3);
      if (labileMods) {
        labileMods.forEach(mod => {
          if (mod.source === 'Glycan') {
            glycans.push({
              type: 'labile',
              value: mod.modValue.primaryValue,
              isValid: mod.modValue.pipeValues[0].isValidGlycan || false
            });
          }
        });
      }

      for (let i = 0; i < seq.seq.length; i++) {
        const mods = seq.seq[i].mods || [];
        mods.forEach(mod => {
          if (mod.source === 'Glycan' || mod.source === 'GNO' || mod.source === 'G') {
            glycans.push({
              type: 'attached',
              position: i,
              residue: seq.seq[i].value,
              source: mod.source,
              value: mod.modValue.primaryValue,
              isValid: mod.modValue.pipeValues[0].isValidGlycan || false
            });
          }
        });
      }

      this.sequenceResult = JSON.stringify({
        sequence: seq.toStrippedString(),
        glycans: glycans,
        proformaOutput: seq.toProforma()
      }, null, 2);
    } catch (error) {
      this.sequenceResult = `Error parsing sequence: ${error}`;
    }
  }

  setGlycanExample(key: string): void {
    this.selectedGlycanExample = key;
    this.currentGlycan = this.glycanExamples[key];
    this.validateGlycan(this.currentGlycan);
  }

  setSequenceExample(key: string): void {
    this.selectedSequenceExample = key;
    this.currentSequence = this.sequenceExamples[key];
    this.parseSequence(this.currentSequence);
  }

  onGlycanExampleChange(key: string): void {
    this.setGlycanExample(key);
  }

  onSequenceExampleChange(key: string): void {
    this.setSequenceExample(key);
  }

  validateCustomGlycan(): void {
    if (this.customGlycan.trim()) {
      this.currentGlycan = this.customGlycan.trim();
      this.validateGlycan(this.currentGlycan);
    }
  }

  parseCustomSequence(): void {
    if (this.customSequence.trim()) {
      this.currentSequence = this.customSequence.trim();
      this.parseSequence(this.currentSequence);
    }
  }

  private extractMonosaccharides(glycan: string): any[] {
    const result = [];
    const glycanClean = glycan.replace(/\s/g, '');
    let i = 0;

    while (i < glycanClean.length) {
      if (glycanClean[i] === '{') {
        const closeBrace = glycanClean.indexOf('}', i);
        if (closeBrace === -1) break;

        const formula = glycanClean.substring(i + 1, closeBrace);
        i = closeBrace + 1;

        const countMatch = glycanClean.substring(i).match(/^((\([1-9]\d*\))|[1-9]\d*)?/);
        let count = 1;
        if (countMatch && countMatch[0]) {
          const countStr = countMatch[0].replace(/[()]/g, '');
          if (countStr) {
            count = parseInt(countStr);
            i += countMatch[0].length;
          }
        }

        result.push({
          type: 'custom',
          formula: formula,
          count: count
        });
      } else {
        const monoMatch = glycanClean.substring(i).match(/^([A-Za-z]+)((\(([1-9]\d*)\))|[1-9]\d*)?/);
        if (!monoMatch) {
          i++;
          continue;
        }

        const monoType = monoMatch[1];
        let count = 1;
        if (monoMatch[2]) {
          const countStr = monoMatch[2].replace(/[()]/g, '');
          if (countStr) {
            count = parseInt(countStr);
          }
        }

        result.push({
          type: monoType,
          count: count
        });

        i += monoMatch[0].length;
      }
    }

    return result;
  }

}
