import {
  Component,
  ComponentFactoryResolver,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { v4 } from 'uuid';
import { DayViewComponent } from './components/day-view/day-view.component';
import { GroupEditDialogComponent } from './components/group-edit-dialog/group-edit-dialog.component';
import { GroupViewComponent } from './components/group-view/group-view.component';
import { MonthViewComponent } from './components/month-view/month-view.component';
import { ViewDirective } from './directives/view.directive';
import { Group } from './domain/group';
import { createItem } from './domain/item';
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
  isGroupsMenuVisible = false;
  isGroupEditDialogOpen = false;

  @ViewChild(ViewDirective, { static: true }) viewHost!: ViewDirective;

  private static VIEW_COMPONENTS: { [key in View]: any } = {
    [View.Group]: GroupViewComponent,
    [View.Month]: MonthViewComponent,
    [View.Day]: DayViewComponent,
  };

  constructor(
    public readonly dialog: MatDialog,
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userAuthService: UserAuthService,
    public readonly userDataService: UserDataService,
    public readonly viewService: ViewService,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.userDataService.loadUserData();
  }

  ngOnInit() {
    this.viewService.setViewLoader(this.loadView.bind(this));
  }

  addGroup() {
    this.editGroup({
      id: v4(),
      name: `Group ${this.groupService.getGroups().length + 1}`,
      color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
      itemIds: [],
    });
  }

  editGroup(group: Group) {
    this.isGroupEditDialogOpen = true;
    const dialogRef = this.dialog.open(GroupEditDialogComponent, {
      data: { group: { ...group } },
    });

    dialogRef.afterClosed().subscribe((result: Group) => {
      this.isGroupEditDialogOpen = false;
      if (result) {
        this.isGroupsMenuVisible = false;
        this.groupService.updateOrCreateGroup(group, result);
        this.userDataService.saveUserData();
      }
    });
  }

  toggleGroupsMenu(event: MouseEvent) {
    this.isGroupsMenuVisible = !this.isGroupsMenuVisible;
    event.stopPropagation();
  }

  addNewItem() {
    this.userDataService.editItem(createItem());
  }

  @HostListener('document:click', ['$event'])
  closeGroupsMenu() {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
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
}
