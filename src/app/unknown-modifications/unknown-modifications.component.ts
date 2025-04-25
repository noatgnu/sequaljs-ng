import { Component } from '@angular/core';
import {MatList, MatListItem, MatDivider} from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {Sequence} from 'sequaljs/dist/sequence';
import {Modification} from 'sequaljs/dist/modification';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-unknown-modifications',
  imports: [
    MatList,
    MatListItem,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatTab,
    MatTabGroup,
    MatDivider,
    MatButtonToggle,
    MatButtonToggleGroup
  ],
  templateUrl: './unknown-modifications.component.html',
  styleUrl: './unknown-modifications.component.scss'
})
export class UnknownModificationsComponent {
  examples: {[key: string]: string} = {
    basic: '[Phospho]?EMEVNESPEK',
    multiple: '[Phospho][Acetyl]?EMEVNESPEK',
    combined: '[Acetyl]?EMEVS[Phospho]ES[Oxidation]PEK',
    withCaret: '[Phospho]^2?EMEVNESTSPEK',
    programmaticAccess: '[Phospho]?EMEVNESPEK'
  };

  exampleCodes: {[key: string]: string} = {
    accessUnknownMods: `// Get modifications with unknown positions
const seq = Sequence.fromProforma("[Phospho]?EMEVNESPEK");
const unknownMods = seq.mods.get(-4);

if (unknownMods) {
  console.log(\`Found \${unknownMods.length} unknown position modifications\`);
  // Loop through all unknown position modifications
  unknownMods.forEach(mod => {
    console.log(\`Unknown position modification: \${mod.modValue.primaryValue}\`);
  });
}`,
    multiple: `// Handle multiple unknown position modifications
const seq = Sequence.fromProforma("[Phospho][Acetyl]?EMEVNESPEK");
const unknownMods = seq.mods.get(-4);

if (unknownMods) {
  unknownMods.forEach(mod => {
    console.log(\`Type: \${mod.modValue.primaryValue}\`);
    // "Phospho"
    // "Acetyl"
  });
}`,
    writing: `// Create a sequence with unknown position modifications
const seq = new Sequence("EMEVNESPEK");
const phosphoMod = new Modification("Phospho");

// Add to the special -4 position for unknown mods
if (!seq.mods.has(-4)) {
  seq.mods.set(-4, [])
}
seq.mods.get(-4).push(phosphoMod);

// Convert back to ProForma notation
console.log(seq.toProforma()); // Should output "[Phospho]?EMEVNESPEK"`,
    programmaticAccess: ``
  }

  currentExample = this.examples['basic'];
  parsedOutput = '';

  constructor() { }

  ngOnInit(): void {
    this.parseSequence(this.currentExample);
  }

  parseSequence(sequence: string): void {
    try {
      const seq = Sequence.fromProforma(sequence);

      // Get unknown position mods (stored at position -4)
      const unknownMods = seq.mods.get(-4);
      const unknownModsInfo = unknownMods ?
        unknownMods.map((mod: Modification) => ({
          name: mod.modValue.primaryValue,
          source: mod.source || 'Unknown',
        })) : [];

      this.parsedOutput = JSON.stringify({
        sequence: seq.toStrippedString(),
        hasUnknownMods: unknownMods !== undefined && unknownMods.length > 0,
        unknownMods: unknownModsInfo,
        proformaOutput: seq.toProforma()
      }, null, 2);
    } catch (error) {
      this.parsedOutput = `Error parsing sequence: ${error}`;
    }
  }

  setExample(key: string): void {
    this.currentExample = this.examples[key];
    this.parseSequence(this.currentExample);
  }
}
