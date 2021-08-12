import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { deleteCookie, getCookie } from '../util/cookies';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private static JWT_COOKIE = 'jwt';

  constructor(private readonly httpClient: HttpClient) {}

  login(): void {
    this.httpClient
      .get('/api/auth_url', { responseType: 'text' })
      .subscribe((url) => {
        window.location.href = url;
      });
  }

  logout(): void {
    if (this.hasAuth()) {
      deleteCookie(UserAuthService.JWT_COOKIE);
    }
    window.location.href = '/'
  }

  hasAuth(): boolean {
    return getCookie(UserAuthService.JWT_COOKIE) !== null;
  }
}
