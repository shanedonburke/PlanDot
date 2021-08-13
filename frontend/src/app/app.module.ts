import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppComponent } from './app.component';
import { GroupEditDialogModule } from './components/group-edit-dialog/group-edit-dialog.module';
import { ItemEditDialogModule } from './components/item-edit-dialog/item-edit-dialog.module';
import { HttpClientModule } from '@angular/common/http';
import { GroupViewModule } from './components/group-view/group-view.module';
import { MonthViewModule } from './components/month-view/month-view.module';
import { DayViewModule } from './components/day-view/day-view.module';
import { ItemViewDialogModule } from './components/item-view-dialog/item-view-dialog.module';
import { GroupNameChipModule } from './components/group-name-chip/group-name-chip.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatMenuModule,
    GroupEditDialogModule,
    ItemEditDialogModule,
    ItemViewDialogModule,
    GroupViewModule,
    MonthViewModule,
    DayViewModule,
    GroupNameChipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
