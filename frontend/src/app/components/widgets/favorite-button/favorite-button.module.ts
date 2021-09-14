import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavoriteButtonComponent } from './favorite-button.component';

@NgModule({
  declarations: [FavoriteButtonComponent],
  exports: [FavoriteButtonComponent],
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class FavoriteButtonModule {}
