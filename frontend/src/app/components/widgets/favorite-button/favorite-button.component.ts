import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Item } from 'src/app/domain/item';
import { UserDataAction, UserDataService } from 'src/app/services/user-data.service';

/**
 * A button that toggles whether an item is favorited when clicked.
 * Favoriting allows the user to sort items by whether they're favorited.
 */
@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent {
  /** The item to favorite */
  @Input() item!: Item;

  constructor(private readonly userDataService: UserDataService) {}

  /**
   * Toggles whether the item is favorited.
   */
  toggleFavorite(): void {
    this.item.toggleFavorite();
    this.userDataService.saveUserData(UserDataAction.FAVORITE_ITEM);
  }

  /**
   * @returns The value of the `aria-label` attribute for the favorite button.
   */
  getAriaLabel(): string {
    return this.item.isFavorited ? 'Remove favorite' : 'Favorite item';
  }
}
