import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-item-list-view',
  templateUrl: './item-list-view.component.html',
  styleUrls: ['./item-list-view.component.scss'],
})
export class ItemListViewComponent implements OnInit {
  constructor(
    public readonly searchService: SearchService,
    public readonly userDataService: UserDataService,
  ) {}

  ngOnInit() {
    this.searchService.update();
  }
}
