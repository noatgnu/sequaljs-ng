import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {Sequence} from 'sequaljs/dist/sequence';
@Component({
  selector: 'app-home',
  imports: [
    MatIcon,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
