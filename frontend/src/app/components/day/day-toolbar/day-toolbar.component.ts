import { Component } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-day-toolbar',
  templateUrl: './day-toolbar.component.html',
  styleUrls: ['./day-toolbar.component.scss']
})
export class DayToolbarComponent {
  constructor(public readonly dateService: DateService) {}
}
