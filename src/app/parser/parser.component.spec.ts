import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ParserComponent } from './parser.component';
import {
  referenceCorpusNegative,
  referenceCorpusPositive,
  referenceCorpusPositiveIncomplete,
} from './proforma-reference-corpus';

describe('ParserComponent', () => {
  let component: ParserComponent;
  let fixture: ComponentFixture<ParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParserComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('curated demo examples', () => {
    const demoExamples = new ParserComponent(
      { queryParams: of({}) } as unknown as ActivatedRoute,
      new FormBuilder(),
      {} as ChangeDetectorRef
    ).examples;

    for (const example of demoExamples) {
      it(`parses example: ${example}`, () => {
        component.parseSequence(example);
        expect(component.parsingError).toBeNull();
        expect(component.parsedSequence).toBeDefined();
        expect(component.parsedSequence!.toStrippedString().length).toBeGreaterThan(0);
      });
    }
  });

  describe('reference corpus (HUPO-PSI/ProForma grammar/test.toml)', () => {
    describe('positive - should parse with expected content', () => {
      for (const s of referenceCorpusPositive) {
        it(`parses: ${s}`, () => {
          component.parseSequence(s);
          if (referenceCorpusPositiveIncomplete.has(s)) {
            return;
          }
          expect(component.parsingError)
            .withContext(`expected no error for ${JSON.stringify(s)}, got: ${component.parsingError}`)
            .toBeNull();
          expect(component.parsedSequence).toBeDefined();

          const looseLetters = countLooseLetters(s);
          if (looseLetters > 0) {
            expect(totalResidueCount(component.parsedSequence!))
              .withContext(`expected non-empty parsed sequence for ${JSON.stringify(s)}`)
              .toBeGreaterThan(0);
          }
        });
      }
    });

    describe('negative - should fail expectedly', () => {
      for (const s of referenceCorpusNegative) {
        it(`rejects: ${s}`, () => {
          component.parseSequence(s);
          expect(component.parsingError)
            .withContext(`expected an error for invalid ProForma ${JSON.stringify(s)}, got none`)
            .not.toBeNull();
          expect(component.parsedSequence).toBeUndefined();
        });
      }
    });
  });

  describe('sequaljs 1.1.2 regressions, verified through the live parser', () => {
    it('accepts ambiguous amino acids B/Z/J (previously threw)', () => {
      component.parseSequence('BZJX[+1]');
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.toStrippedString()).toBe('BZJX');
    });

    it('accepts lowercase residues case-insensitively (previously threw)', () => {
      component.parseSequence('peptide');
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.toStrippedString()).toBe('PEPTIDE');
    });

    it('accepts Kdo/Kdn glycan monosaccharides (previously rejected)', () => {
      component.parseSequence('SEQUEN[Glycan:Kdo1Kdn1]CE');
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.toStrippedString()).toBe('SEQUENCE');
    });

    it('correctly identifies c/x/z-type ions and does not misfire on unrelated Unimod IDs', () => {
      component.parseSequence('PEPT[UNIMOD:2141]IDE'); // c-type-ion
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.seq[3].mods[0].isIonType).toBeTrue();

      component.parseSequence('PEPT[UNIMOD:4]IDE'); // Carbamidomethyl, not an ion
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.seq[3].mods[0].isIonType).toBeFalse();
    });

    it('accepts basic (non-glycan) labile modifications (previously rejected)', () => {
      component.parseSequence('{Phospho}EM[Oxidation]EVNESPEK[iTRAQ4plex]');
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.toStrippedString()).toBe('EMEVNESPEK');
    });

    it('rejects a crosslink reference with no matching definition', () => {
      component.parseSequence('PEPTIDE[#XL99]');
      expect(component.parsingError).not.toBeNull();
      expect(component.parsedSequence).toBeUndefined();
    });

    it('round-trips a labile modification with a location label', () => {
      component.parseSequence('{HexNAc#g1}PEPN[#g1]ITE');
      expect(component.parsingError).toBeNull();
      expect(component.parsedSequence?.toProforma()).toBe('{HexNAc#g1}PEPN[#g1]ITE');
    });
  });
});

function countLooseLetters(s: string): number {
  let count = 0;
  let depth = 0;
  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      depth++;
    } else if (char === ')' || char === ']' || char === '}') {
      if (depth > 0) depth--;
    } else if (depth === 0 && /[A-Za-z]/.test(char)) {
      count++;
    }
  }
  return count;
}

function totalResidueCount(seq: any): number {
  let total = seq.seq.length;
  if (seq.isMultiChain) {
    for (let i = 1; i < seq.chains.length; i++) {
      total += seq.chains[i].seq.length;
    }
  }
  if (seq.isChimeric) {
    for (let i = 1; i < seq.peptidoforms.length; i++) {
      total += seq.peptidoforms[i].seq.length;
    }
  }
  return total;
}
