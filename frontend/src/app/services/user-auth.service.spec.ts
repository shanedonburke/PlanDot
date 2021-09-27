import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { deleteCookie, getCookie, setCookie } from '../util/cookies';
import { UserAuthService } from './user-auth.service';

describe('UserAuthService', () => {
  let service: UserAuthService;

  let httpClient: jasmine.SpyObj<HttpClient>;
  let win: { location: { href: string } };

  beforeEach(() => {
    setup();

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: Window, useValue: win },
      ],
    });
    service = TestBed.inject(UserAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', fakeAsync(() => {
    const url = '/some_auth_url';
    httpClient.get.and.returnValue(of(url));

    service.login();
    tick();

    expect(httpClient.get)
      .withContext('should make request')
      .toHaveBeenCalledTimes(1);
    expect(win.location.href).withContext('should redirect').toBe(url);
  }));

  it('should logout', () => {
    setJwtCookie();
    httpClient.get.and.returnValue(of());

    service.logout();
    
    expect(httpClient.get).toHaveBeenCalledOnceWith('/api/logout');
  });

  it('should have auth', () => {
    setJwtCookie();
    expect(service.hasAuth()).toBeTrue();
  });

  it('should not have auth', () => {
    deleteCookie('jwt');
    expect(service.hasAuth()).toBeFalse();
  });

  function setJwtCookie(): void {
    setCookie('jwt', 'fakejwt');
  }

  function setup(): void {
    httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    win = { location: { href: '' } };
  }
});
