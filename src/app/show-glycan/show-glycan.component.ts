import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-show-glycan',
  imports: [],
  templateUrl: './show-glycan.component.html',
  styleUrl: './show-glycan.component.scss'
})
export class ShowGlycanComponent {
  baseUrl = 'https://api.glygen.org/glycan/image/'
  @Input() glycanId: string | undefined = undefined
  constructor() { }


}
