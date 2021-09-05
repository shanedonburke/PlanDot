import { Component } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { getTodaysDate } from 'src/app/util/dates';

@Component({
  selector: 'app-month-toolbar',
  templateUrl: './month-toolbar.component.html',
  styleUrls: ['./month-toolbar.component.scss'],
})
export class MonthToolbarComponent {
  constructor(public readonly dateService: DateService) {}

  shouldDisableResetButton(): boolean {
    const today = getTodaysDate();
    return (
      this.dateService.month === today.getMonth() &&
      this.dateService.year === today.getFullYear()
    );
  }
}
