import {Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {WebService} from '../services/web.service';

@Component({
  selector: 'app-show-glycan',
  imports: [],
  templateUrl: './show-glycan.component.html',
  styleUrl: './show-glycan.component.scss'
})
export class ShowGlycanComponent {
  baseUrl = 'https://api.glygen.org/glycan/image/'
  private _glycanId: string | undefined = undefined
  @Input() set glycanId(value: string | undefined) {
    this._glycanId = value;
  }
  get glycanId(): string | undefined {
    return this._glycanId;
  }
  constructor() { }

}
