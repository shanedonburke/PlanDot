import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-header',
  templateUrl: './view-header.component.html',
  styleUrls: ['./view-header.component.scss'],
})
export class ViewHeaderComponent {
  @Input() text!: string;

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  
  constructor() {}
}
