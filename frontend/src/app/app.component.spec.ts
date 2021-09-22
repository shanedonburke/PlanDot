import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTestUtils } from 'src/test-utils';
import { AppComponent } from './app.component';
import { HelpDialogComponent } from './components/dialogs/help-dialog/help-dialog.component';
import { HelpPageModule } from './components/dialogs/help-dialog/help-pages/help-pages.module';
import { DayToolbarModule } from './components/views/day/day-toolbar/day-toolbar.module';
import { DayViewModule } from './components/views/day/day-view/day-view.module';
import { GroupToolbarModule } from './components/views/group/group-toolbar/group-toolbar.module';
import { GroupViewModule } from './components/views/group/group-view/group-view.module';
import { ItemListToolbarModule } from './components/views/item-list/item-list-toolbar/item-list-toolbar.module';
import { ItemListViewModule } from './components/views/item-list/item-list-view/item-list-view.module';
import { MonthToolbarModule } from './components/views/month/month-toolbar/month-toolbar.module';
import { MonthViewModule } from './components/views/month/month-view/month-view.module';
import { GroupNameChipModule } from './components/widgets/group-name-chip/group-name-chip.module';
import { DateService } from './services/date.service';
import { UserAuthService } from './services/user-auth.service';
import { UserDataService } from './services/user-data.service';
import { ViewService } from './services/view.service';

describe('AppComponent', () => {
  const { findButtonWithText } = getTestUtils(() => fixture);

  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let userAuthService: jasmine.SpyObj<UserAuthService>;
  let userDataService: jasmine.SpyObj<UserDataService>;
  let viewService: jasmine.SpyObj<ViewService>;
  let dateService: { date: Date };
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: UserAuthService, useValue: userAuthService },
        { provide: UserDataService, useValue: userDataService },
        { provide: ViewService, useValue: viewService },
        { provide: DateService, useValue: dateService },
        { provide: MatDialog, useValue: dialog },
      ],
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatTooltipModule,
        MatDividerModule,
        MatIconModule,
        MatDialogModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatMenuModule,
        GroupViewModule,
        MonthViewModule,
        DayViewModule,
        GroupNameChipModule,
        GroupToolbarModule,
        MonthToolbarModule,
        DayToolbarModule,
        ItemListViewModule,
        ItemListToolbarModule,
        HelpPageModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should init', () => {
    expect(userAuthService.hasAuth)
      .withContext('should check for auth')
      .toHaveBeenCalled();
    expect(userDataService.loadUserData)
      .withContext('should load user data')
      .toHaveBeenCalled();
    expect(viewService.setViewLoader)
      .withContext('should set view loader')
      .toHaveBeenCalled();
  });

  it('should add new item', () => {
    app.addNewItem();

    expect(userDataService.editItem)
      .withContext('should edit item')
      .toHaveBeenCalled();
    expect(userDataService.editItem.calls.mostRecent().args[0].isDateEnabled)
      .withContext('should not enable date')
      .toBeFalse();
  });

  it('should add new item in day view', () => {
    viewService.isDayView.and.returnValue(true);
    app.addNewItem();

    expect(userDataService.editItem)
      .withContext('should edit item')
      .toHaveBeenCalled();
    const item = userDataService.editItem.calls.mostRecent().args[0];
    expect(item.isDateEnabled).withContext('should enable date').toBeTrue();
    expect(item.date).withContext('should set date').toEqual(dateService.date);
  });

  it('should open help dialog', () => {
    app.openHelpDialog();

    expect(dialog.open).toHaveBeenCalledOnceWith(
      HelpDialogComponent,
      jasmine.anything()
    );
  });

  it('should login', () => {
    userAuthService.hasAuth.and.returnValue(false);
    fixture.detectChanges();
    findButtonWithText('Login')!!.click();
    expect(userAuthService.login).toHaveBeenCalled();
  });

  it('should logout', () => {
    findButtonWithText('menu')!!.click();
    fixture.detectChanges();
    findButtonWithText('Logout', document)!!.click();
    expect(userAuthService.logout).toHaveBeenCalled();
  });

  it('should add new item', () => {
    const addNewItemSpy = spyOn(app, 'addNewItem');
    findButtonWithText('New item')!!.click();
    expect(addNewItemSpy).toHaveBeenCalled();
  });

  it('should go to group view', () => {
    viewService.isGroupView.and.returnValue(false);
    viewService.isMonthView.and.returnValue(true);
    fixture.detectChanges();
    clickSidenavButton(0);
    expect(viewService.goToGroupView).toHaveBeenCalled();
  });

  it('should go to month view', () => {
    clickSidenavButton(1);
    expect(viewService.goToMonthView).toHaveBeenCalled();
  });

  it('should go to day view', () => {
    clickSidenavButton(2);
    expect(viewService.goToDayView).toHaveBeenCalled();
  });

  it('should go to item list view', () => {
    clickSidenavButton(3);
    expect(viewService.goToItemListView).toHaveBeenCalled();
  });

  it("should show current view's sidenav button as selected", () => {
    expect(
      findSidenavButton(0).classList.contains('sidenav-btn-selected')
    ).toBeTrue();
  });

  it('should disable undo button', () => {
    expect(
      (findButtonWithText('undo') as HTMLButtonElement).disabled
    ).toBeTrue();
  });

  it('should disable redo button', () => {
    expect(
      (findButtonWithText('redo') as HTMLButtonElement).disabled
    ).toBeTrue();
  });

  it('should undo', () => {
    userDataService.canUndo.and.returnValue(true);
    fixture.detectChanges();
    findButtonWithText('undo')!!.click();
    expect(userDataService.undo).toHaveBeenCalled();
  });

  it('should redo', () => {
    userDataService.canRedo.and.returnValue(true);
    fixture.detectChanges();
    findButtonWithText('redo')!!.click();
    expect(userDataService.redo).toHaveBeenCalled();
  });

  function setup(): void {
    userAuthService = jasmine.createSpyObj('UserAuthService', [
      'hasAuth',
      'login',
      'logout',
    ]);
    userDataService = jasmine.createSpyObj('UserDataService', [
      'loadUserData',
      'editItem',
      'canUndo',
      'getLastAction',
      'canRedo',
      'getNextAction',
      'undo',
      'redo',
    ]);
    viewService = jasmine.createSpyObj('ViewService', [
      'setViewLoader',
      'isDayView',
      'goToGroupView',
      'goToMonthView',
      'goToDayView',
      'goToItemListView',
      'isGroupView',
      'isMonthView',
      'isItemListView',
    ]);
    dateService = { date: new Date(2020, 0, 1) };
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    userAuthService.hasAuth.and.returnValue(true);
    viewService.isGroupView.and.returnValue(true);
    viewService.isMonthView.and.returnValue(false);
    viewService.isDayView.and.returnValue(false);
    viewService.isItemListView.and.returnValue(false);
    userDataService.canUndo.and.returnValue(false);
    userDataService.canRedo.and.returnValue(false);
  }

  function findSidenavButton(index: number): HTMLButtonElement {
    return (fixture.nativeElement as HTMLElement)
      .querySelectorAll('.sidenav-btn')
      .item(index) as HTMLButtonElement;
  }

  function clickSidenavButton(index: number): void {
    findSidenavButton(index).click();
  }
});
