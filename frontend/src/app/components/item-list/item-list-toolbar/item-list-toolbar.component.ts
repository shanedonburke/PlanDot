import { Component, HostListener } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-item-list-toolbar',
  templateUrl: './item-list-toolbar.component.html',
  styleUrls: ['./item-list-toolbar.component.scss'],
})
export class ItemListToolbarComponent {
  isFilterMenuVisible = false;

  constructor(
    public readonly searchService: SearchService,
    public readonly userDataService: UserDataService
  ) {}

  toggleFilterMenu(event: MouseEvent) {
    this.isFilterMenuVisible = !this.isFilterMenuVisible;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeFilterMenu() {
    this.isFilterMenuVisible = false;
  }
}
