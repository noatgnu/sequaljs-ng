import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sequence } from 'sequaljs/dist/sequence';
import {MatIcon} from '@angular/material/icon';
import {ParserResultComponent} from '../parser/parser-result/parser-result.component';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-printable-sequence',
  imports: [
    MatIcon,
    ParserResultComponent,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './printable-sequence.component.html',
  styleUrl: './printable-sequence.component.scss'
})
export class PrintableSequenceComponent implements OnInit, OnDestroy {
  sequence: Sequence | undefined;
  isLoading = true;
  error: string | null = null;
  private originalToolbarDisplay: string = '';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const toolbar = document.querySelector('mat-toolbar') as HTMLElement;
    if (toolbar) {
      this.originalToolbarDisplay = toolbar.style.display;
      toolbar.style.display = 'none';
    }

    this.route.queryParams.subscribe(params => {
      const seqString = params['seq'];
      if (seqString) {
        try {
          const sequence = Sequence.fromProforma(seqString);
          this.sequence = sequence;
          this.isLoading = false;
        } catch (err) {
          this.error = 'Failed to parse the sequence';
          this.isLoading = false;
          console.error(err);
        }
      } else {
        this.error = 'No sequence provided';
        this.isLoading = false;
      }
    });
  }

  print(): void {
    window.print();
  }

  ngOnDestroy(): void {
    // Restore toolbar when component is destroyed
    const toolbar = document.querySelector('mat-toolbar') as HTMLElement;
    if (toolbar) {
      toolbar.style.display = this.originalToolbarDisplay;
    }
  }
}
