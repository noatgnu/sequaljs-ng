import { Component } from '@angular/core';
import { Sequence} from 'sequaljs/dist/sequence';
import { ModificationValue} from 'sequaljs/dist/modification';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {MatTab, MatTabGroup} from '@angular/material/tabs';


@Component({
  selector: 'app-labile-modifications',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatList,
    MatListItem,
    MatDivider,
    MatTab,
    MatTabGroup
  ],
  templateUrl: './labile-modifications.component.html',
  styleUrl: './labile-modifications.component.scss'
})
export class LabileModificationsComponent {
  examples: {[key: string]: string} = {
    basic: '{Glycan:Hex}EMEVNESPEK',
    multiple: '{Glycan:Hex}{Glycan:NeuAc}EMEVNESPEK',
    complex: '{Glycan:HexNAc(1)Hex(3)NeuAc(2)}NVSKTVAPVSSPK',
    combined: '{Glycan:Hex}EMEVNES[Phospho]PEK'
  };

  glycanExamples: {[key: string]: string} = {
    valid1: 'HexNAc(1)Hex(3)NeuAc(2)',
    valid2: 'Fuc(1)HexNAc(2)Hex(8)',
    invalid1: 'HexNAc(A)Hex(3)',
    invalid2: 'Hex%NeuAc(2)'
  };

  glycanCode: {[key: string]: string} = {
    complex: `// Working with complex glycan structures
const seq = Sequence.fromProforma("{Glycan:HexNAc(1)Hex(3)NeuAc(2)}NVSKTVAPVSSPK");
const labileMods = seq.mods.get(-3);

if (labileMods && labileMods.length > 0) {
  // A complex glycan structure
  const glycan = labileMods[0];
  console.log(\`Complex glycan: \${glycan.modValue.primaryValue}\`);

  // This represents a complex N-glycan with:
  // - 1 HexNAc
  // - 3 Hex
  // - 2 NeuAc
}

// Convert back to ProForma
console.log(seq.toProforma());`, create: `// Create a sequence with labile modifications
const seq = new Sequence("EMEVNESPEK");
const hexMod = new Modification("Hex");
hexMod.source = "Glycan";

// Add to the special -3 position for labile mods
if (!seq.mods.has(-3)) {
  seq.mods.set(-3, []);
}
seq.mods.get(-3).push(hexMod);

// Convert back to ProForma notation
console.log(seq.toProforma()); // Should output "{Glycan:Hex}EMEVNESPEK"`, multiple: `>// Handle multiple labile modifications
const seq = Sequence.fromProforma("{Glycan:Hex}{Glycan:NeuAc}EMEVNESPEK");
const labileMods = seq.mods.get(-3);

if (labileMods) {
  labileMods.forEach((mod, index) => {
    console.log(\`Glycan #\${index + 1}: \${mod.modValue.primaryValue}\`);
  });
}`, access: `// Get labile modifications
const seq = Sequence.fromProforma("{Glycan:Hex}EMEVNESPEK");
const labileMods = seq.mods.get(-3);

if (labileMods) {
  console.log(\`Found \${labileMods.length} labile modification(s)\`);
  // Loop through all labile modifications
  labileMods.forEach(mod => {
    console.log(\`Labile modification: \${mod.modValue.primaryValue}\`);
    console.log(\`Source: \${mod.source}\`);
  });
}`
  };

  currentExample = this.examples['basic'];
  parsedOutput = '';
  currentGlycan = this.glycanExamples['valid1'];
  validationResult = '';

  constructor() { }

  ngOnInit(): void {
    this.parseSequence(this.currentExample);
    this.validateGlycan(this.currentGlycan);
  }

  parseSequence(sequence: string): void {
    try {
      const seq = Sequence.fromProforma(sequence);

      // Get labile mods (stored at position -3)
      const labileMods = seq.mods.get(-3);
      const labileModsInfo = labileMods ?
        labileMods.map(mod => ({
          name: mod.modValue.primaryValue,
          source: mod.source || 'Unknown',
          isValidGlycan: mod.modValue.pipeValues[0].isValidGlycan || false,
          mass: mod.mass
        })) : [];

      this.parsedOutput = JSON.stringify({
        sequence: seq.toStrippedString(),
        hasLabileMods: labileMods !== undefined && labileMods.length > 0,
        labileMods: labileModsInfo,
        proformaOutput: seq.toProforma()
      }, null, 2);
    } catch (error) {
      this.parsedOutput = `Error parsing sequence: ${error}`;
    }
  }

  validateGlycan(glycan: string): void {
    try {
      const isValid = ModificationValue.validateGlycan(glycan);
      this.validationResult = JSON.stringify({
        glycanStructure: glycan,
        isValid: isValid
      }, null, 2);
    } catch (error) {
      this.validationResult = JSON.stringify({
        glycanStructure: glycan,
        isValid: false,
        error: `${error}`
      }, null, 2);
    }
  }

  setExample(key: string): void {
    this.currentExample = this.examples[key];
    this.parseSequence(this.currentExample);
  }

  setGlycanExample(key: string): void {
    this.currentGlycan = this.glycanExamples[key];
    this.validateGlycan(this.currentGlycan);
  }
}
