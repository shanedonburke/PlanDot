import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { DateService } from 'src/app/services/date.service';
import { getTodaysDate } from 'src/app/util/dates';

import { DayToolbarComponent } from './day-toolbar.component';

describe('DayToolbarComponent', () => {
  let component: DayToolbarComponent;
  let fixture: ComponentFixture<DayToolbarComponent>;

  let dateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [DayToolbarComponent],
      providers: [{ provide: DateService, useValue: dateService }],
      imports: [MatIconModule, MatButtonModule, MatTooltipModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable reset button', () => {
    expect(getResetButton().componentInstance.disabled).toBeTrue();
  });

  it('should not disable reset button', () => {
    (
      Object.getOwnPropertyDescriptor(dateService, 'date')!!.get as jasmine.Spy
    ).and.returnValue(new Date('09/16/2020'));
    fixture.detectChanges();
    expect(getResetButton().componentInstance.disabled).toBeFalse();
  });

  it('should reset date', () => {
    getResetButton().triggerEventHandler('click', null);
    expect(dateService.date).toEqual(getTodaysDate());
  });

  function setup() {
    dateService = jasmine.createSpyObj('DateService', ['resetDay'], {
      date: getTodaysDate(),
    });
  }

  function getResetButton(): DebugElement {
    return fixture.debugElement.query(By.directive(MatButton));
  }
});
