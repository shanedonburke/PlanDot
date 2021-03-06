import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DayToolbarModule } from './components/views/day/day-toolbar/day-toolbar.module';
import { DayViewModule } from './components/views/day/day-view/day-view.module';
import { GroupEditDialogModule } from './components/dialogs/group-edit-dialog/group-edit-dialog.module';
import { GroupNameChipModule } from './components/widgets/group-name-chip/group-name-chip.module';
import { GroupToolbarModule } from './components/views/group/group-toolbar/group-toolbar.module';
import { GroupViewModule } from './components/views/group/group-view/group-view.module';
import { HelpDialogModule } from './components/dialogs/help-dialog/help-dialog.module';
import { ItemEditDialogModule } from './components/dialogs/item-edit-dialog/item-edit-dialog.module';
import { ItemListToolbarModule } from './components/views/item-list/item-list-toolbar/item-list-toolbar.module';
import { ItemListViewModule } from './components/views/item-list/item-list-view/item-list-view.module';
import { MonthToolbarModule } from './components/views/month/month-toolbar/month-toolbar.module';
import { MonthViewModule } from './components/views/month/month-view/month-view.module';
import { ToolbarDirective } from './directives/toolbar.directive';
import { ViewDirective } from './directives/view.directive';
import { DOCUMENT } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const routes = [
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

// Polyfill for { scroll-behavior: 'smooth' } on HTMLElement.scrollTo(..)
if (!('scrollBehavior' in document.documentElement.style)) {
  import('scroll-behavior-polyfill');
}

@NgModule({
  declarations: [AppComponent, ViewDirective, ToolbarDirective],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
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
    HelpDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    { provide: Document, useExisting: DOCUMENT },
    { provide: Window, useFactory: () => window },
    { provide: Storage, useFactory: () => window.localStorage },
    { provide: Navigator, useFactory: () => window.navigator },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
