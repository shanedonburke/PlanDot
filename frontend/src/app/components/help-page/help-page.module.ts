import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  HelpPage0Component,
  HelpPage1Component,
  HelpPage2Component,
  HelpPageBaseComponent,
  HelpPageDayViewComponent,
  HelpPageMonthViewComponent,
  HelpPageGroupViewComponent,
  HelpPageItemListViewComponent,
  HelpPageIconWithText,
} from './help-page.component';

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
  ],
  imports: [MatIconModule]
})
export class HelpPageModule {}
