import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditDialogComponent } from './item-edit-dialog.component';

describe('ItemEditDialogComponent', () => {
  let component: ItemEditDialogComponent;
  let fixture: ComponentFixture<ItemEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
