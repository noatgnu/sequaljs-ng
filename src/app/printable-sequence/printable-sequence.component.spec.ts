import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableSequenceComponent } from './printable-sequence.component';

describe('PrintableSequenceComponent', () => {
  let component: PrintableSequenceComponent;
  let fixture: ComponentFixture<PrintableSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintableSequenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintableSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
