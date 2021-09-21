import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateService } from 'src/app/services/date.service';

import { MonthToolbarComponent } from './month-toolbar.component';

describe('MonthToolbarComponent', () => {
  let component: MonthToolbarComponent;
  let fixture: ComponentFixture<MonthToolbarComponent>;

  let dateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [MonthToolbarComponent],
      providers: [{ provide: DateService, useValue: dateService }],
      imports: [MatIconModule, MatButtonModule, MatTooltipModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable reset button', () => {
    expect(getResetButton().disabled).toBeTrue();
  });

  describe('when reset button is enabled', () => {
    beforeEach(() => {
      (
        Object.getOwnPropertyDescriptor(dateService, 'year')!!
          .get as jasmine.Spy
      ).and.returnValue(2001);
      fixture.detectChanges();
    });

    it('should not disable reset button', () => {
      expect(getResetButton().disabled).toBeFalse();
    })

    it('should reset month', () => {
      fixture.nativeElement.querySelector('button').click();
      expect(dateService.resetMonth).toHaveBeenCalled();
    });
  });

  function setup() {
    dateService = jasmine.createSpyObj('DateService', ['resetMonth'], {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
  }

  function getResetButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }
});
