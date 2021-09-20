import { Component, OnInit } from '@angular/core';
import * as createDOMPurify from 'dompurify';
import * as marked from 'marked';
import { Item } from 'src/app/domain/item';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';

/**
 * Component for the item list view. All items are displayed in a list.
 * The user may reorder items by dragging them. On touch screens, the user
 * can swipe left on an item to reveal a panel with a delete button.
 */
@Component({
  selector: 'app-item-list-view',
  templateUrl: './item-list-view.component.html',
  styleUrls: ['./item-list-view.component.scss'],
})
export class ItemListViewComponent implements OnInit {
  /** True when user data loading is done (even if there is no data) */
  isUserDataLoaded = false;

  constructor(
    public readonly searchService: SearchService,
    public readonly userDataService: UserDataService
  ) {
    this.userDataService.onUserDataLoaded.subscribe(() => {
      this.isUserDataLoaded = true;
    });
  }

  ngOnInit() {
    this.searchService.update();
  }

  /**
   * Gets the HTML representation of a rendered item description.
   * @param item The item to get a description for
   * @returns The Markdown description transformed into HTML
   */
  getDescriptionHtml(item: Item): string {
    return createDOMPurify().sanitize(marked(item.description));
  }

  /**
   * Handles mouse wheel events on an item description. Scrolling is applied
   * manually to override the prevention of mouse wheeling by
   * {@link SwipeRevealDirective}.
   * @param event The mouse wheel event
   * @param element The description element
   */
  onDescriptionMouseWheel(event: Event, element: HTMLDivElement): void {
    event.preventDefault();
    event.stopPropagation();

    const wheelEvent = event as WheelEvent;
    element.scrollTop += wheelEvent.deltaY;
    element.scrollLeft += wheelEvent.deltaX;
  }
}
