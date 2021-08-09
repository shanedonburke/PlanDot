import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
import { AppComponent } from './app.component';
import { GroupEditDialogModule } from './components/group-edit-dialog/group-edit-dialog.module';
import { ItemEditDialogModule } from './components/item-edit-dialog/item-edit-dialog.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    DragDropModule,
    GroupEditDialogModule,
    ItemEditDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
