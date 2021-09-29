import { Component, OnDestroy, OnInit } from '@angular/core';
import * as createDOMPurify from 'dompurify';
import * as marked from 'marked';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/domain/item';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';

/**
 * Component for the item list view. All items are displayed in a list.
 * The user may reorder items by dragging them.
 */
@Component({
  selector: 'app-item-list-view',
  templateUrl: './item-list-view.component.html',
  styleUrls: ['./item-list-view.component.scss'],
})
export class ItemListViewComponent implements OnInit, OnDestroy {
  /** True when user data loading is done (even if there is no data) */
  isUserDataLoaded = false;

  /** Emits when the component is destroyed. */
  private onComponentDestroyed = new Subject<void>();

  constructor(
    public readonly searchService: SearchService,
    public readonly userDataService: UserDataService
  ) {
    this.userDataService.onUserDataLoaded
      .pipe(takeUntil(this.onComponentDestroyed))
      .subscribe(() => {
        this.isUserDataLoaded = true;
      });
  }

  ngOnInit() {
    this.searchService.update();
  }

  ngOnDestroy(): void {
    this.onComponentDestroyed.next();
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
   * Tracks an item by its ID.
   * @param index Index of the item within its `ngFor`
   * @param item The item to track
   * @returns The item's ID
   */
  trackItemById(index: number, item: Item): string {
    return item.id;
  }
}
