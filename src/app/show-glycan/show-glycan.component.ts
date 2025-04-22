import {Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {WebService} from '../services/web.service';
import {ShowOriginalSizeGlycanImageDialogComponent} from './show-original-size-glycan-image-dialog/show-original-size-glycan-image-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-show-glycan',
  imports: [
    ShowOriginalSizeGlycanImageDialogComponent,
  ],
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
  constructor(private dialog: MatDialog) { }

  showImage(imageUrl: string) {
    const ref = this.dialog.open(ShowOriginalSizeGlycanImageDialogComponent)
    ref.componentInstance.imageUrl = imageUrl;
  }
}
