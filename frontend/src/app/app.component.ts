import {
  Component,
  ComponentFactoryResolver,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialogComponent } from './components/dialogs/help-dialog/help-dialog.component';
import { DayToolbarComponent } from './components/views/day/day-toolbar/day-toolbar.component';
import { DayViewComponent } from './components/views/day/day-view/day-view.component';
import { GroupToolbarComponent } from './components/views/group/group-toolbar/group-toolbar.component';
import { GroupViewComponent } from './components/views/group/group-view/group-view.component';
import { ItemListToolbarComponent } from './components/views/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListViewComponent } from './components/views/item-list/item-list-view/item-list-view.component';
import { MonthToolbarComponent } from './components/views/month/month-toolbar/month-toolbar.component';
import { MonthViewComponent } from './components/views/month/month-view/month-view.component';
import { ToolbarDirective } from './directives/toolbar.directive';
import { ViewDirective } from './directives/view.directive';
import { Item } from './domain/item';
import { View } from './domain/view';
import { DateService } from './services/date.service';
import { UserAuthService } from './services/user-auth.service';
import { UserDataService } from './services/user-data.service';
import { ViewService } from './services/view.service';

/**
 * The main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  /** Where a view (e.g., the group view) will be loaded */
  @ViewChild(ViewDirective) viewHost!: ViewDirective;

  /** Where a toolbar (eg., the day view's toolbar) will be loaded */
  @ViewChild(ToolbarDirective) toolbarHost!: ToolbarDirective;

  /** The components to load for each view */
  private static VIEW_COMPONENTS: { [key in View]: any } = {
    [View.GROUP]: GroupViewComponent,
    [View.MONTH]: MonthViewComponent,
    [View.DAY]: DayViewComponent,
    [View.ITEM_LIST]: ItemListViewComponent,
  };

  /** The components to load for each view's toolbar */
  private static TOOLBAR_COMPONENTS: { [key in View]: any } = {
    [View.GROUP]: GroupToolbarComponent,
    [View.MONTH]: MonthToolbarComponent,
    [View.DAY]: DayToolbarComponent,
    [View.ITEM_LIST]: ItemListToolbarComponent,
  };

  constructor(
    public readonly navigator: Navigator,
    public readonly userAuthService: UserAuthService,
    public readonly userDataService: UserDataService,
    public readonly viewService: ViewService,
    private readonly dateService: DateService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    // Logged in?
    if (this.userAuthService.hasAuth()) {
      this.userDataService.loadUserData();
      // Load the view through this component it's set by ViewService
      this.viewService.setViewLoader(this.loadViewAndToolbar.bind(this));
    }
  }

  /**
   * Add a new item. If the day view is active, the item will be created
   * with the date enabled and set to the date being viewed.
   */
  addNewItem() {
    const item = this.viewService.isDayView()
      ? new Item({ isDateEnabled: true, date: this.dateService.date })
      : new Item();
    this.userDataService.editItem(item);
  }

  /**
   * Open the help dialog, as triggered by the primary toolbar button.
   */
  openHelpDialog(): void {
    this.dialog.open(HelpDialogComponent, { autoFocus: false });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          if (this.userDataService.canUndo()) {
            this.userDataService.undo();
          }
          break;
        case 'y':
          if (this.userDataService.canRedo()) {
            this.userDataService.redo();
          }
          break;
        }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    event.preventDefault();
    window.scrollTo(0, 0);
  }

  /**
   * Load a new view (the main component and its toolbar addition).
   * @param view The view to load
   */
  private loadViewAndToolbar(view: View) {
    this.loadView(view);
    this.loadToolbar(view);
  }

  /**
   * Load the main view component for the given view.
   * @param view The view to load
   */
  private loadView(view: View) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        AppComponent.VIEW_COMPONENTS[view]
      );
    const viewContainerRef = this.viewHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

  /**
   * Loads the toolbar addition for the given view. This encompasses everything
   * to the right of 'New item' in the secondary toolbar.
   * @param view The view to load a toolbar for
   */
  private loadToolbar(view: View) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        AppComponent.TOOLBAR_COMPONENTS[view]
      );
    const toolbarRef = this.toolbarHost.viewContainerRef;
    toolbarRef.clear();
    toolbarRef.createComponent(componentFactory);
  }
}
