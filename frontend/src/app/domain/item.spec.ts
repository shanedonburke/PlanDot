import { Item, ItemTime, Repeat, TimePeriod } from './item';

describe('Item', () => {
  it('should toggle favorite', () => {
    const item = new Item();
    item.toggleFavorite();

    expect(item.isFavorited)
      .withContext('should be true after first toggle')
      .toBeTrue();

    item.toggleFavorite();

    expect(item.isFavorited)
      .withContext('should be false after second toggle')
      .toBeFalse();
  });

  it('should get start time in minutes', () => {
    const item = new Item({
      startTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
    });

    expect(item.getStartTimeInMinutes()).toEqual(720 + 60);
  });

  it('should get end time in minutes', () => {
    const item = new Item({
      endTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
    });

    expect(item.getEndTimeInMinutes()).toEqual(720 + 60);
  });

  it('should get formatted start time', () => {
    const item = new Item({
      startTime: { hours: 1, minutes: 5, period: TimePeriod.PM },
    });

    expect(item.getFormattedStartTime()).toEqual('1:05 PM');
  });

  it('should get formatted start time', () => {
    const item = new Item({
      endTime: { hours: 1, minutes: 5, period: TimePeriod.PM },
    });

    expect(item.getFormattedEndTime()).toEqual('1:05 PM');
  });

  it('should get display time with only start time', () => {
    const item = new Item({
      isStartTimeEnabled: true,
      startTime: { hours: 10, minutes: 5, period: TimePeriod.AM },
    });

    expect(item.getDisplayTime()).toEqual('10:05 AM');
  });

  it('should get display time with both start and end times', () => {
    const item = new Item({
      isStartTimeEnabled: true,
      startTime: { hours: 10, minutes: 5, period: TimePeriod.AM },
      isEndTimeEnabled: true,
      endTime: { hours: 1, minutes: 5, period: TimePeriod.PM },
    });

    expect(item.getDisplayTime()).toEqual('10:05 AM - 1:05 PM');
  });

  it('should compare items with no dates', () => {
    expect(new Item().compareDateTo(new Item())).toEqual(0);
  });

  it('should compare item with date to item with no date', () => {
    expect(
      new Item({ isDateEnabled: true, date: new Date(2020) }).compareDateTo(
        new Item()
      )
    ).toEqual(-1);
  });

  it('should compare item with no date to item with date', () => {
    expect(
      new Item().compareDateTo(
        new Item({ isDateEnabled: true, date: new Date(2020) })
      )
    ).toEqual(1);
  });

  const differentDateCases: Array<[Date, Date, number]> = [
    [new Date(2020, 1, 1), new Date(2020, 1, 2), -1],
    [new Date(2020, 1, 1), new Date(2020, 1, 1), 0],
    [new Date(2020, 1, 1), new Date(2020, 1, 0), 1],
  ];

  differentDateCases.forEach(([date1, date2, expected]) => {
    it(`should compare items with different dates to get ${expected}`, () => {
      expect(
        new Item({ isDateEnabled: true, date: date1 }).compareDateTo(
          new Item({ isDateEnabled: true, date: date2 })
        )
      ).toEqual(expected);
    });
  });

  const differentStartTimeCases: Array<[ItemTime, ItemTime, number]> = [
    [
      { hours: 10, minutes: 5, period: TimePeriod.AM },
      { hours: 10, minutes: 5, period: TimePeriod.AM },
      0,
    ],
    [
      { hours: 10, minutes: 5, period: TimePeriod.AM },
      { hours: 10, minutes: 6, period: TimePeriod.AM },
      -1,
    ],
    [
      { hours: 10, minutes: 5, period: TimePeriod.AM },
      { hours: 10, minutes: 4, period: TimePeriod.AM },
      1,
    ],
  ];

  differentStartTimeCases.forEach(([startTime1, startTime2, expected]) => {
    it(`should compare items with equal dates and different start times to get ${expected}`, () => {
      const date = new Date('09/10/2020');
      expect(
        new Item({
          isDateEnabled: true,
          date,
          isStartTimeEnabled: true,
          startTime: startTime1,
        }).compareDateTo(
          new Item({
            isDateEnabled: true,
            date,
            isStartTimeEnabled: true,
            startTime: startTime2,
          })
        )
      ).toEqual(expected);
    });
  });

  it('should compare item with start time to item with no start time', () => {
    const date = new Date('09/10/2020');
    expect(
      new Item({
        isDateEnabled: true,
        date,
        isStartTimeEnabled: true,
        startTime: { hours: 1, minutes: 5, period: TimePeriod.AM },
      }).compareDateTo(new Item({ isDateEnabled: true, date }))
    ).toEqual(-1);
  });

  it('should compare item with no start time to item with start time', () => {
    const date = new Date('09/10/2020');
    expect(
      new Item({
        isDateEnabled: true,
        date,
      }).compareDateTo(
        new Item({
          isDateEnabled: true,
          date,
          isStartTimeEnabled: true,
          startTime: { hours: 1, minutes: 5, period: TimePeriod.AM },
        })
      )
    ).toEqual(1);
  });

  it('should have exact date', () => {
    const date = new Date('08/02/2021');
    const item = new Item({ isDateEnabled: true, date });
    expect(item.hasDate(date)).toBeTrue();
  });

  it('should not have date when repeat === NEVER', () => {
    const item = new Item({
      isDateEnabled: true,
      date: new Date('08/02/2021'),
    });
    expect(item.hasDate(new Date('08/03/2021'))).toBeFalse();
  });

  it('should not have date when date is not enabled', () => {
    expect(new Item().hasDate(new Date('08/02/2021'))).toBeFalse();
  });

  it('should have date when repeat === YEARLY', () => {
    expect(
      // One year later
      new Item({
        isDateEnabled: true,
        date: new Date(2020, 1, 1),
        repeat: Repeat.YEARLY,
      }).hasDate(new Date(2021, 1, 1))
    ).toBeTrue();
  });

  it('should not have date when repeat === YEARLY', () => {
    expect(
      // 6 months later
      new Item({
        isDateEnabled: true,
        date: new Date(2020, 1, 1),
        repeat: Repeat.YEARLY,
      }).hasDate(new Date(2020, 7, 1))
    ).toBeFalse();
  });

  it('should have date when repeat === MONTHLY', () => {
    expect(
      // 2 months later
      new Item({
        isDateEnabled: true,
        date: new Date(2020, 1, 1),
        repeat: Repeat.MONTHLY,
      }).hasDate(new Date(2020, 3, 1))
    ).toBeTrue();
  });

  it('should not have date when repeat === MONTHLY', () => {
    expect(
      // 2 weeks later
      new Item({
        isDateEnabled: true,
        date: new Date(2020, 1, 1),
        repeat: Repeat.MONTHLY,
      }).hasDate(new Date(2020, 1, 15))
    ).toBeFalse();
  });

  it('should have date when repeat === BI_WEEKLY', () => {
    expect(
      // 2 weeks later
      new Item({
        isDateEnabled: true,
        date: new Date(2020, 1, 1),
        repeat: Repeat.BI_WEEKLY,
      }).hasDate(new Date(2020, 1, 15))
    ).toBeTrue();
  });

  it('should not have date when repeat === BI_WEEKLY', () => {
    expect(
      // 1 week later
      new Item({
        isDateEnabled: true,
        date: new Date(2020, 1, 1),
        repeat: Repeat.MONTHLY,
      }).hasDate(new Date(2020, 1, 8))
    ).toBeFalse();
  });

  it('should have dates when repeat === DAILY_WEEKLY', () => {
    const date = new Date(2021, 8, 6); // Mon 9/6/2021
    const item = new Item({
      isDateEnabled: true,
      date,
      repeat: Repeat.DAILY_WEEKLY,
      weekdays: [1, 3, 5],
    });
    for (let i = 0; i < 7; i++) {
      // Start at Sunday of next week
      expect(item.hasDate(new Date(2021, 8, 6 + 6 + i)))
        .withContext(`should (not) have day ${i}`)
        .toBe(item.weekdays.includes(i));
    }
  });

  it('should send end time to 12:20 PM', () => {
    const item = new Item({
      isDateEnabled: true,
      date: new Date('09/10/2020'),
      isStartTimeEnabled: true,
      startTime: { hours: 11, minutes: 20, period: TimePeriod.AM },
      isEndTimeEnabled: true,
    });
    item.setEndTimeToDefault();
    expect(item.endTime).toEqual({
      hours: 12,
      minutes: 20,
      period: TimePeriod.PM,
    });
  });

  it('should send end time to 11:59 PM', () => {
    const item = new Item({
      isDateEnabled: true,
      date: new Date('09/10/2020'),
      isStartTimeEnabled: true,
      startTime: { hours: 11, minutes: 0, period: TimePeriod.PM },
      isEndTimeEnabled: true,
    });
    item.setEndTimeToDefault();
    expect(item.endTime).toEqual({
      hours: 11,
      minutes: 59,
      period: TimePeriod.PM,
    });
  });

  it('should send end time to 1:15 PM', () => {
    const item = new Item({
      isDateEnabled: true,
      date: new Date('09/10/2020'),
      isStartTimeEnabled: true,
      startTime: { hours: 12, minutes: 15, period: TimePeriod.PM },
      isEndTimeEnabled: true,
    });
    item.setEndTimeToDefault();
    expect(item.endTime).toEqual({
      hours: 1,
      minutes: 15,
      period: TimePeriod.PM,
    });
  });

  it('should get copy', () => {
    const item = new Item({ title: 'My item' });
    const copy = item.getCopy();
    expect(copy).withContext('copy should have same properties').toEqual(item);
    expect(copy).withContext('should not be same object').not.toBe(item);
  })
});
