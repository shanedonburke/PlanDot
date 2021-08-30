import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isView, View } from '../domain/view';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private view: View | null = null;
  private viewLoader: ((view: View) => void) | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const { view } = this.route.snapshot.queryParams;
        if (isView(view)) {
          this.view = view;
          this.viewLoader && this.viewLoader(this.view);
        } else {
          this.goToGroupView();
        }
      }
    });
  }

  goToGroupView() {
    this.setView(View.Group);
  }

  goToMonthView() {
    this.setView(View.Month);
  }

  goToDayView() {
    this.setView(View.Day);
  }

  goToItemListView() {
    this.setView(View.ItemList);
  }

  isGroupView(): boolean {
    return this.view === View.Group;
  }

  isMonthView(): boolean {
    return this.view === View.Month;
  }

  isDayView(): boolean {
    return this.view === View.Day;
  }

  isItemListView(): boolean {
    return this.view === View.ItemList;
  }

  setViewLoader(loader: (view: View) => void): void {
    this.viewLoader = loader;
    this.view && this.viewLoader(this.view);
  }

  private setView(
    view: View,
    extraQueryParams: { [key: string]: string } = {}
  ): void {
    this.router.navigate([], { queryParams: { view, ...extraQueryParams } });
  }
}
