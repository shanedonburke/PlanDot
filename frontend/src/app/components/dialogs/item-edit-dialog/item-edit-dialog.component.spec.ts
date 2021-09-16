import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';

import {
  ItemEditDialogComponent,
  ItemEditDialogData,
} from './item-edit-dialog.component';

fdescribe('ItemEditDialogComponent', () => {
  let component: ItemEditDialogComponent;
  let fixture: ComponentFixture<ItemEditDialogComponent>;

  let item: Item;
  let groups: Array<Group>;

  let dialogRef: jasmine.SpyObj<MatDialogRef<ItemEditDialogComponent>>;
  let data: ItemEditDialogData;
  let groupService: jasmine.SpyObj<GroupService>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [ItemEditDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: GroupService, useValue: groupService },
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function setup(): void {
    item = new Item();
    groups = [new Group({ itemIds: [item.id] }), new Group(), new Group()];

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    groupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'getItemGroups',
    ]);
    data = { item };

    groupService.getGroups.and.returnValue(groups);
    groupService.getItemGroups.and.returnValue(
      groups.filter((g) => g.itemIds.includes(item.id))
    );
  }
});
