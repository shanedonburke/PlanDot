import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateService } from 'src/app/services/date.service';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { ViewService } from 'src/app/services/view.service';

import { MonthViewComponent } from './month-view.component';

describe('MonthViewComponent', () => {
  let component: MonthViewComponent;
  let fixture: ComponentFixture<MonthViewComponent>;

  let itemService: jasmine.SpyObj<ItemService>;
  let groupService: jasmine.SpyObj<GroupService>;
  let dateService: jasmine.SpyObj<DateService>;
  let viewService: jasmine.SpyObj<ViewService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
