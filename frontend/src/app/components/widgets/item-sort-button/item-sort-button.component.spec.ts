import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTestUtils } from 'src/test-utils';

import { ItemSortButtonComponent } from './item-sort-button.component';

describe('ItemSortButtonComponent', () => {
  const { findButtonWithText } = getTestUtils(() => fixture);

  let component: ItemSortButtonComponent;
  let fixture: ComponentFixture<ItemSortButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSortButtonComponent],
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatTooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSortButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with menu open', () => {
    beforeEach(() => {
      findButtonWithText('sort')!!.click();
      fixture.detectChanges();
    });

    it('should sort by date', () => {
      const sortByDateSpy = spyOn(component.sortByDate, 'next');
      getMenuButton(0).click();
      expect(sortByDateSpy).toHaveBeenCalled();
    });

    it('should sort by title', () => {
      const sortByTitleSpy = spyOn(component.sortByTitle, 'next');
      getMenuButton(1).click();
      expect(sortByTitleSpy).toHaveBeenCalled();
    });

    it('should sort by favorited', () => {
      const sortByFavoritedSpy = spyOn(component.sortByFavorited, 'next');
      getMenuButton(2).click();
      expect(sortByFavoritedSpy).toHaveBeenCalled();
    });
  });

  function getMenuButton(index: number): HTMLElement {
    return fixture.nativeElement.parentNode.querySelector('.mat-menu-content')
      .children[index];
  }
});
