import { TestBed } from '@angular/core/testing';
import { getTodaysDate } from '../util/dates';

import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize date to today', () => {
    expect(service.date).toEqual(getTodaysDate());
  });

  it('should initialize month to this month', () => {
    expect(service.month).toEqual(getTodaysDate().getMonth());
  });

  it('should initialize year to this year', () => {
    expect(service.year).toEqual(getTodaysDate().getFullYear());
  });

  it('should set date and notify subscribers', (done) => {
    const newDate = new Date(2020, 1, 1);
    service.onDateChanged.subscribe((date) => {
      expect(date).toEqual(newDate);
      done();
    });
    service.date = newDate;
  });

  it('should reset date', () => {
    service.date = new Date(2020, 1, 1);
    service.resetDate();
    expect(service.date).toEqual(getTodaysDate());
  });

  it('should reset month', () => {
    service.month = 0;
    service.year = 1998;
    service.resetMonth();

    expect(service.month)
      .withContext('wrong month index')
      .toEqual(getTodaysDate().getMonth());
    expect(service.year)
      .withContext('wrong year')
      .toEqual(getTodaysDate().getFullYear());
  });

  it('should go to previous date', () => {
    service.date = new Date(2020, 0, 2);
    service.goToPrevDate();
    expect(service.date).toEqual(new Date(2020, 0, 1));
  });

  it('should go to next date', () => {
    service.date = new Date(2020, 0, 2);
    service.goToNextDate();
    expect(service.date).toEqual(new Date(2020, 0, 3));
  });

  it('should go to previous month', () => {
    service.month = 0;
    service.year = 2005;
    service.goToPrevMonth();

    expect(service.month).withContext('wrong month').toEqual(11);
    expect(service.year).withContext('wrong year').toEqual(2004);
  });

  it('should go to next month', () => {
    service.month = 11;
    service.year = 2005;
    service.goToNextMonth();

    expect(service.month).withContext('wrong month').toEqual(0);
    expect(service.year).withContext('wrong year').toEqual(2006);
  });
});
