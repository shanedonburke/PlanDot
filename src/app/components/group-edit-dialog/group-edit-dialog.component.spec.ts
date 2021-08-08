import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditDialogComponent } from './group-edit-dialog.component';

describe('GroupEditDialogComponent', () => {
  let component: GroupEditDialogComponent;
  let fixture: ComponentFixture<GroupEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
