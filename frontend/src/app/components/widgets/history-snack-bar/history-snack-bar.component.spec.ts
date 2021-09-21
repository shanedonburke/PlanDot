import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {
  HistorySnackBarComponent,
  HistorySnackBarData,
} from './history-snack-bar.component';

describe('HistorySnackBarComponent', () => {
  let component: HistorySnackBarComponent;
  let fixture: ComponentFixture<HistorySnackBarComponent>;

  let data: HistorySnackBarData;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [HistorySnackBarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: data }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorySnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have event text', () => {
    expect(fixture.nativeElement.innerText).toContain(data.event);
  });

  it('should have action description', () => {
    expect(fixture.nativeElement.innerText).toContain(data.actionDescription);
  });

  function setup(): void {
    data = {
      event: 'Undid',
      actionDescription: 'Sort group items',
    };
  }
});
