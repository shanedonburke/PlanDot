import { Component, Input } from '@angular/core';
import { Group } from 'src/app/domain/group';

@Component({
  selector: 'app-group-name-chip',
  templateUrl: './group-name-chip.component.html',
  styleUrls: ['./group-name-chip.component.scss']
})
export class GroupNameChipComponent {
  @Input('group') group!: Group;
}
