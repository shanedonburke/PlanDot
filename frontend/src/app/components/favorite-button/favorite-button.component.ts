import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Item } from 'src/app/domain/item';
import { UserDataAction, UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent {
  @Input() item!: Item;

  @ViewChild('tooltip') tooltip!: MatTooltip;

  constructor(private readonly userDataService: UserDataService) {}

  toggleFavorite(): void {
    this.item.toggleFavorite();

    // Prevents the tooltip's text from changing as its hiding
    // animation plays. Also makes the tooltip visible again (with the
    // new text) after a short delay.
    this.tooltip.show();

    this.userDataService.saveUserData(UserDataAction.FAVORITE_ITEM);
  }

  getTooltipText(): string {
    return this.item.isFavorited ? 'Remove favorite' : 'Favorite item';
  }
}
