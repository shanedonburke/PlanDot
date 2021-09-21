import { TestBed } from '@angular/core/testing';
import { Group } from '../domain/group';
import { Item } from '../domain/item';

import { GroupService } from './group.service';

describe('GroupService', () => {
  let groups: Array<Group>;
  let item: Item;

  let service: GroupService;

  beforeEach(() => {
    setup();

    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupService);

    service.loadGroups(groups);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get groups', () => {
    expect(service.getGroups()).toEqual(groups);
  });

  it('should get group by ID', () => {
    const group = groups[0];
    expect(service.getGroupById(group.id)).toEqual(group);
  });

  it('should not get group by ID', () => {
    expect(service.getGroupById('invalid')).toBeUndefined();
  });

  it('should have group', () => {
    expect(service.hasGroup(groups[0].id)).toBeTrue();
  });

  it('should not have group', () => {
    expect(service.hasGroup('not-a-group-id')).toBeFalse();
  });

  it('should get item groups', () => {
    expect(service.getItemGroups(item)).toEqual([groups[0], groups[1]]);
  });

  it('should delete group', () => {
    const group = groups[0];
    service.deleteGroup(group);
    expect(service.hasGroup(group.id)).toBeFalse();
  });

  it('should update group', () => {
    const group = groups[0].getCopy();
    group.name = 'Updated group';

    service.updateOrCreateGroup(group);

    expect(service.getGroupById(group.id)!!.name)
      .withContext('wrong group name after update')
      .toEqual(group.name);
    expect(service.getGroupCount())
      .withContext('should not add group')
      .toEqual(groups.length);
  });

  it('should create group', () => {
    const group = new Group({ name: 'New group' });

    service.updateOrCreateGroup(group);

    expect(service.getGroupById(group.id)!!.name)
      .withContext('wrong group name after creation')
      .toEqual(group.name);
    expect(service.getGroupCount())
      .withContext('should add group')
      .toEqual(groups.length + 1);
  });

  it('should remove item from groups', () => {
    service.removeItemFromGroups(item);

    expect(groups[0].itemIds.length)
      .withContext('should remove from first group')
      .toEqual(0);
    expect(groups[1].itemIds.length)
      .withContext('should remove from second group')
      .toEqual(0);
  });

  it('should get group count', () => {
    expect(service.getGroupCount()).toEqual(groups.length);
  });

  function setup(): void {
    groups = [
      new Group({ name: 'Group 1' }),
      new Group({ name: 'Group 2' }),
      new Group({ name: 'Group 3' }),
    ];
    item = new Item({ groupIds: [groups[0].id, groups[1].id] });
    groups[0].itemIds = [item.id];
    groups[1].itemIds = [item.id];
  }
});
