import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
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

  function setup(): void {
    group = new Group();

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    data = { group };
  }
});
