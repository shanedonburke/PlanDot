import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  private static ONE_DAY_MS = 86400000;

  date = new Date();
  month = new Date().getMonth();
  year = new Date().getFullYear();

  gotoPrevDate(): void {
    this.date.setTime(this.date.getTime() - DisplayService.ONE_DAY_MS);
  }
  
  gotoNextDate(): void {
    this.date.setTime(this.date.getTime() + DisplayService.ONE_DAY_MS);
  }
}
