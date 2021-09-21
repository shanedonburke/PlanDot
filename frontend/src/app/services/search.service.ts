import { Injectable } from '@angular/core';
import { Item } from '../domain/item';
import { isValidDate } from '../util/dates';
import { GroupService } from './group.service';
import { ItemService } from './item.service';
import { UserDataService } from './user-data.service';

/**
 * Represents the filter settings applied by the user in the item list view.
 */
interface ItemFilter {
  /** Whether items with a date should be shown */
  withDate: boolean;
  /** Whether items without a date should be shown */
  withoutDate: boolean;
  /** Whether non-favorited items should be shown */
  notFavorited: boolean;
}

/**
 * A service to handle searching and filtering items.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /** The text entered into the item list toolbar's search field */
  searchValue = '';

  /** The current filter settings for the item list view */
  filter: ItemFilter = {
    withDate: true,
    withoutDate: true,
    notFavorited: true,
  };

  /** The subset of all items to be shown in the item list view */
  get filteredItems(): ReadonlyArray<Item> {
    return this._filteredItems;
  }

  /** The subset of all items to be shown in the item list view */
  private _filteredItems: ReadonlyArray<Item> = [];

  constructor(
    private readonly itemService: ItemService,
    private readonly groupService: GroupService,
    userDataService: UserDataService
  ) {
    this._filteredItems = this.itemService.getItems();
    userDataService.onUserDataChanged.subscribe(() => this.update());
  }

  /**
   * Update the displayed items by applying the filter and search values.
   * The user may search by title, description, date, location, and group names.
   */
  update() {
    this._filteredItems = this.itemService.getItems().filter((item) => {
      if (!this.filter.withDate && item.isDateEnabled) {
        return false;
      } else if (!this.filter.withoutDate && !item.isDateEnabled) {
        return false;
      } else if (!this.filter.notFavorited && !item.isFavorited) {
        return false;
      }

      const groupNames = this.groupService
        .getItemGroups(item)
        .map((group) => group.name.toLowerCase());

      // An entered date is used for searching if it can be used to create a Date
      const searchDate = new Date(this.searchValue);

      let doesDateMatch = false;
      if (isValidDate(searchDate)) {
        doesDateMatch =
          item.isDateEnabled && item.date.getTime() === searchDate.getTime();
      }

      return (
        this.searchValue.trim() === '' ||
        doesDateMatch ||
        item.title.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(this.searchValue.toLowerCase()) ||
        item.location.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        groupNames.some((name) => name.includes(this.searchValue.toLowerCase()))
      );
    });
  }

  /**
   * Clears the search value, removing its effect on the item list.
   */
  clearSearch() {
    this.searchValue = '';
    this.update();
  }
}
