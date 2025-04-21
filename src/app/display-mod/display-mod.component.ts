import {Component, Input} from '@angular/core';
import {Modification} from 'sequaljs/dist/modification';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgClass} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-display-mod',
  imports: [
    MatCardContent,
    MatCard,
    NgClass,
    MatTooltip
  ],
  templateUrl: './display-mod.component.html',
  styleUrl: './display-mod.component.scss'
})
export class DisplayModComponent {
  @Input() modification: Modification | undefined = undefined;

  constructor() {
  }

}
