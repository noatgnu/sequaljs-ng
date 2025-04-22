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

@Component({
  selector: 'app-parser',
  imports: [
    MatProgressSpinner,
    MatCard,
    MatCardTitle,
    MatIcon,
    MatInput,
    MatFormField,
    MatButton,
    MatTooltip,
    MatCardHeader,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    MatIconButton,
    MatHint,
    MatLabel,
    MatIconButton,
    DisplayModComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    NgClass,
    MatSelectModule,
    FormsModule,
    ParserResultComponent
  ],
  templateUrl: './parser.component.html',
  styleUrl: './parser.component.scss'
})
export class ParserComponent implements OnInit {
  parsingError: string|null = null;
  examples = [
    "ETFGD[MOD:00093#BRANCH]//R[#BRANCH]ATER",
    "<[MOD:01090]@C>[Phospho]?EM[Oxidation]EVTSECSPEK",
    'ELVIS[Unimod:21|Phospho|INFO:Validated]K',
    "<[S-carboxamidomethyl-L-cysteine]@C>ATPEILTCNSIGCLK",
    "{Glycan:Hex}{Glycan:NeuAc}EMEVNESPEK",
    "(?N)NGTWEM[Oxidation]ESNENFEGYM[Oxidation]K",
    "ELVIS[U:Phospho|Obs:+79.978]K",
    "<[Carbamidomethyl|INFO:Standard alkylation]@C>[Acetyl|INFO:Added during processing]-PEPTCDE-[Amidated|INFO:Common C-terminal mod]",
    "<13C><15N>ATPEILTVNSIGQLK",
    "[Phospho]^2?[Acetyl]-EM[Oxidation]EVTSESPEK",
    "SEK[XLMOD:02001#XL1]UENCE//EMEVTK[#XL1]SESPEK",
    "PRT(EC[Carbamidomethyl]FRMS)[+19.0523]ISK",
    "EM[Oxidation]EVT[#g1(0.01)]S[#g1(0.09)]ES[Phospho#g1(0.90)]PEK",
    "NEEYN[GNO:G59626AS]K"
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
    // Handle initial query params
    this.route.queryParams.subscribe(params => {
      if (params['seq']) {
        this.sequence = params['seq'];
        this.form.patchValue({
          sequence: this.sequence
        }, { emitEvent: false });
        this.parseSequence(this.sequence);
      }
    });

    // Set up debounced sequence parsing
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

    console.log('Parsed sequence:', this.parsedSequence);
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

}
