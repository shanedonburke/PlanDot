import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerDirective, ColorPickerModule } from 'ngx-color-picker';
import { Group } from 'src/app/domain/group';

import {
  GroupEditDialogComponent,
  GroupEditDialogData,
} from './group-edit-dialog.component';

fdescribe('GroupEditDialogComponent', () => {
  let component: GroupEditDialogComponent;
  let fixture: ComponentFixture<GroupEditDialogComponent>;

  let group: Group;

  let dialogRef: jasmine.SpyObj<MatDialogRef<GroupEditDialogComponent>>;
  let data: GroupEditDialogData;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [GroupEditDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        ColorPickerModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change group name', () => {
    const newName = 'new name';
    enterGroupName(newName);
    expect(component.data.group.name).toBe(newName);
  });

  it('should show correct color', () => {
    expect(getDisplayedColor()).toEqual(group.color);
  });

  it('should cancel', () => {
    fixture.debugElement
      .queryAll(By.css('button'))
      .find(
        (el) => (el.nativeElement as HTMLButtonElement).innerText === 'Cancel'
      )!!
      .triggerEventHandler('click', {});
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  function setup(): void {
    group = new Group();

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    data = { group };
  }

  function enterGroupName(groupName: string): void {
    const input = fixture.debugElement.query(By.directive(MatInput))
      .nativeElement as HTMLInputElement;
    input.value = groupName;
    fixture.detectChanges();
    input.dispatchEvent(new Event('input'));
  }

  function getDisplayedColor(): string {
    return fixture.debugElement
      .query(By.directive(ColorPickerDirective))
      .injector.get(ColorPickerDirective).colorPicker;
  }
});
