import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { ViewHeaderComponent } from 'src/app/components/widgets/view-header/view-header.component';
import { ViewHeaderModule } from 'src/app/components/widgets/view-header/view-header.module';
import { Item, TimePeriod } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { getTestUtils } from 'src/test-utils';

import { DayViewComponent } from './day-view.component';

describe('DayViewComponent', () => {
  let { findElementByXPath } = getTestUtils(() => fixture);

  let component: DayViewComponent;
  let fixture: ComponentFixture<DayViewComponent>;

  let date: Date;
  let timelessItem: Item;
  let items: Array<Item>;

  let onDateChanged: Subject<void>;
  let onUserDataChanged: Subject<void>;

  let itemService: jasmine.SpyObj<ItemService>;
  let dateService: jasmine.SpyObj<DateService>;
  let userDataService: { onUserDataChanged: Observable<void> };
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [DayViewComponent],
      providers: [
        { provide: ItemService, useValue: itemService },
        { provide: DateService, useValue: dateService },
        { provide: UserDataService, useValue: userDataService },
        { provide: MatDialog, useValue: dialog },
      ],
      imports: [MatDialogModule, MatIconModule, ViewHeaderModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have one timeless item', () => {
    expect(component.timelessItems).toEqual([timelessItem]);
  });

  it('should have two columns', () => {
    expect(component.numColumns).withContext('wrong numColumns').toEqual(2);
    expect(component.columns.length)
      .withContext('wrong number of elements in columns array')
      .toEqual(2);
  });

  it('should have 2 items in first column', () => {
    expect(component.columns[0].length).toEqual(2);
  });

  it('should have 1 item in second column', () => {
    expect(component.columns[1].length).toEqual(1);
  });

  it('should go to previous date', () => {
    getViewHeader().triggerEventHandler('previous', null);
    expect(dateService.goToPrevDate).toHaveBeenCalled();
  });

  it('should go to next date', () => {
    getViewHeader().triggerEventHandler('next', null);
    expect(dateService.goToNextDate).toHaveBeenCalled();
  });

  it('should expand timeless item', () => {
    findElementByXPath('//div[@id="timeless-items"]/div')!!.click();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should expand item with time', () => {
    findElementByXPath(
      '//div[@class="day-view-grid"]//div[@class="day-view-item"]'
    )!!.click();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should update when date changes', async () => {
    const newDate = new Date('09/18/2020');
    items = [
      new Item({
        isDateEnabled: true,
        date,
        isStartTimeEnabled: true,
        startTime: { hours: 11, minutes: 0, period: TimePeriod.AM },
        isEndTimeEnabled: true,
        endTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
      }),
      new Item({
        isDateEnabled: true,
        date,
        isStartTimeEnabled: true,
        startTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
        isEndTimeEnabled: true,
        endTime: { hours: 2, minutes: 0, period: TimePeriod.PM },
      }),
    ];
    itemService.getItemsByDate.and.returnValue(items);

    onDateChanged.next();
    await fixture.whenStable();

    expect(component.timelessItems.length)
      .withContext('should have no timeless items')
      .toEqual(0);
    expect(component.numColumns)
      .withContext('should have one column')
      .toEqual(1);
    expect(component.columns.length)
      .withContext('should have one element in columns array')
      .toEqual(1);
  });

  it('should update when user data changes', async () => {
    items.push(new Item({ isDateEnabled: true, date }));
    onUserDataChanged.next();
    await fixture.whenStable();

    expect(component.timelessItems.length).toEqual(2);
  });

  it('should get hour string', () => {
    const hour = 12 + 1;
    expect(component.getHourString(hour)).toEqual('1 PM');
  });

  function setup(): void {
    date = new Date('09/20/2020');
    timelessItem = new Item({ date, isDateEnabled: true });
    items = [
      new Item({
        isDateEnabled: true,
        date,
        isStartTimeEnabled: true,
        startTime: { hours: 11, minutes: 0, period: TimePeriod.AM },
        isEndTimeEnabled: true,
        endTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
      }),
      new Item({
        isDateEnabled: true,
        date,
        isStartTimeEnabled: true,
        startTime: { hours: 12, minutes: 0, period: TimePeriod.PM },
        isEndTimeEnabled: true,
        endTime: { hours: 2, minutes: 0, period: TimePeriod.PM },
      }),
      new Item({
        isDateEnabled: true,
        date,
        isStartTimeEnabled: true,
        startTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
        isEndTimeEnabled: true,
        endTime: { hours: 2, minutes: 0, period: TimePeriod.PM },
      }),
      timelessItem,
    ];

    onDateChanged = new Subject<void>();
    onUserDataChanged = new Subject<void>();

    itemService = jasmine.createSpyObj('ItemService', [
      'getItemsByDate',
      'getItemBackgroundColor',
      'getItemTextColor',
    ]);
    dateService = jasmine.createSpyObj(
      'DateService',
      ['goToPrevDate', 'goToNextDate'],
      {
        date,
        onDateChanged: onDateChanged.asObservable(),
      }
    );
    userDataService = {
      onUserDataChanged: onUserDataChanged.asObservable(),
    };
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    itemService.getItemsByDate.and.returnValue(items);
    itemService.getItemBackgroundColor.and.returnValue('#000000');
    itemService.getItemTextColor.and.returnValue('#ffffff');
  }

  function getViewHeader(): DebugElement {
    return fixture.debugElement.query(By.directive(ViewHeaderComponent));
  }
});
