import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IconButtonModule } from 'src/app/components/widgets/icon-button/icon-button.module';
import { ItemSortButtonModule } from 'src/app/components/widgets/item-sort-button/item-sort-button.module';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { getTestUtils } from 'src/test-utils';
import { ItemListToolbarComponent } from './item-list-toolbar.component';

describe('ItemListToolbarComponent', () => {
  const {
    findButtonWithText,
    clickCheckbox,
    findInputWithPlaceholder,
    enterText,
    clickDocument,
  } = getTestUtils(() => fixture);

  let component: ItemListToolbarComponent;
  let fixture: ComponentFixture<ItemListToolbarComponent>;

  let searchService: jasmine.SpyObj<SearchService>;
  let userDataService: jasmine.SpyObj<UserDataService>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [ItemListToolbarComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: UserDataService, useValue: userDataService },
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatTooltipModule,
        MatCheckboxModule,
        IconButtonModule,
        ItemSortButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort by date', () => {
    component.sortByDate();

    expect(userDataService.sortItemsByDate)
      .withContext('should sort items')
      .toHaveBeenCalled();
    expect(searchService.update)
      .withContext('should update search')
      .toHaveBeenCalled();
  });

  it('should sort by title', () => {
    component.sortByTitle();

    expect(userDataService.sortItemsByTitle)
      .withContext('should sort items')
      .toHaveBeenCalled();
    expect(searchService.update)
      .withContext('should update search')
      .toHaveBeenCalled();
  });

  it('should sort by favorited', () => {
    component.sortByFavorited();

    expect(userDataService.sortItemsByFavorited)
      .withContext('should sort items')
      .toHaveBeenCalled();
    expect(searchService.update)
      .withContext('should update search')
      .toHaveBeenCalled();
  });

  it('should update search value', () => {
    const input = findInputWithPlaceholder('Search');
    enterText(input, 'test');
    input.dispatchEvent(new Event('keyup'));

    expect(searchService.update)
      .withContext('should update search')
      .toHaveBeenCalled();
  });

  it('should clear search', () => {
    findButtonWithText('close')!!.click();
    expect(searchService.clearSearch).toHaveBeenCalled();
  });

  describe('when filter menu is open', () => {
    beforeEach(async () => {
      findButtonWithText('filter_list')!!.click();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should disable "With date" filter', () => {
      clickCheckbox('With date');

      expect(searchService.filter.withDate)
        .withContext('should disable filter')
        .toBeFalse();
      expect(searchService.update)
        .withContext('should update search')
        .toHaveBeenCalled();
    });

    it('should disable "Without date" filter', () => {
      clickCheckbox('Without date');

      expect(searchService.filter.withoutDate)
        .withContext('should disable filter')
        .toBeFalse();
      expect(searchService.update)
        .withContext('should update search')
        .toHaveBeenCalled();
    });

    it('should disable "Not favorited" filter', () => {
      clickCheckbox('Not favorited');

      expect(searchService.filter.notFavorited)
        .withContext('should disable filter')
        .toBeFalse();
      expect(searchService.update)
        .withContext('should update search')
        .toHaveBeenCalled();
    });

    it('should close filter menu on document click', () => {
      clickDocument();
      expect(fixture.nativeElement.querySelector('.filter-menu')).toBeFalsy();
    });
  });

  function setup(): void {
    searchService = jasmine.createSpyObj(
      'SearchService',
      ['update', 'clearSearch'],
      {
        filter: {
          withDate: true,
          withoutDate: true,
          notFavorited: true,
        },
        searchValue: '',
      }
    );
    userDataService = jasmine.createSpyObj('UserDataService', [
      'sortItemsByDate',
      'sortItemsByTitle',
      'sortItemsByFavorited',
    ]);
  }
});
