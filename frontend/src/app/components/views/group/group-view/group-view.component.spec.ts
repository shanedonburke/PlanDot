import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { GroupNameChipModule } from 'src/app/components/widgets/group-name-chip/group-name-chip.module';
import { ItemCardModule } from 'src/app/components/widgets/item-card/item-card.module';
import { ItemSortButtonModule } from 'src/app/components/widgets/item-sort-button/item-sort-button.module';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';

import { GroupViewComponent } from './group-view.component';

fdescribe('GroupViewComponent', () => {
  let component: GroupViewComponent;
  let fixture: ComponentFixture<GroupViewComponent>;

  let groupOneItems: Array<Item>;
  let groupTwoItems: Array<Item>;
  let groups: Array<Group>;

  let groupService: jasmine.SpyObj<GroupService>;
  let itemService: jasmine.SpyObj<ItemService>;
  let userDataService: jasmine.SpyObj<UserDataService>;

  let onUserDataLoaded: Subject<void>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [GroupViewComponent],
      providers: [
        { provide: GroupService, useValue: groupService },
        { provide: ItemService, useValue: itemService },
        { provide: UserDataService, useValue: userDataService },
      ],
      imports: [
        MatIconModule,
        DragDropModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        GroupNameChipModule,
        ItemCardModule,
        ItemSortButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user data is loaded', () => {
    beforeEach(async () => {
      onUserDataLoaded.next();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should have group elements', () => {
      expect(getGroupElements().length).toBe(groups.length);
    });

    it('should have item cards in group', () => {
      expect(
        getGroupElements().item(0).querySelectorAll('app-item-card').length
      ).toBe(groupOneItems.length);
    });
  });

  function setup(): void {
    groupOneItems = [new Item(), new Item()];
    groupTwoItems = [new Item(), new Item()];
    groups = [
      new Group({ itemIds: groupOneItems.map((item) => item.id) }),
      new Group({ itemIds: groupTwoItems.map((item) => item.id) }),
    ];
    groupOneItems.forEach((item) => (item.groupIds = [groups[0].id]));
    groupTwoItems.forEach((item) => (item.groupIds = [groups[1].id]));

    onUserDataLoaded = new Subject<void>();

    groupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'getGroupCount',
    ]);
    itemService = jasmine.createSpyObj('ItemService', [
      'getItemById',
      'getItemsByGroup',
    ]);
    userDataService = jasmine.createSpyObj(
      'UserDataService',
      ['saveUserData'],
      { onUserDataLoaded }
    );

    groupService.getGroups.and.returnValue(groups);
    groupService.getGroupCount.and.returnValue(groups.length);
    itemService.getItemById.and.callFake((id) => {
      return [...groupOneItems, ...groupTwoItems].find(
        (item) => item.id === id
      );
    });
    itemService.getItemsByGroup.and.callFake((group) => {
      return group === groups[0] ? groupOneItems : groupTwoItems;
    });
  }

  function getGroupElements(): NodeListOf<Element> {
    return fixture.nativeElement.querySelectorAll('.group');
  }
});
