import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isView, View } from '../domain/view';

/**
 * Service to manage the views of the application and switching between them.
 */
@Injectable({
  providedIn: 'root',
})
export class ViewService {
  /** The current view, derived from the `view` query parameter */
  private view: View | null = null;

  /** The function to call when a view is to be loaded */
  private viewLoader: ((view: View) => void) | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      // Navigation is finished, so we're ready to load a view
      if (event instanceof NavigationEnd) {
        const { view } = this.route.snapshot.queryParams;
        if (isView(view)) {
          this.view = view;
          this.viewLoader && this.viewLoader(this.view);
        } else {
          // Group view is the default view
          this.goToGroupView();
        }
      }
    });
  }

  /**
   * Go to the group view.
   */
  goToGroupView() {
    this.setView(View.GROUP);
  }

  /**
   * Go to the month view.
   */
  goToMonthView() {
    this.setView(View.MONTH);
  }

  /**
   * Go to the day view.
   */
  goToDayView() {
    this.setView(View.DAY);
  }

  /**
   * Go to the item list view.
   */
  goToItemListView() {
    this.setView(View.ITEM_LIST);
  }

  /**
   * @returns True if the group view is the current view.
   */
  isGroupView(): boolean {
    return this.view === View.GROUP;
  }

  /**
   * @returns True if the month view is the current view.
   */
  isMonthView(): boolean {
    return this.view === View.MONTH;
  }

  /**
   * @returns True if the day view is the current view.
   */
  isDayView(): boolean {
    return this.view === View.DAY;
  }

  /**
   * @returns True if the day view view is the current view.
   */
  isItemListView(): boolean {
    return this.view === View.ITEM_LIST;
  }

  /**
   * Sets the view loader callback, which is called when navigation is
   * finished and a view is ready to be loaded.
   * @param loader The function to call when a view is to be loaded
   */
  setViewLoader(loader: (view: View) => void): void {
    this.viewLoader = loader;
    this.view && this.viewLoader(this.view);
  }

  /**
   * Sets the view by navigating with the `view` query parameter set.
   * @param view The view to set
   * @param extraQueryParams Any extra query parameters as a dictionary
   */
  private setView(
    view: View,
    extraQueryParams: { [key: string]: string } = {}
  ): void {
    this.router.navigate([], { queryParams: { view, ...extraQueryParams } });
  }
}
