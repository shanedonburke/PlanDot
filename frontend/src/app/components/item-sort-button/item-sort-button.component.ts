import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-item-sort-button',
  templateUrl: './item-sort-button.component.html',
  styleUrls: ['./item-sort-button.component.scss'],
})
export class ItemSortButtonComponent {
  @Output() sortByDate = new EventEmitter();
  @Output() sortByTitle = new EventEmitter();
  @Output() sortByFavorited = new EventEmitter();
  
  constructor() {}
}
