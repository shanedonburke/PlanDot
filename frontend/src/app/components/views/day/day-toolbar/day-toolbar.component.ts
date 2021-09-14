import { Component } from '@angular/core';
import { DateService } from 'src/app/services/date.service';
import { getTodaysDate } from 'src/app/util/dates';

@Component({
  selector: 'app-day-toolbar',
  templateUrl: './day-toolbar.component.html',
  styleUrls: ['./day-toolbar.component.scss']
})
export class DayToolbarComponent {
  constructor(public readonly dateService: DateService) {}

  shouldDisableResetButton(): boolean {
    return this.dateService.date.getTime() === getTodaysDate().getTime();
  }
}
