import { Component, EventEmitter, Output } from '@angular/core';

/**
 * A reusable button that shows a menu containing item sorting options.
 * Clicking any of the sorting options triggers an output on this component.
 */
@Component({
  selector: 'app-item-sort-button',
  templateUrl: './item-sort-button.component.html',
  styleUrls: ['./item-sort-button.component.scss'],
})
export class ItemSortButtonComponent {
  /** Trigger when 'Date' is selected */
  @Output() sortByDate = new EventEmitter();

  /** Triggered when 'Title' is selected */
  @Output() sortByTitle = new EventEmitter();

  /** Triggered when 'Favorited' is selected */
  @Output() sortByFavorited = new EventEmitter();
  
  constructor() {}
}
