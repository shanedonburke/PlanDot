import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
import { AppComponent } from './app.component';
import { GroupEditDialogModule } from './components/group-edit-dialog/group-edit-dialog.module';
import { ItemEditDialogModule } from './components/item-edit-dialog/item-edit-dialog.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    DragDropModule,
    MatMenuModule,
    GroupEditDialogModule,
    ItemEditDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
