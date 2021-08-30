import { Injectable } from '@angular/core';
import { Item } from '../domain/item';
import { isValidDate } from '../util/dates';
import { GroupService } from './group.service';
import { ItemService } from './item.service';
import { UserDataService } from './user-data.service';

interface ItemFilter {
  withDate: boolean;
  withoutDate: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchValue = '';
  filter: ItemFilter = {
    withDate: true,
    withoutDate: true,
  };

  filteredItems: ReadonlyArray<Item> = [];

  constructor(
    private readonly itemService: ItemService,
    private readonly groupService: GroupService,
    userDataService: UserDataService
  ) {
    this.filteredItems = this.itemService.getItems();
    userDataService.onUserDataChanged.subscribe(() => this.update());
  }

  update() {
    const searchDate = new Date(this.searchValue);
    this.filteredItems = this.itemService.getItems().filter((item) => {
      if (!this.filter.withDate && item.dateEnabled) {
        return false;
      } else if (!this.filter.withoutDate && !item.dateEnabled) {
        return false;
      }

      const groupNames = this.groupService
        .getItemGroups(item)
        .map((group) => group.name.toLowerCase());

      let doesDateMatch = false;
      if (isValidDate(searchDate)) {
        doesDateMatch =
          item.dateEnabled && item.date.getTime() === searchDate.getTime();
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

  clearSearch() {
    this.searchValue = '';
    this.update();
  }
}
