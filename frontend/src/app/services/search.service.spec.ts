import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Group } from '../domain/group';
import { Item } from '../domain/item';
import { GroupService } from './group.service';
import { ItemService } from './item.service';

import { SearchService } from './search.service';
import { UserDataService } from './user-data.service';

describe('SearchService', () => {
  let service: SearchService;

  let group: Group;
  let items: Array<Item>;

  let itemService: jasmine.SpyObj<ItemService>;
  let groupService: jasmine.SpyObj<GroupService>;
  let userDataService: { onUserDataChanged: Subject<void> };

  beforeEach(() => {
    setup();

    TestBed.configureTestingModule({
      providers: [
        { provide: ItemService, useValue: itemService },
        { provide: GroupService, useValue: groupService },
        { provide: UserDataService, useValue: userDataService },
      ],
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with all items', () => {
    expect(service.filteredItems).toEqual(items);
  });

  it('should not show items with date', () => {
    service.filter.withDate = false;
    service.update();
    expect(service.filteredItems).toEqual([items[2]]);
  });

  it('should not show items without date', () => {
    service.filter.withoutDate = false;
    service.update();
    expect(service.filteredItems).toEqual([items[0], items[1]]);
  });

  it('should not show non-favorited items', () => {
    service.filter.notFavorited = false;
    service.update();
    expect(service.filteredItems).toEqual([items[0]]);
  });

  it('should search by title', () => {
    service.searchValue = items[0].title;
    service.update();
    expect(service.filteredItems).toEqual([items[0]]);
  });

  it('should search by description', () => {
    service.searchValue = items[0].description;
    service.update();
    expect(service.filteredItems).toEqual([items[0]]);
  });

  it('should search by location', () => {
    service.searchValue = items[0].location;
    service.update();
    expect(service.filteredItems).toEqual([items[0]]);
  });

  it('should search by date', () => {
    service.searchValue = items[0].date.toDateString();
    service.update();
    expect(service.filteredItems).toEqual([items[0]]);
  });

  it('should search by group name', () => {
    service.searchValue = group.name;
    service.update();
    expect(service.filteredItems).toEqual([items[0]]);
  });

  it('should clear search', () => {
    service.searchValue = 'no items match this';
    service.update();
    service.clearSearch();
    expect(service.filteredItems).toEqual(items);
  })

  function setup(): void {
    group = new Group({ name: 'My group' });

    items = [
      new Item({
        title: 'Item 1',
        description: 'Item 1 description',
        location: 'Location 1',
        isDateEnabled: true,
        date: new Date(2020, 0, 1),
        isFavorited: true,
        groupIds: [group.id],
      }),
      new Item({
        title: 'Item 2',
        description: 'Item 2 description',
        location: 'Location 2',
        isDateEnabled: true,
        date: new Date(2020, 0, 2),
      }),
      new Item(),
    ];

    itemService = jasmine.createSpyObj('ItemService', ['getItems']);
    groupService = jasmine.createSpyObj('GroupService', ['getItemGroups']);
    userDataService = { onUserDataChanged: new Subject<void>() };

    itemService.getItems.and.returnValue(items);
    groupService.getItemGroups.and.callFake((item) => {
      return item === items[0] ? [group] : [];
    });
  }
});
