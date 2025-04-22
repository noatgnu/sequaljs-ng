import {Component, Input} from '@angular/core';
import {Modification} from 'sequaljs/dist/modification';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {ShowGlycanComponent} from '../show-glycan/show-glycan.component';

@Component({
  selector: 'app-display-mod',
  imports: [
    MatCardContent,
    MatCard,
    NgClass,
    MatTooltip,
    NgTemplateOutlet,
    ShowGlycanComponent
  ],
  templateUrl: './display-mod.component.html',
  styleUrl: './display-mod.component.scss'
})
export class DisplayModComponent {
  @Input() modification: Modification | undefined = undefined;

  constructor() {
  }



}
