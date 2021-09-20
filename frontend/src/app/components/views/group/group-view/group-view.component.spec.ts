import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockComponent } from 'ng-mocks';
import { Subject } from 'rxjs';
import { GroupNameChipModule } from 'src/app/components/widgets/group-name-chip/group-name-chip.module';
import { ItemCardComponent } from 'src/app/components/widgets/item-card/item-card.component';
import { ItemSortButtonModule } from 'src/app/components/widgets/item-sort-button/item-sort-button.module';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { getTestUtils } from 'src/test-utils';
import { GroupViewComponent } from './group-view.component';

describe('GroupViewComponent', () => {
  let { findButtonWithText } = getTestUtils(() => fixture);

  let component: GroupViewComponent;
  let fixture: ComponentFixture<GroupViewComponent>;

  let itemA: Item;
  let itemB: Item;
  let groupOneItems: Array<Item>;
  let groups: Array<Group>;

  let groupService: jasmine.SpyObj<GroupService>;
  let itemService: jasmine.SpyObj<ItemService>;
  let userDataService: jasmine.SpyObj<UserDataService>;

  let onUserDataLoaded: Subject<void>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [GroupViewComponent, MockComponent(ItemCardComponent)],
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

  it('should show spinner', () => {
    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
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

    it('should add new item', () => {
      findButtonWithText('New item', getGroupElements().item(0))!!.click();
      const item = userDataService.editItem.calls.mostRecent().args[0];
      expect(item.groupIds[0]).toBe(groups[0].id);
    });

    it('should sort items by title', () => {
      component.sortByTitle(groups[0]);
      expect(groups[0].itemIds)
        .withContext('should sort items')
        .toEqual([itemA.id, itemB.id]);
      expect(userDataService.saveUserData)
        .withContext('should save user data')
        .toHaveBeenCalled();
    });

    it('should sort items by date', () => {
      component.sortByDate(groups[0]);
      expect(groups[0].itemIds)
        .withContext('should sort items')
        .toEqual([itemA.id, itemB.id]);
      expect(userDataService.saveUserData)
        .withContext('should save user data')
        .toHaveBeenCalled();
    });

    it('should sort by favorited', () => {
      component.sortByFavorited(groups[0]);
      expect(groups[0].itemIds)
        .withContext('should sort items')
        .toEqual([itemA.id, itemB.id]);
      expect(userDataService.saveUserData)
        .withContext('should save user data')
        .toHaveBeenCalled();
    });

    it('should drop group item', () => {
      component.dropGroupItem(groups[0], {
        previousIndex: 0,
        currentIndex: 1,
      } as CdkDragDrop<Item[], Item[]>);
      expect(groups[0].itemIds)
        .withContext('should reorder items')
        .toEqual([itemA.id, itemB.id]);
      expect(userDataService.saveUserData)
        .withContext('should save user data')
        .toHaveBeenCalled();
    });
  });

  function setup(): void {
    itemA = new Item({
      title: 'A',
      isDateEnabled: true,
      date: new Date('9/19/20'),
      isFavorited: true,
    });
    itemB = new Item({
      title: 'B',
      isDateEnabled: true,
      date: new Date('9/20/20'),
    });
    groupOneItems = [itemB, itemA];
    groups = [
      new Group({ itemIds: groupOneItems.map((item) => item.id) }),
      new Group(),
    ];
    groupOneItems.forEach((item) => (item.groupIds = [groups[0].id]));

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
      ['saveUserData', 'editItem'],
      { onUserDataLoaded }
    );

    groupService.getGroups.and.returnValue(groups);
    groupService.getGroupCount.and.returnValue(groups.length);
    itemService.getItemById.and.callFake((id) => {
      return groupOneItems.find((item) => item.id === id);
    });
    itemService.getItemsByGroup.and.returnValue(groupOneItems);
  }

  function getGroupElements(): NodeListOf<Element> {
    return fixture.nativeElement.querySelectorAll('.group');
  }
});
