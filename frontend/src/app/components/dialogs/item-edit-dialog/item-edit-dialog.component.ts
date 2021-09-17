import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Group, isGroupJson } from 'src/app/domain/group';
import { Item, Repeat, WEEKDAYS } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { getTodaysDate } from 'src/app/util/dates';

/**
 * Data passed to item edit dialog.
 */
export interface ItemEditDialogData {
  item: Item;
}

/**
 * A dialog for editing an item. Fields are added or removed
 * based on the options selected.
 */
@Component({
  selector: 'app-item-edit-dialog',
  templateUrl: './item-edit-dialog.component.html',
  styleUrls: ['./item-edit-dialog.component.scss'],
})
export class ItemEditDialogComponent {
  /** The options for how frequently items can recur */
  REPEAT_EVERY_OPTIONS = Object.values(Repeat);

  /** Weekdays available for button toggles in template  */
  WEEKDAYS = WEEKDAYS;

  /** 1-12 */
  HOURS_ARRAY = [...Array.from(Array(12).keys()).map((h) => h + 1)];

  /** 0-59 */
  MINUTES_ARRAY = [...Array(60).keys()];

  /** Key codes that signal the end of an input on the group chip list */
  SEPARATOR_KEY_CODES = [ENTER, COMMA];

  /** Input where user can type group names */
  @ViewChild('groupInput')
  private groupInput!: ElementRef<HTMLInputElement>;

  /** Button toggles for weekdays when daily/weekly recurrence is on */
  @ViewChildren('weekdayToggles')
  private weekdayToggles!: QueryList<MatButtonToggle>;

  /** Form control for the group chip list */
  groupFormControl = new FormControl();

  /** Autocompleted groups shown when the user is typing in a group name */
  filteredGroups: Observable<ReadonlyArray<Group>>;

  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemEditDialogData,
    public groupService: GroupService,
  ) {
    // Update the autocompleted groups as the user types in group names
    this.filteredGroups = this.groupFormControl.valueChanges.pipe(
      startWith(null),
      map((group: string | null) => this.filterGroups(group))
    );
  }

  /**
   * Handle date changes from the datepicker or text input
   * @param event Event emitted by datepicker
   */
  handleDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.data.item.date = event.value ?? getTodaysDate();
    const weekday = this.data.item.date.getDay();

    // The weekday of the specified date must be enabled for 
    // daily recurring items.
    if (!this.data.item.weekdays.includes(weekday)) {
      this.data.item.weekdays.push(weekday);
      this.data.item.weekdays.sort();

      // If the user entered a date by typing, the toggle won't
      // become checked automatically.
      this.weekdayToggles.get(weekday)!!.checked = true;
    }
  }

  /**
   * Handle 'Add end time' checkbox changes.
   */
  handleEndTimeToggled(): void {
    this.data.item.isEndTimeEnabled = !this.data.item.isEndTimeEnabled;
    this.data.item.setEndTimeToDefault();
  }

  /**
   * Handle the addition of a group through autocompletion.
   * @param event Event emitted by autocomplete
   */
  addGroup(event: MatAutocompleteSelectedEvent): void {
    this.data.item.groupIds.push(event.option.value.id);
    this.groupInput.nativeElement.value = '';
    this.groupFormControl.setValue(null);
  }

  /**
   * Remove a group from the item. Triggered when the user clicks to
   * remove a group from the chip list.
   * @param group Group to be removed
   */
  removeGroup(group: Group) {
    this.data.item.groupIds.splice(
      this.data.item.groupIds.indexOf(group.id),
      1
    );
  }

  /**
   * Filter autocompleted groups based on a group or its name.
   * @param group The group to filter by
   * @returns An array of groups to show for autocompletion
   */
  private filterGroups(group: Group | string | null): Array<Group> {
    // Don't show groups that this item already has
    let filtered = this.groupService
      .getGroups()
      .filter((g) => !this.data.item.groupIds.includes(g.id));
      
    if (group !== null) {
      filtered = filtered.filter((g) => {
        return g.name
          .toLowerCase()
          .includes(
            // If a group is passed in, filter by its name. Otherwise, look for
            // groups that contain the user's input.
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
