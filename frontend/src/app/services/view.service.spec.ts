import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { View } from '../domain/view';

import { ViewService } from './view.service';

describe('ViewService', () => {
  let service: ViewService;

  let router: jasmine.SpyObj<Router>;
  let route: { snapshot: { queryParams: Params } };
  let events: Subject<any>;

  let viewLoader: jasmine.Spy<(view: View) => void>;

  beforeEach(() => {
    setup();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
      ],
    });
    service = TestBed.inject(ViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when view loader has been set', () => {
    beforeEach(() => {
      service.setViewLoader(viewLoader);
    });

    it('should load view', fakeAsync(() => {
      events.next(new NavigationEnd(0, '', ''));
      tick();
      expect(viewLoader).toHaveBeenCalledOnceWith(
        route.snapshot.queryParams.view
      );
    }));

    it('should load group view by default', fakeAsync(() => {
      setViewParam('notAView');
      navigationEnd();
      tick();
      expectNavigate(View.GROUP);
    }));

    it('should go to group view', () => {
      service.goToGroupView();
      expectNavigate(View.GROUP);
    });

    it('should go to month view', () => {
      service.goToMonthView();
      expectNavigate(View.MONTH);
    });

    it('should go to day view', () => {
      service.goToDayView();
      expectNavigate(View.DAY);
    });

    it('should go to item list view', () => {
      service.goToItemListView();
      expectNavigate(View.ITEM_LIST);
    });

    it('should be group view', fakeAsync(() => {
      setViewParam(View.GROUP);
      navigationEnd();
      tick();
      expect(service.isGroupView())
        .withContext('should be group view')
        .toBeTrue();
    }));

    it('should be month view', fakeAsync(() => {
      setViewParam(View.MONTH);
      navigationEnd();
      tick();
      expect(service.isMonthView())
        .withContext('should be month view')
        .toBeTrue();
    }));

    it('should be day view', fakeAsync(() => {
      setViewParam(View.DAY);
      navigationEnd();
      tick();
      expect(service.isDayView()).withContext('should be day view').toBeTrue();
    }));

    it('should be item list view', fakeAsync(() => {
      setViewParam(View.ITEM_LIST);
      navigationEnd();
      tick();
      expect(service.isItemListView())
        .withContext('should be item list view')
        .toBeTrue();
    }));
  });

  function setup(): void {
    events = new Subject();
    route = {
      snapshot: {
        queryParams: {
          view: View.DAY,
        },
      },
    };
    router = jasmine.createSpyObj('Router', ['navigate'], {
      events,
    });

    viewLoader = jasmine.createSpy();
  }

  function setViewParam(view: string): void {
    route.snapshot.queryParams.view = view;
  }

  function navigationEnd(): void {
    events.next(new NavigationEnd(0, '', ''));
  }

  function expectNavigate(view: View): void {
    expect(router.navigate)
      .withContext(`should navigate to ?view=${view}`)
      .toHaveBeenCalledOnceWith([], {
        queryParams: { view },
      });
  }
});
