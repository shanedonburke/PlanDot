import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  HelpPage0Component,
  HelpPage1Component,
  HelpPage2Component,
  HelpPage3Component,
  HelpPageBaseComponent,
  HelpPageDayViewComponent,
  HelpPageMonthViewComponent,
  HelpPageGroupViewComponent,
  HelpPageItemListViewComponent,
  HelpPageIconWithTextComponent,
  HelpPage4Component,
  HelpPage5Component,
  HelpPage6Component,
  HelpPageFinalComponent,
} from './help-page';

@NgModule({
  declarations: [
    HelpPageIconWithTextComponent,
    HelpPageGroupViewComponent,
    HelpPageMonthViewComponent,
    HelpPageDayViewComponent,
    HelpPageItemListViewComponent,
    HelpPageBaseComponent,
    HelpPage0Component,
    HelpPage1Component,
    HelpPage2Component,
    HelpPage3Component,
    HelpPage4Component,
    HelpPage5Component,
    HelpPage6Component,
    HelpPageFinalComponent,
  ],
  exports: [
    HelpPageIconWithTextComponent,
    HelpPageGroupViewComponent,
    HelpPageMonthViewComponent,
    HelpPageDayViewComponent,
    HelpPageItemListViewComponent,
    HelpPageBaseComponent,
    HelpPage0Component,
    HelpPage1Component,
    HelpPage2Component,
    HelpPage3Component,
    HelpPage4Component,
    HelpPage5Component,
    HelpPage6Component,
    HelpPageFinalComponent,
  ],
  imports: [MatIconModule, MatButtonModule]
})
export class HelpPageModule {}
