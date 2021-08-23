import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DayViewComponent } from './day-view.component';

@NgModule({
  declarations: [DayViewComponent],
  exports: [DayViewComponent],
  imports: [CommonModule, MatDialogModule, MatIconModule],
})
export class DayViewModule {}
