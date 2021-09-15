import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GroupNameChipModule } from '../../widgets/group-name-chip/group-name-chip.module';

import {
  GroupDeleteDialogComponent,
  GroupDeleteDialogData,
} from './group-delete-dialog.component';

fdescribe('GroupDeleteDialogComponent', () => {
  let component: GroupDeleteDialogComponent;
  let fixture: ComponentFixture<GroupDeleteDialogComponent>;

  let group1: Group;
  let group2: Group;
  let group3: Group;
  let allGroups: Array<Group>;

  let dialogRef: jasmine.SpyObj<MatDialogRef<GroupDeleteDialogComponent>>;
  let groupService: jasmine.SpyObj<GroupService>;
  let userDataService: jasmine.SpyObj<UserDataService>;
  let data: GroupDeleteDialogData;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [GroupDeleteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: GroupService, useValue: groupService },
        { provide: UserDataService, useValue: userDataService },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        MatRadioModule,
        MatFormFieldModule,
        MatSelectModule,
        GroupNameChipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get replacement group options', () => {
    expect(component.getReplacementGroupOptions()).toEqual([group2, group3]);
  });

  it('should set item action to selected option', () => {
    clickRadioButton(0);
    expect(component.itemAction).toEqual(component.ITEM_ACTIONS[0]);
  });

  describe('with replacement group selected', () => {
    beforeEach(async () => {
      clickRadioButton(2);
      fixture.detectChanges();
      await fixture.whenStable();
      selectReplacementGroup(group2);
    });

    it('should set replacement group', async () => {
      expect(component.replacementGroup).toEqual(group2);
    });

    it('should delete group', () => {
      component.deleteGroup();
      expect(userDataService.deleteGroup)
        .withContext('should delete group')
        .toHaveBeenCalledWith(group1, component.ITEM_ACTIONS[2], group2);
      expect(dialogRef.close)
        .withContext('should close dialog')
        .toHaveBeenCalledTimes(1);
    });
  });

  function setup(): void {
    group1 = new Group();
    group2 = new Group();
    group3 = new Group();
    allGroups = [group1, group2, group3];

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    groupService = jasmine.createSpyObj('GroupService', ['getGroups']);
    groupService.getGroups.and.returnValue(allGroups);

    userDataService = jasmine.createSpyObj('UserDataService', ['deleteGroup']);
    data = { group: group1 };
  }

  function clickRadioButton(index: number): void {
    (
      fixture.debugElement.queryAll(By.directive(MatRadioButton))[index]
        .componentInstance as MatRadioButton
    )._inputElement.nativeElement.click();
  }

  function selectReplacementGroup(group: Group): void {
    (
      fixture.debugElement.query(By.directive(MatSelect))
        .componentInstance as MatSelect
    ).options
      .toArray()
      .find((op) => op.value === group)!!
      .select();
  }
});
