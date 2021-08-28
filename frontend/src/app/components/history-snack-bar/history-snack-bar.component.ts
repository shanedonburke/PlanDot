import { Component, Inject, Input } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface HistorySnackBarData {
  event: string;
  actionDescription: string;
}

@Component({
  selector: 'app-history-snack-bar',
  templateUrl: './history-snack-bar.component.html',
  styleUrls: ['./history-snack-bar.component.scss'],
})
export class HistorySnackBarComponent {
  static UNDO_EVENT = 'Undid';
  static REDO_EVENT = 'Redid';

  constructor(@Inject(MAT_SNACK_BAR_DATA) readonly data: HistorySnackBarData) {}
}
