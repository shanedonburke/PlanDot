import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/domain/item';
import { UserDataAction, UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent {
  @Input() item!: Item;

  constructor(private readonly userDataService: UserDataService) {}

  toggleFavorite(): void {
    this.item.toggleFavorite();
    this.userDataService.saveUserData(UserDataAction.FAVORITE_ITEM);
  }
}
