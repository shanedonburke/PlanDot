import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DayViewComponent } from './day-view.component';

@NgModule({
  declarations: [DayViewComponent],
  exports: [DayViewComponent],
  imports: [CommonModule],
})
export class DayViewModule {}
