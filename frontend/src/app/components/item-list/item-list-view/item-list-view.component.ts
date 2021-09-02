import { Component, ElementRef, OnInit } from '@angular/core';
import * as createDOMPurify from 'dompurify';
import * as marked from 'marked';
import { Item } from 'src/app/domain/item';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-item-list-view',
  templateUrl: './item-list-view.component.html',
  styleUrls: ['./item-list-view.component.scss'],
})
export class ItemListViewComponent implements OnInit {
  constructor(
    public readonly searchService: SearchService,
    public readonly userDataService: UserDataService,
  ) {}

  ngOnInit() {
    this.searchService.update();
  }

  getDescriptionHtml(item: Item): string {
    return createDOMPurify().sanitize(
      marked(item.description)
    );
  }

  onDescriptionMouseWheel(event: Event, element: HTMLDivElement): void {
    event.preventDefault();
    event.stopPropagation();
    element.scrollTop += (event as WheelEvent).deltaY;
  }
}

