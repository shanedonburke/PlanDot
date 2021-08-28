import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DayToolbarModule } from './components/day/day-toolbar/day-toolbar.module';
import { DayViewModule } from './components/day/day-view/day-view.module';
import { GroupEditDialogModule } from './components/group-edit-dialog/group-edit-dialog.module';
import { GroupNameChipModule } from './components/group-name-chip/group-name-chip.module';
import { GroupToolbarModule } from './components/group/group-toolbar/group-toolbar.module';
import { GroupViewModule } from './components/group/group-view/group-view.module';
import { ItemEditDialogModule } from './components/item-edit-dialog/item-edit-dialog.module';
import { ItemListToolbarModule } from './components/item-list/item-list-toolbar/item-list-toolbar.module';
import { ItemListViewModule } from './components/item-list/item-list-view/item-list-view.module';
import { MonthToolbarModule } from './components/month/month-toolbar/month-toolbar.module';
import { MonthViewModule } from './components/month/month-view/month-view.module';
import { ToolbarDirective } from './directives/toolbar.directive';
import { ViewDirective } from './directives/view.directive';

const routes = [{ path: '**', component: AppComponent }];

@NgModule({
  declarations: [AppComponent, ViewDirective, ToolbarDirective],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    GroupEditDialogModule,
    ItemEditDialogModule,
    GroupViewModule,
    MonthViewModule,
    DayViewModule,
    GroupNameChipModule,
    GroupToolbarModule,
    MonthToolbarModule,
    DayToolbarModule,
    ItemListViewModule,
    ItemListToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
