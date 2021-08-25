import { Component } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-month-toolbar',
  templateUrl: './month-toolbar.component.html',
  styleUrls: ['./month-toolbar.component.scss'],
})
export class MonthToolbarComponent {
  constructor(public readonly dateService: DateService) {}
}
