import { Injectable } from '@angular/core';
import { Item } from '../domain/item';
import { isValidDate } from '../util/dates';
import { GroupService } from './group.service';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchValue = '';
  filteredItems: ReadonlyArray<Item> = [];

  constructor(
    private readonly itemService: ItemService,
    private readonly groupService: GroupService
  ) {
    this.filteredItems = this.itemService.getItems();
  }

  update() {
    const searchDate = new Date(this.searchValue);
    this.filteredItems = this.itemService.getItems().filter((item) => {
      const groupNames = this.groupService.getItemGroups(item).map((group) => group.name.toLowerCase());

      let doesDateMatch = false;
      if (isValidDate(searchDate)) {
        doesDateMatch =
          item.dateEnabled && item.date.getTime() === searchDate.getTime();
      }
      
      return (
        this.searchValue.trim() === '' ||
        doesDateMatch ||
        item.title.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchValue.toLowerCase()) ||
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
