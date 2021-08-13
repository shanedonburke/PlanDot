import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DayViewComponent } from './day-view.component';

@NgModule({
  declarations: [DayViewComponent],
  exports: [DayViewComponent],
  imports: [CommonModule, MatDialogModule],
})
export class DayViewModule {}
