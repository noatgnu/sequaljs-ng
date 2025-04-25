import { Routes } from '@angular/router';
import {ParserComponent} from './parser/parser.component';
import {HomeComponent} from './home/home.component';
import {BasicUsageComponent} from './basic-usage/basic-usage.component';
import {AdvancedUsageComponent} from './advanced-usage/advanced-usage.component';
import {GlobalModificationsComponent} from './global-modifications/global-modifications.component';
import {UnknownModificationsComponent} from './unknown-modifications/unknown-modifications.component';
import {LabileModificationsComponent} from './labile-modifications/labile-modifications.component';
import {GlycanValidationComponent} from './glycan-validation/glycan-validation.component';
import {TerminalModificationsComponent} from './terminal-modifications/terminal-modifications.component';
import {ChimericSpectraComponent} from './chimeric-spectra/chimeric-spectra.component';
import {PipeValuesComponent} from './pipe-values/pipe-values.component';

export const routes: Routes = [
  { path: 'parser', component: ParserComponent },
  { path: 'home', component: HomeComponent },
  { path: 'basic-usage', component: BasicUsageComponent },
  { path: 'advanced-usage', component: AdvancedUsageComponent },
  { path: 'global-modifications', component: GlobalModificationsComponent },
  { path: 'unknown-modifications', component: UnknownModificationsComponent},
  { path: 'labile-modifications', component: LabileModificationsComponent},
  { path: 'glycan-validation', component: GlycanValidationComponent},
  { path: 'terminal-modifications', component: TerminalModificationsComponent},
  { path: 'chimeric-spectra', component: ChimericSpectraComponent},
  { path: 'pipe-values', component: PipeValuesComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },

];
