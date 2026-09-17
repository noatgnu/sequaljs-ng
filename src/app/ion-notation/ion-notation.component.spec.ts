import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { IonNotationComponent } from './ion-notation.component';

describe('IonNotationComponent', () => {
  let component: IonNotationComponent;
  let fixture: ComponentFixture<IonNotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonNotationComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(IonNotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('identifies a residue-level UNIMOD c-type ion with the corrected Unimod ID', () => {
    component.setExample('unimodCIon');
    expect(component.parsedSequence.toStrippedString()).toBe('PEPTIDE');
    expect(component.parsedSequence.seq[3].mods[0].isIonType).toBeTrue();
    expect(component.output).toContain('"isIonType": true');
  });
});
