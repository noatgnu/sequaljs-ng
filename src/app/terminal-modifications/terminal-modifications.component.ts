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
  selector: 'app-terminal-modifications',
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
  templateUrl: './terminal-modifications.component.html',
  styleUrl: './terminal-modifications.component.scss'
})
export class TerminalModificationsComponent {
  sequenceExamples: {[key: string]: string} = {
    nterm: '[Acetyl]-PEPTIDE',
    cterm: 'PEPTIDE-[Amidated]',
    both: '[Acetyl]-PEPTIDE-[Amidated]',
    multiple: '[Acetyl][Methyl]-PEPTIDE',
    complex: '[Acetyl]-PEPS[Phospho]TIDE-[Amidated]'
  };

  currentSequence = this.sequenceExamples['nterm'];
  sequenceResult = '';

  commonNTermMods: {[key: string]: string}[] = [
    { name: 'Acetyl', description: 'Acetylation', mass: '+42.011' },
    { name: 'Formyl', description: 'Formylation', mass: '+28.010' },
    { name: 'Methyl', description: 'Methylation', mass: '+14.016' },
    { name: 'Carbamoyl', description: 'Carbamoylation', mass: '+43.006' },
    { name: 'iTRAQ4', description: 'iTRAQ 4-plex label', mass: '+144.102' }
  ];

  commonCTermMods: {[key: string]: string}[] = [
    { name: 'Amidated', description: 'C-terminal amidation', mass: '-0.984' },
    { name: 'Methyl', description: 'Methylation', mass: '+14.016' },
    { name: 'GGQ', description: 'GlyGlyGln addition', mass: '+242.101' }
  ];
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
    parsing: `// Parse a sequence with terminal modifications
import { Sequence } from 'sequaljs/dist/sequence';

// N-terminal acetylation
const seq = Sequence.fromProforma("[Acetyl]-PEPTIDE");

// Access N-terminal modifications
const nTermMods = seq.mods.get(-1);
if (nTermMods && nTermMods.length > 0) {
  console.log(\`N-terminal modifications: \${nTermMods.length}\`);

  for (const mod of nTermMods) {
    console.log(\`- Modification: \${mod.modValue.primaryValue}\`);
  }
}

// Check for C-terminal modifications
const cTermMods = seq.mods.get(-2);
if (cTermMods && cTermMods.length > 0) {
  console.log(\`C-terminal modifications: \${cTermMods.length}\`);
}`, adding: `// Adding terminal modifications to a sequence
import { Sequence } from 'sequaljs/dist/sequence';
import { Modification } from 'sequaljs/dist/modification';

// Create a sequence
const seq = new Sequence("PEPTIDE");

// Add N-terminal acetylation
const acetyl = new Modification("Acetyl");
if (!seq.mods.has(-1)) {
  seq.mods.set(-1, []);
}
seq.mods.get(-1).push(acetyl);

// Add C-terminal amidation
const amide = new Modification("Amidated");
if (!seq.mods.has(-2)) {
  seq.mods.set(-2, []);
}
seq.mods.get(-2).push(amide);

// Get the ProForma notation
const proforma = seq.toProforma();
console.log(proforma); // "[Acetyl]-PEPTIDE-[Amidated]"`,
  }
  ngOnInit(): void {
    this.parseSequence(this.currentSequence);
  }

  parseSequence(sequence: string): void {
    try {
      const seq = Sequence.fromProforma(sequence);

      // Process N-terminal modifications
      const nTermMods = seq.mods.get(-1) || [];
      const nTermModsInfo = nTermMods.map(mod => ({
        name: mod.modValue.primaryValue,
        source: mod.source || 'Unknown'
      }));

      // Process C-terminal modifications
      const cTermMods = seq.mods.get(-2) || [];
      const cTermModsInfo = cTermMods.map(mod => ({
        name: mod.modValue.primaryValue,
        source: mod.source || 'Unknown'
      }));

      // Get other modifications for context
      const residueMods: any = [];
      for (let i = 0; i < seq.seq.length; i++) {
        if (seq.seq[i].mods && seq.seq[i].mods.length > 0) {
          seq.seq[i].mods.forEach(mod => {
            residueMods.push({
              position: i,
              residue: seq.seq[i].value,
              name: mod.modValue.primaryValue,
              source: mod.source || 'Unknown'
            });
          });
        }
      }

      this.sequenceResult = JSON.stringify({
        sequence: seq.toStrippedString(),
        nTerminalModifications: nTermMods.length > 0 ? nTermModsInfo : 'None',
        cTerminalModifications: cTermMods.length > 0 ? cTermModsInfo : 'None',
        residueModifications: residueMods.length > 0 ? residueMods : 'None',
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

  addTerminalMod(terminalType: string, modName: string): void {
    try {
      // Parse current sequence
      const seq = Sequence.fromProforma(this.currentSequence);

      // Create new modification
      const mod = new Modification(modName);

      if (terminalType === 'N') {
        // Add N-terminal modification
        if (!seq.mods.has(-1)) {
          seq.mods.set(-1, []);
        }
        const mods = seq.mods.get(-1);
        if (mods) {
          mods.push(mod);
        }
      } else {
        // Add C-terminal modification
        if (!seq.mods.has(-2)) {
          seq.mods.set(-2, []);
        }
        const mods = seq.mods.get(-2);
        if (mods) {
          mods.push(mod);
        }
      }

      // Update current sequence and parse
      this.currentSequence = seq.toProforma();
      this.parseSequence(this.currentSequence);
    } catch (error) {
      console.error('Error adding modification:', error);
    }
  }
}
