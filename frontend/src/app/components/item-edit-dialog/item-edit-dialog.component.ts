import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Group, isGroupJson } from 'src/app/domain/group';
import { Item, Repeat, WEEKDAYS } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { getTodaysDate } from 'src/app/util/dates';

export interface ItemEditDialogData {
  item: Item;
}

@Component({
  selector: 'app-item-edit-dialog',
  templateUrl: './item-edit-dialog.component.html',
  styleUrls: ['./item-edit-dialog.component.scss'],
})
export class ItemEditDialogComponent {
  REPEAT_EVERY_OPTIONS = Object.values(Repeat);
  WEEKDAYS = WEEKDAYS;
  HOURS_ARRAY = [...Array.from(Array(12).keys()).map((h) => h + 1)];
  MINUTES_ARRAY = [...Array(60).keys()];
  SEPARATOR_KEY_CODES = [ENTER, COMMA];

  @ViewChild('groupInput')
  private groupInput!: ElementRef<HTMLInputElement>;

  groupFormControl = new FormControl();
  filteredGroups: Observable<ReadonlyArray<Group>>;

  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemEditDialogData,
    public groupService: GroupService
  ) {
    this.filteredGroups = this.groupFormControl.valueChanges.pipe(
      startWith(null),
      map((group: string | null) => this.filterGroups(group))
    );
  }

  handleDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.data.item.date = event.value ?? getTodaysDate();
    if (!this.data.item.weekdays.includes(this.data.item.date.getDay())) {
      this.data.item.weekdays.push(this.data.item.date.getDay());
      this.data.item.weekdays.sort();
    }
  }

  handleEndTimeEnabled(): void {
    this.data.item.endTimeEnabled = !this.data.item.endTimeEnabled;
    this.data.item.setEndTimeToDefault();
  }

  addGroup(event: MatAutocompleteSelectedEvent): void {
    this.data.item.groupIds.push(event.option.value.id);
    this.groupInput.nativeElement.value = '';
    this.groupFormControl.setValue(null);
  }

  removeGroup(group: Group) {
    this.data.item.groupIds.splice(
      this.data.item.groupIds.indexOf(group.id),
      1
    );
  }

  private filterGroups(group: Group | string | null): Array<Group> {
    let filtered = this.groupService
      .getGroups()
      .filter((g) => !this.data.item.groupIds.includes(g.id));
    if (group !== null) {
      filtered = filtered.filter((g) => {
        return g.name
          .toLowerCase()
          .includes(
            (isGroupJson(group)
              ? group.name.toLowerCase()
              : group
            ).toLowerCase()
          );
      });
    }
    return filtered;
  }
}
