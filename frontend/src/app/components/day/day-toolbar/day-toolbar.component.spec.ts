import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayToolbarComponent } from './day-toolbar.component';

describe('DayToolbarComponent', () => {
  let component: DayToolbarComponent;
  let fixture: ComponentFixture<DayToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
