import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Group } from 'src/app/domain/group';
import { Item, Repeat, TimePeriod } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { GroupService } from 'src/app/services/group.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ViewService } from 'src/app/services/view.service';
import { getTestUtils } from 'src/test-utils';
import { FavoriteButtonModule } from '../../widgets/favorite-button/favorite-button.module';
import { GroupNameChipModule } from '../../widgets/group-name-chip/group-name-chip.module';
import { IconButtonComponent } from '../../widgets/icon-button/icon-button.component';
import { IconButtonModule } from '../../widgets/icon-button/icon-button.module';

import {
  ItemViewDialogComponent,
  ItemViewDialogData,
} from './item-view-dialog.component';

describe('ItemViewDialogComponent', () => {
  let { findButtonWithText, findElementWithText } = getTestUtils(() => fixture);

  let component: ItemViewDialogComponent;
  let fixture: ComponentFixture<ItemViewDialogComponent>;

  let item: Item;
  let group: Group;

  let userDataService: jasmine.SpyObj<UserDataService>;
  let groupService: jasmine.SpyObj<GroupService>;
  let dateService: { date: Date };
  let viewService: jasmine.SpyObj<ViewService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ItemViewDialogComponent>>;
  let data: ItemViewDialogData;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [ItemViewDialogComponent],
      providers: [
        { provide: UserDataService, useValue: userDataService },
        { provide: GroupService, useValue: groupService },
        { provide: DateService, useValue: dateService },
        { provide: ViewService, useValue: viewService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        GroupNameChipModule,
        IconButtonModule,
        FavoriteButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit item', async () => {
    fixture.debugElement
      .query(By.directive(IconButtonComponent))
      .triggerEventHandler('click', null);

    await fixture.whenStable();
    expect(userDataService.editItem).toHaveBeenCalledWith(item, true);
  });

  it('should go to date', () => {
    fixture.debugElement.query(By.css('a')).triggerEventHandler('click', null);
    expect(dialogRef.close)
      .withContext('should close dialog')
      .toHaveBeenCalledOnceWith();
    expect(Object.getOwnPropertyDescriptor(dateService, 'date')!!.set)
      .withContext('should set date')
      .toHaveBeenCalledOnceWith(item.date);
    expect(viewService.goToDayView).toHaveBeenCalledOnceWith();
  });

  it('should delete item', () => {
    findButtonWithText('Delete')!!.click();

    expect(userDataService.deleteItem)
      .withContext('should delete item')
      .toHaveBeenCalledWith(item);
    expect(dialogRef.close)
      .withContext('should close dialog')
      .toHaveBeenCalledOnceWith();
  });

  it('should close dialog', () => {
    findButtonWithText('Close')!!.click();

    expect(dialogRef.close)
      .withContext('should close dialog')
      .toHaveBeenCalledOnceWith();
  });

  it('should have group chip', () => {
    expect(findElementWithText('app-group-name-chip', group.name)).toBeTruthy();
  });

  function setup(): void {
    group = new Group();
    item = new Item({
      description: 'description',
      location: 'location',
      isDateEnabled: true,
      date: new Date('9/18/2021'),
      isStartTimeEnabled: true,
      startTime: {
        hours: 12,
        minutes: 0,
        period: TimePeriod.PM,
      },
      isEndTimeEnabled: true,
      endTime: {
        hours: 1,
        minutes: 0,
        period: TimePeriod.PM,
      },
      repeat: Repeat.DAILY_WEEKLY,
      groupIds: [group.id],
    });

    userDataService = jasmine.createSpyObj('UserDataService', [
      'editItem',
      'deleteItem',
    ]);
    groupService = jasmine.createSpyObj('GroupService', ['getGroupById']);
    dateService = { date: new Date() };
    viewService = jasmine.createSpyObj('ViewService', ['goToDayView']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    data = { item };

    Object.defineProperty(dateService, 'date', {
      set: jasmine.createSpy()
    });

    groupService.getGroupById.and.returnValue(group);

    const afterClosed = new Subject<void>();
    dialogRef.afterClosed.and.returnValue(afterClosed);
    dialogRef.close.and.callFake(() => afterClosed.next());
  }
});
