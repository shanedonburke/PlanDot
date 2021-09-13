import { NgModule } from '@angular/core';
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
  HelpPageIconWithText,
  HelpPage4Component,
  HelpPage5Component,
  HelpPage6Component,
} from './help-page';

@NgModule({
  declarations: [
    HelpPageIconWithText,
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
  ],
  exports: [
    HelpPageIconWithText,
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
  ],
  imports: [MatIconModule]
})
export class HelpPageModule {}
