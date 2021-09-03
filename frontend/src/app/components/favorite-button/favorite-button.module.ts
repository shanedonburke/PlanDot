import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FavoriteButtonComponent } from './favorite-button.component';

@NgModule({
  declarations: [FavoriteButtonComponent],
  exports: [FavoriteButtonComponent],
  imports: [MatButtonModule, MatIconModule],
})
export class FavoriteButtonModule {}
