import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockComponent } from 'ng-mocks';
import { Subject } from 'rxjs';
import { ItemCardComponent } from 'src/app/components/widgets/item-card/item-card.component';
import { SwipeRevealDirective } from 'src/app/directives/swipe-reveal.directive';
import { Item } from 'src/app/domain/item';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ItemListViewComponent } from './item-list-view.component';

describe('ItemListViewComponent', () => {
  let component: ItemListViewComponent;
  let fixture: ComponentFixture<ItemListViewComponent>;

  let items: Array<Item>;

  let searchService: jasmine.SpyObj<SearchService>;
  let userDataService: jasmine.SpyObj<UserDataService>;

  let onUserDataLoaded: Subject<void>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [
        ItemListViewComponent,
        MockComponent(ItemCardComponent),
        SwipeRevealDirective,
      ],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: UserDataService, useValue: userDataService },
      ],
      imports: [MatIconModule, MatProgressSpinnerModule, DragDropModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner', () => {
    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });

  describe('when user data is loaded', () => {
    beforeEach(async () => {
      onUserDataLoaded.next();
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should hide spinner', () => {
      expect(fixture.nativeElement.querySelector('mat-spinner')).toBeFalsy();
    });

    it('should show item cards', () => {
      expect(
        fixture.nativeElement.querySelectorAll('app-item-card').length
      ).toBe(items.length);
    });

    it('should handle mouse wheel on description', () => {
      const event = jasmine.createSpyObj(
        'WheelEvent',
        ['stopPropagation', 'preventDefault'],
        { deltaX: 10, deltaY: 20 }
      );
      const element = { scrollTop: 0, scrollLeft: 0 } as HTMLDivElement;

      component.onDescriptionMouseWheel(event, element);

      expect(element.scrollTop)
        .withContext('wrong vertical scroll')
        .toEqual(event.deltaY);
      expect(element.scrollLeft)
        .withContext('wrong horizontal scroll')
        .toEqual(event.deltaX);
    });
  });

  function setup(): void {
    items = [new Item(), new Item()];
    onUserDataLoaded = new Subject<void>();

    searchService = jasmine.createSpyObj('SearchService', ['update'], {
      filteredItems: items,
    });
    userDataService = jasmine.createSpyObj('UserDataService', ['deleteItem'], {
      onUserDataLoaded,
    });
  }
});
