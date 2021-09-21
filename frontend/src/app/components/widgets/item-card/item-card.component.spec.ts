import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { getTestUtils } from 'src/test-utils';
import { ItemViewDialogModule } from '../../dialogs/item-view-dialog/item-view-dialog.module';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ItemCardComponent } from './item-card.component';

fdescribe('ItemCardComponent', () => {
  const { findElementByXPath } = getTestUtils(() => fixture);

  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;

  let item: Item;

  let groupService: jasmine.SpyObj<GroupService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [ItemCardComponent, MockComponent(FavoriteButtonComponent)],
      providers: [
        { provide: GroupService, useValue: groupService },
        { provide: MatDialog, useValue: dialog },
      ],
      imports: [
        DragDropModule,
        ItemViewDialogModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        IconButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have location', () => {
    expect(
      findElementByXPath(
        `//div[@class="item-card-info"]/span[contains(text(), "${item.location}")]`
      )
    ).toBeTruthy();
  });

  it('should have date', () => {
    expect(
      findElementByXPath(
        `//div[@class="item-card-info"]/span[contains(text(), "${item.date.toLocaleDateString()}")]`
      )
    ).toBeTruthy();
  });

  it('should have time', () => {
    expect(
      findElementByXPath(
        `//div[@class="item-card-info"]/span[contains(text(), "${item.getDisplayTime()}")]`
      )
    ).toBeTruthy();
  });

  it('should expand item', () => {
    fixture.debugElement
      .query(By.directive(IconButtonComponent))
      .triggerEventHandler('click', null);
    expect(dialog.open).toHaveBeenCalled();
  });

  function setup(): void {
    item = new Item({
      title: 'My Item',
      location: 'My Location',
      description: 'My Description',
      isDateEnabled: true,
      date: new Date('09/20/2021'),
      isStartTimeEnabled: true,
      isEndTimeEnabled: true,
    });

    groupService = jasmine.createSpyObj('GroupService', ['getItemGroups']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    groupService.getItemGroups.and.returnValue([new Group(), new Group()]);
  }
});
