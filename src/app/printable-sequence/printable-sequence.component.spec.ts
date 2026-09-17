import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PrintableSequenceComponent } from './printable-sequence.component';

describe('PrintableSequenceComponent', () => {
  let component: PrintableSequenceComponent;
  let fixture: ComponentFixture<PrintableSequenceComponent>;

  async function setup(seq: string | undefined) {
    await TestBed.configureTestingModule({
      imports: [PrintableSequenceComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of(seq ? { seq } : {}) } },
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintableSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup(undefined);
    expect(component).toBeTruthy();
  });

  it('parses a query-param sequence with B/Z/J ambiguous residues (previously threw)', async () => {
    await setup('BZJX[+1]');
    expect(component.error).toBeNull();
    expect(component.sequence?.toStrippedString()).toBe('BZJX');
  });

  it('sets an error for a missing sequence query param', async () => {
    await setup(undefined);
    expect(component.error).toBe('No sequence provided');
    expect(component.sequence).toBeUndefined();
  });
});
