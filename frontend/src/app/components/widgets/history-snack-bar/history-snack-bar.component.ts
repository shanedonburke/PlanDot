import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

/**
 * Descriptions of possible history events.
 */
export type HistoryEventDescription = 'Undid' | 'Redid';

/**
 * The data to be passed to the snack bar.
 */
export interface HistorySnackBarData {
  /** The history event that triggered the snack bar */
  event: HistoryEventDescription;
  /** Description of what's being undone/redone */
  actionDescription: string;
}

/**
 * Snack bar that appears when an action is undone or redone.
 */
@Component({
  selector: 'app-history-snack-bar',
  templateUrl: './history-snack-bar.component.html',
  styleUrls: ['./history-snack-bar.component.scss'],
})
export class HistorySnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) readonly data: HistorySnackBarData) {}
}
