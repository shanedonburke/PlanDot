import {
  Component,
  ComponentFactoryResolver, OnInit,
  ViewChild
} from '@angular/core';
import { DayToolbarComponent } from './components/day/day-toolbar/day-toolbar.component';
import { DayViewComponent } from './components/day/day-view/day-view.component';
import { GroupToolbarComponent } from './components/group/group-toolbar/group-toolbar.component';
import { GroupViewComponent } from './components/group/group-view/group-view.component';
import { ItemListToolbarComponent } from './components/item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListViewComponent } from './components/item-list/item-list-view/item-list-view.component';
import { MonthToolbarComponent } from './components/month/month-toolbar/month-toolbar.component';
import { MonthViewComponent } from './components/month/month-view/month-view.component';
import { ToolbarDirective } from './directives/toolbar.directive';
import { ViewDirective } from './directives/view.directive';
import { Item } from './domain/item';
import { View } from './domain/view';
import { GroupService } from './services/group.service';
import { ItemService } from './services/item.service';
import { UserAuthService } from './services/user-auth.service';
import { UserDataService } from './services/user-data.service';
import { ViewService } from './services/view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(ViewDirective, { static: true }) viewHost!: ViewDirective;
  @ViewChild(ToolbarDirective, { static: true }) toolbarHost!: ToolbarDirective;

  private static VIEW_COMPONENTS: { [key in View]: any } = {
    [View.Group]: GroupViewComponent,
    [View.Month]: MonthViewComponent,
    [View.Day]: DayViewComponent,
    [View.ItemList]: ItemListViewComponent,
  };

  private static TOOLBAR_COMPONENTS: { [key in View]: any } = {
    [View.Group]: GroupToolbarComponent,
    [View.Month]: MonthToolbarComponent,
    [View.Day]: DayToolbarComponent,
    [View.ItemList]: ItemListToolbarComponent,
  };

  constructor(
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userAuthService: UserAuthService,
    public readonly userDataService: UserDataService,
    public readonly viewService: ViewService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
  ) {
    this.userDataService.loadUserData();
  }

  ngOnInit() {
    this.viewService.setViewLoader(this.loadViewAndToolbar.bind(this));
  }

  addNewItem() {
    this.userDataService.editItem(new Item());
  }

  private loadViewAndToolbar(view: View) {
    this.loadView(view);
    this.loadToolbar(view);
  }

  private loadView(view: View) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        AppComponent.VIEW_COMPONENTS[view]
      );
    const viewContainerRef = this.viewHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

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
