import { Routes } from '@angular/router';
import {ParserComponent} from './parser/parser.component';
import {HomeComponent} from './home/home.component';
import {BasicUsageComponent} from './basic-usage/basic-usage.component';
import {AdvancedUsageComponent} from './advanced-usage/advanced-usage.component';

export const routes: Routes = [
  { path: 'parser', component: ParserComponent },
  { path: 'home', component: HomeComponent },
  { path: 'basic-usage', component: BasicUsageComponent },
  { path: 'advanced-usage', component: AdvancedUsageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

];
