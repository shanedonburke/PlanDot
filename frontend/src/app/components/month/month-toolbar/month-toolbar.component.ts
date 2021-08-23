import { Component } from '@angular/core';
import { DisplayService } from 'src/app/services/display.service';

@Component({
  selector: 'app-month-toolbar',
  templateUrl: './month-toolbar.component.html',
  styleUrls: ['./month-toolbar.component.scss'],
})
export class MonthToolbarComponent {
  constructor(public readonly displayService: DisplayService) {}
}
