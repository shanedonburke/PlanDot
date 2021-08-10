import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private readonly httpClient: HttpClient) {}

  login(): void {
    this.httpClient
      .get('/api/auth_url', { responseType: 'text' })
      .subscribe((url) => {
        window.location.href = url;
      });
  }
}
