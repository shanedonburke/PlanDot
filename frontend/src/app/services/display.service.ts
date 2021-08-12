import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  date = new Date();
  month = new Date().getMonth();
  year = new Date().getFullYear();
}
