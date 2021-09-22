import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { ViewHeaderModule } from 'src/app/components/widgets/view-header/view-header.module';
import { Item } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ViewService } from 'src/app/services/view.service';
import { getTestUtils } from 'src/test-utils';

import { MonthViewComponent } from './month-view.component';

describe('MonthViewComponent', () => {
  const { findElementByXPath } = getTestUtils(() => fixture);

  let component: MonthViewComponent;
  let fixture: ComponentFixture<MonthViewComponent>;

  let items: Array<Item>;

  let onUserDataChanged: Subject<void>;

  let itemService: jasmine.SpyObj<ItemService>;
  let dateService: DateService;
  let viewService: jasmine.SpyObj<ViewService>;
  let userDataService: { onUserDataChanged: Subject<void> };

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [MonthViewComponent],
      providers: [
        { provide: ItemService, useValue: itemService },
        { provide: DateService, useValue: dateService },
        { provide: ViewService, useValue: viewService },
        { provide: UserDataService, useValue: userDataService },
      ],
      imports: [MatIconModule, ViewHeaderModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have items in correct date', () => {
    // Look for item in first day of month (where we expect it to be)
    expect(findElementByXPath(getItemXPath(items[0]))).toBeTruthy();
  });

  it('should show added item', () => {
    items.push(
      new Item({ title: 'test 2', isDateEnabled: true, date: dateService.date })
    );
    onUserDataChanged.next();
    fixture.detectChanges();

    expect(findElementByXPath(getItemXPath(items[0])))
      .withContext('should have first item')
      .toBeTruthy();
    expect(findElementByXPath(getItemXPath(items[1])))
      .withContext('should have second item')
      .toBeTruthy();
  });

  it('should go to day view', () => {
    findElementByXPath('//div[@class="date"][2]')!!.click();

    expect(viewService.goToDayView)
      .withContext('should call ViewService.goToDayView')
      .toHaveBeenCalled();
    expect(dateService.date)
      .withContext('should update date')
      .toEqual(new Date('08/02/2021'));
  });

  it('should get month string', () => {
    expect(component.getMonthString()).toEqual('August 2021');
  });

  it('should have correct number of dates', () => {
    expect(fixture.nativeElement.querySelectorAll('.date').length).toEqual(
      // 6 weeks * 7 days
      7 * 6
    );
  });

  it('should get date aria-label', () => {
    expect(component.getDateAriaLabel(new Date(2021, 7, 1))).toEqual(
      'Sunday August 1 2021'
    );
  });

  function setup(): void {
    onUserDataChanged = new Subject<void>();

    itemService = jasmine.createSpyObj('ItemService', [
      'getItemsByDate',
      'getItemTextColor',
      'getItemBackgroundColor',
    ]);
    dateService = {
      goToPrevMonth: jasmine.createSpy('goToPrevMonth'),
      goToNextMonth: jasmine.createSpy('goToNextMonth'),
      // 08/01/2021 is the first day in its calendar,
      // so we can grab the first child date of the calendar
      date: new Date(2021, 7, 1),
      month: 7,
      year: 2021,
    } as unknown as DateService;
    viewService = jasmine.createSpyObj('ViewService', ['goToDayView']);
    userDataService = { onUserDataChanged };

    items = [
      new Item({ title: 'test', isDateEnabled: true, date: dateService.date }),
    ];

    itemService.getItemsByDate.and.returnValue(items);
    itemService.getItemTextColor.and.returnValue('#ffffff');
    itemService.getItemBackgroundColor.and.returnValue('#000000');
  }

  function getItemXPath(item: Item): string {
    // All items are in the first day of the month/calendar
    return `//div[@class="date"][1]//div[contains(text(), "${item.title}")]`;
  }
});
