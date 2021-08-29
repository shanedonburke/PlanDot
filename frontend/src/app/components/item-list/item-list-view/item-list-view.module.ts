import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SwipeRevealDirective } from 'src/app/directives/swipe-reveal.directive';
import { ItemCardModule } from '../../item-card/item-card.module';
import { ItemListViewComponent } from './item-list-view.component';

@NgModule({
  declarations: [ItemListViewComponent, SwipeRevealDirective],
  exports: [ItemListViewComponent],
  imports: [
    CommonModule,
    MatIconModule,
    DragDropModule,
    ItemCardModule,
  ],
})
export class ItemListViewModule {}
