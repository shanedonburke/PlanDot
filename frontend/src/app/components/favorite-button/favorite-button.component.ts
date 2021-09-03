import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/domain/item';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent {
  @Input() item!: Item;

  constructor() {}
}
