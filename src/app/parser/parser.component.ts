import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {Sequence} from 'sequaljs/dist/sequence';
import {DisplayModComponent} from '../display-mod/display-mod.component';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {NgClass} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {Modification} from 'sequaljs/dist/modification';
import {ParserResultComponent} from './parser-result/parser-result.component';
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-parser',
  imports: [
    MatProgressSpinner,
    MatCard,
    MatCardTitle,
    MatIcon,
    MatInput,
    MatFormField,
    MatCardHeader,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    MatIconButton,
    MatHint,
    MatLabel,
    MatIconButton,
    NgClass,
    MatSelectModule,
    FormsModule,
    ParserResultComponent,
    MatTooltip,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatMenu,
    MatMenuTrigger,
    MatButton,
    MatMenuItem
  ],
  templateUrl: './parser.component.html',
  styleUrl: './parser.component.scss'
})
export class ParserComponent implements OnInit {
  parsingError: string|null = null;
  examples = [
    "ETFGD[MOD:00093#BRANCH]//R[#BRANCH]ATER",
    "<[MOD:01090]@C>[Phospho]?EM[Oxidation]EVTSECSPEK",
    'ELVIS[Unimod:21|Phospho|INFO:Validated|M:00043|R:AA0034]K',
    "<[S-carboxamidomethyl-L-cysteine]@C>ATPEILTCNSIGCLK",
    "{Glycan:Hex}{Glycan:NeuAc}EMEVNESPEK",
    "(?N)NGTWEM[Oxidation]ESNENFEGYM[Oxidation]K",
    "ELVIS[U:21|Obs:+79.978]K",
    "<[Carbamidomethyl|INFO:Standard alkylation]@C>[Acetyl|INFO:Added during processing]-PEPTCDE-[Amidated|INFO:Common C-terminal mod]",
    "<13C><15N>ATPEILTVNSIGQLK",
    "[Phospho]^2?[Acetyl]-EM[Oxidation]EVTSESPEK",
    "SEK[XLMOD:02001#XL1]UENCE//EMEVTK[#XL1]SESPEK",
    "PRT(EC[Carbamidomethyl]FRMS)[+19.0523]ISK",
    "EM[Oxidation]EVT[#g1(0.01)]S[#g1(0.09)]ES[Phospho#g1(0.90)]PEK",
    "NEEYN[GNO:G59626AS]K",
    "EMEVEESPEK/2[+2Na+,+H+]"
  ]
  selectedExample: string = "";
  sequence: string = 'ELVIS[Unimod:21|Phospho|INFO:Validated]K';
  parsedSequence: Sequence|undefined = undefined;
  pipeValueTypes = [
    'synonym', 'info_tag', 'mass', 'observed_mass',
    'crosslink', 'branch', 'ambiguity',
    'glycan', 'gap', 'formula'
  ];
  globalFixedModsMap: {[residue: string]: Modification[]} = {}
  form;
  isProcessing = false;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.fb.group({
      sequence: [this.sequence],
    });
    this.parseSequence(this.sequence);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['seq']) {
        this.sequence = params['seq'];
        this.form.patchValue({
          sequence: this.sequence
        }, { emitEvent: false });
        this.parseSequence(this.sequence);
      }
    });

    this.form.get('sequence')?.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (!value) return;
        this.parseSequence(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseSequence(sequence: string) {
    if (!sequence?.trim()) return;

    this.isProcessing = true;
    this.parsingError = null;

    try {
      this.parsedSequence = Sequence.fromProforma(sequence);
      if (this.parsedSequence) {
        console.log(this.parsedSequence);
      }
    } catch (error) {
      console.error('Error parsing sequence:', error);
      this.parsedSequence = undefined;
      this.parsingError = error instanceof Error
        ? error.message
        : 'Invalid sequence format';
    }

    this.isProcessing = false;
  }

  clearSequence() {
    this.form.reset();
  }

  formatLegendLabel(type: string): string {
    return type.replace('_', ' ');
  }

  selectExample(example: string) {
    this.form.patchValue({
      sequence: example
    });
  }

  copySequence() {
    if (this.sequence) {
      navigator.clipboard.writeText(this.sequence).then(() => {
        console.log('Sequence copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy sequence: ', err);
      });
    }
  }

  exportAsPNG() {
    if (!this.parsedSequence) return;
    const sequenceContainers = document.querySelectorAll('.sequence-visualization-container')
    if (sequenceContainers.length === 0) return;

    this.isProcessing = true;
    for (const sequenceContainer of sequenceContainers) {
      const container = sequenceContainer as HTMLElement;
      html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true
      }).then((canvas: any) => {
        this.isProcessing = false;
        canvas.toBlob((blob: any) => {
          if (blob) {
            saveAs(blob, `proforma-sequence-${Date.now()}.png`);
          }
        });
      }).catch((error: any) => {
        console.error('Error generating PNG:', error);
        this.isProcessing = false;
      });
    }
  }



}
