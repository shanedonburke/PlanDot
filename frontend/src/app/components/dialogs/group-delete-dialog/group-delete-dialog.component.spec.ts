import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
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
      imports: [FormsModule, MatRadioModule, GroupNameChipModule]
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

  function setup() {
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
});
