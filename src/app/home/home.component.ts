import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {Sequence} from 'sequaljs/dist/sequence';
import {MatCard, MatCardContent} from '@angular/material/card';
@Component({
  selector: 'app-home',
  imports: [
    MatIcon,
    RouterLink,
    MatCard,
    MatCardContent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
