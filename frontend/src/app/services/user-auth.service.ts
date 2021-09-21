import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { deleteCookie, getCookie } from '../util/cookies';

/**
 * A service that handles user authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  /** Name of JWT browser cookie */
  private static JWT_COOKIE = 'jwt';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly window: Window
  ) {}

  /**
   * Redirects the user to the OAuth login URL.
   */
  login(): void {
    this.httpClient
      .get('/api/auth_url', { responseType: 'text' })
      .subscribe((url) => {
        this.window.location.href = url;
      });
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    if (this.hasAuth()) {
      deleteCookie(UserAuthService.JWT_COOKIE);
    }
    this.window.location.href = '/';
  }

  /**
   * @returns True if the user is logged in
   */
  hasAuth(): boolean {
    return getCookie(UserAuthService.JWT_COOKIE) !== null;
  }
}
