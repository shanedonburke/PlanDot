import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';
import { GroupDeleteDialogComponent } from 'src/app/components/dialogs/group-delete-dialog/group-delete-dialog.component';
import { GroupDeleteDialogModule } from 'src/app/components/dialogs/group-delete-dialog/group-delete-dialog.module';
import { GroupEditDialogComponent } from 'src/app/components/dialogs/group-edit-dialog/group-edit-dialog.component';
import { GroupNameChipModule } from 'src/app/components/widgets/group-name-chip/group-name-chip.module';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import {
  UserDataAction,
  UserDataService,
} from 'src/app/services/user-data.service';
import { getTestUtils } from 'src/test-utils';
import { GroupToolbarComponent } from './group-toolbar.component';

describe('GroupToolbarComponent', () => {
  let { findButtonWithText, clickDocument } = getTestUtils(() => fixture);

  let component: GroupToolbarComponent;
  let fixture: ComponentFixture<GroupToolbarComponent>;

  let groups: Array<Group>;

  let groupService: jasmine.SpyObj<GroupService>;
  let userDataService: jasmine.SpyObj<UserDataService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  let dialogRef: jasmine.SpyObj<MatDialogRef<GroupEditDialogComponent>>;
  let dialogDataGroup: Group;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [GroupToolbarComponent],
      providers: [
        { provide: GroupService, useValue: groupService },
        { provide: UserDataService, useValue: userDataService },
        { provide: MatDialog, useValue: dialog },
      ],
      imports: [
        GroupNameChipModule,
        MatIconModule,
        MatDialogModule,
        MatDividerModule,
        MatTooltipModule,
        MatButtonModule,
        GroupDeleteDialogModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show groups menu', () => {
    expect(getGroupsMenu()).toBeFalsy();
  });

  describe('when groups menu is open', () => {
    beforeEach(() => {
      toggleGroupsMenu();
    });

    it('should have two rows in groups menu', () => {
      expect(getGroupsMenuRows().length).toBe(2);
    });

    it('should edit group', async () => {
      findButtonWithText('edit', getGroupsMenuRows().item(0))!!.click();
      fixture.detectChanges();
      await fixture.whenStable();

      const group = groups[0];
      const newGroup =
        groupService.updateOrCreateGroup.calls.mostRecent().args[1];

      expect(getGroupsMenu())
        .withContext('should close groups menu')
        .toBeFalsy();
      expect(dialog.open).withContext('should open dialog').toHaveBeenCalled();
      expect(groupService.updateOrCreateGroup)
        .withContext('should update group')
        .toHaveBeenCalledOnceWith(group, newGroup);
      expect(group)
        .withContext('should pass in clone of group, not original')
        .not.toBe(newGroup);
      expect(userDataService.saveUserData)
        .withContext('should save user data')
        .toHaveBeenCalledOnceWith(UserDataAction.EDIT_GROUP);
    });

    it('should delete group with no items', () => {
      findButtonWithText('delete', getGroupsMenuRows().item(0))!!.click();
      expect(userDataService.deleteGroup).toHaveBeenCalledOnceWith(groups[0]);
    });

    it('should open group deletion dialog', () => {
      findButtonWithText('delete', getGroupsMenuRows().item(1))!!.click();
      expect(dialog.open).toHaveBeenCalledOnceWith(
        GroupDeleteDialogComponent,
        jasmine.anything()
      );
    });

    it('should add group', () => {
      findButtonWithText('New group')!!.click();
      expect(dialog.open).toHaveBeenCalledOnceWith(
        GroupEditDialogComponent,
        jasmine.anything()
      );
    });

    it('should close groups menu', () => {
      toggleGroupsMenu();
      expect(getGroupsMenu()).toBeFalsy();
    });

    it("should close groups menu on click when dialog isn't open", () => {
      clickDocument();
      expect(getGroupsMenu()).toBeFalsy();
    });

    it('should not close groups menu on click when dialog is open', () => {
      component.isDialogOpen = true;
      clickDocument();
      expect(getGroupsMenu()).toBeTruthy();
    });
  });

  function setup(): void {
    groups = [new Group(), new Group({ itemIds: ['itemId'] })];

    dialogRef = jasmine.createSpyObj<MatDialogRef<GroupEditDialogComponent>>(
      'MatDialogRef',
      ['afterClosed']
    );

    groupService = jasmine.createSpyObj('GroupService', [
      'updateOrCreateGroup',
      'getGroups',
    ]);
    userDataService = jasmine.createSpyObj('UserDataService', [
      'saveUserData',
      'deleteGroup',
    ]);
    dialog = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);

    groupService.getGroups.and.returnValue(groups);

    dialog.open.and.callFake((_component, config: any) => {
      dialogDataGroup = config.data.group;
      return dialogRef;
    });
    dialogRef.afterClosed.and.callFake(() => {
      return of(dialogDataGroup);
    });
  }

  function getGroupsMenu(): HTMLElement {
    return fixture.nativeElement.querySelector('.groups-menu');
  }

  function getGroupsButton(): HTMLElement {
    return findButtonWithText('Groups')!!;
  }

  function toggleGroupsMenu(): void {
    getGroupsButton().click();
    fixture.detectChanges();
  }

  function getGroupsMenuRows(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.groups-menu-row');
  }
});
