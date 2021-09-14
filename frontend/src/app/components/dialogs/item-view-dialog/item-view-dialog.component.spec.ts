import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewDialogComponent } from './item-view-dialog.component';

describe('ItemViewDialogComponent', () => {
  let component: ItemViewDialogComponent;
  let fixture: ComponentFixture<ItemViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
