import { Component } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { getTodaysDate } from 'src/app/util/dates';

/**
 * Component for the month view's toolbar. Contains a button to reset the
 * month being viewed to the current one.
 */
@Component({
  selector: 'app-month-toolbar',
  templateUrl: './month-toolbar.component.html',
  styleUrls: ['./month-toolbar.component.scss'],
})
export class MonthToolbarComponent {
  constructor(public readonly dateService: DateService) {}

  /**
   * @returns True if the current month is the same as the month being viewed.
   */
  shouldDisableResetButton(): boolean {
    const today = getTodaysDate();
    return (
      this.dateService.month === today.getMonth() &&
      this.dateService.year === today.getFullYear()
    );
  }
}
