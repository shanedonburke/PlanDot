import { Component } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-item-list-toolbar',
  templateUrl: './item-list-toolbar.component.html',
  styleUrls: ['./item-list-toolbar.component.scss'],
})
export class ItemListToolbarComponent {
  constructor(public readonly searchService: SearchService) {}
}
