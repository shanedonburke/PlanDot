import { Component, Input } from '@angular/core';
import { Group } from 'src/app/domain/group';

/**
 * Displays a group's name and color as a chip.
 */
@Component({
  selector: 'app-group-name-chip',
  templateUrl: './group-name-chip.component.html',
  styleUrls: ['./group-name-chip.component.scss'],
  host: {
    '[attr.aria-label]': 'group.name'
  }
})
export class GroupNameChipComponent {
  @Input('group') group!: Group;
}
