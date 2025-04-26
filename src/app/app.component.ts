import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {
  MatDivider,
  MatListItem,
  MatListItemIcon,
  MatListSubheaderCssMatStyler,
  MatNavList
} from '@angular/material/list';
import {MatIconAnchor, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {UnimodService} from './unimod.service';
import {PSIModService} from './psi-mod.service';
import {XLModService} from './xl-mod.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatIcon, MatSidenavContent, MatSidenavContainer, MatNavList, MatListItemIcon, RouterLink, MatListItem, RouterLinkActive, MatListSubheaderCssMatStyler, MatSidenav, MatDivider, MatIconButton, MatIconAnchor, MatTooltip],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SequalJS';
  isDarkTheme = false;

  constructor(private unimod: UnimodService, private psimod: PSIModService, private xlmod: XLModService ) {
    this.unimod.loadUnimodDatabase().subscribe((data) => {
      console.log('Unimod database loaded');
    })
    this.psimod.loadPSIModDatabase().subscribe((data) => {
      console.log('PSIMod database loaded');
    })
    this.xlmod.loadXLModDatabase().subscribe((data) => {
      console.log('XLMod database loaded');
    })
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('sequaljs-theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('sequaljs-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
