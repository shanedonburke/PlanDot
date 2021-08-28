import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySnackBarComponent } from './history-snack-bar.component';

describe('HistorySnackBarComponent', () => {
  let component: HistorySnackBarComponent;
  let fixture: ComponentFixture<HistorySnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorySnackBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorySnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
