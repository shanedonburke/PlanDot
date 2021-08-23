import { Component } from '@angular/core';
import { DisplayService } from 'src/app/services/display.service';

@Component({
  selector: 'app-day-toolbar',
  templateUrl: './day-toolbar.component.html',
  styleUrls: ['./day-toolbar.component.scss']
})
export class DayToolbarComponent {
  constructor(public readonly displayService: DisplayService) {}
}
