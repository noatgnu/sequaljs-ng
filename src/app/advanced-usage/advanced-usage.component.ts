import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {Sequence} from 'sequaljs/dist/sequence';

@Component({
  selector: 'app-advanced-usage',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatDivider,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatList,
    MatListItem
  ],
  templateUrl: './advanced-usage.component.html',
  styleUrl: './advanced-usage.component.scss'
})
export class AdvancedUsageComponent {
  examples: {[key: string]: string} = {
    infoTag: 'ELVIS[Phospho|INFO:newly discovered]K',
    terminalMods: '[Acetyl]-PEPTIDE-[Amidated]',
    globalMods: '<[Carbamidomethyl]@C>PEPTCDE',
    jointRepresentation: 'ELVIS[U:Phospho|+79.966331]K',
    crosslinks: 'PEPTK[XL:DSS#XL1|+138.068|INFO:reaction=NHS]IDE',
    complex: 'PEP[U:Deamidation|+0.984]T[U:Phospho#1(0.75)|+79.966]K[XL:DSS#XL2]IDE',
    gapNotation: 'RTAAX[+367.0537]WT',
    ambiguity: 'EM[Oxidation]EVT[#g1(0.01)]S[#g1(0.09)]ES[Phospho#g1(0.90)]PEK'
  };

  currentExample: string = this.examples['infoTag'];
  output: string = '';

  codeExamples = {
    infoTags: `// Parse sequence with INFO tag
const seq = Sequence.fromProforma('ELVIS[Phospho|INFO:newly discovered]K');
const mod = seq.seq[4].mods[0];
console.log(mod.modValue.primaryValue); // "Phospho"
console.log(mod.infoTags[0]); // "newly discovered"`,

    terminalMods: `// N-terminal and C-terminal modifications
const seq = Sequence.fromProforma('[Acetyl]-PEPTIDE-[Amidated]');

// Access N-terminal modification (position -1)
const nTermMod = seq.mods.get(-1);
if (nTermMod) {
  console.log(nTermMod[0].modValue.primaryValue); // "Acetyl"
}

// Access C-terminal modification (position -2)
const cTermMod = seq.mods.get(-2);
if (cTermMod) {
  console.log(cTermMod[0].modValue.primaryValue); // "Amidated"
}`,

    globalMods: `// Global fixed modification
const seq = Sequence.fromProforma('<[Carbamidomethyl]@C>PEPTCDE');
console.log(seq.globalMods[0].modValue.primaryValue); // "Carbamidomethyl"
console.log(seq.globalMods[0].targetResidues); // ["C"]`,

    jointRepresentation: `// Parse sequence with joint interpretation and mass
const seq = Sequence.fromProforma('ELVIS[U:Phospho|+79.966331]K');
const mod = seq.seq[4].mods[0];
console.log(mod.modValue.primaryValue); // "Phospho"
console.log(mod.source); // "U"
console.log(mod.modValue.pipeValues[1].mass); // 79.966331`,

    crosslinks: `// Crosslinks with mass shifts and info tags
const seq = Sequence.fromProforma('PEPTK[XL:DSS#XL1|+138.068|INFO:reaction=NHS]IDE');
const mod = seq.seq[4].mods[0];
console.log(mod.modValue.primaryValue); // "DSS"
console.log(mod.source); // "XL"
console.log(mod.crosslinkId); // "XL1"
console.log(mod.modValue.pipeValues[1].mass); // 138.068
console.log(mod.infoTags[0]); // "reaction=NHS"`,

    complex: `// Complex example with multiple modification types
const seq = Sequence.fromProforma(
  'PEP[U:Deamidation|+0.984]T[U:Phospho#1(0.75)|+79.966]K[XL:DSS#XL2]IDE'
);
console.log(seq.seq[2].mods[0].modValue.primaryValue); // "Deamidation"
console.log(seq.seq[3].mods[0].modValue.primaryValue); // "Phospho"
console.log(seq.seq[3].mods[0].ambiguityGroup); // "1"
console.log(seq.seq[3].mods[0].localizationScore); // 0.75
console.log(seq.seq[4].mods[0].crosslinkId); // "XL2"`,

    gapNotation: `// Parse sequence with gap of known mass
const seq = Sequence.fromProforma('RTAAX[+367.0537]WT');
console.log(seq.toStrippedString()); // "RTAAXWT"
console.log(seq.seq[4].value); // "X"
console.log(seq.seq[4].mods[0].modType); // "gap"
console.log(seq.seq[4].mods[0].mass); // 367.0537`,

    ambiguity: `// Ambiguity groups with localization scores
const seq = Sequence.fromProforma('EM[Oxidation]EVT[#g1(0.01)]S[#g1(0.09)]ES[Phospho#g1(0.90)]PEK');
// Check which positions belong to ambiguity group g1
seq.seq.forEach((residue, index) => {
  residue.mods.forEach(mod => {
    if (mod.ambiguityGroup === 'g1') {
      console.log(\`Position \${index}: \${residue.value} with score \${mod.localizationScore}\`);
    }
  });
});`
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
      const parsed = Sequence.fromProforma(this.currentExample);
      this.output = JSON.stringify(parsed, null, 2);
    } catch (error) {
      this.output = `Error parsing sequence: ${error}`;
    }
  }

}
