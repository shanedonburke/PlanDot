import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSortButtonComponent } from './item-sort-button.component';

describe('ItemSortButtonComponent', () => {
  let component: ItemSortButtonComponent;
  let fixture: ComponentFixture<ItemSortButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSortButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSortButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
