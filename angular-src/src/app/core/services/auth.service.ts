import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject } from 'rxjs';
import 'rxjs/operators/map';

import { ApiService } from './api.service';
import { UserProfile, ActionResponse } from '../../../../../shared/models';

@Injectable()
export class AuthService {
  _user: UserProfile;
  userChanged: Subject<UserProfile> = new Subject<UserProfile>();
  private _loginChecked: boolean;

  get user(): UserProfile {
    return this._user;
  }

  set user(user: UserProfile) {
    this._user = user;
  }

  get loginChecked() {
    return this._loginChecked;
  }

  set loginChecked(loginChecked: boolean) {
    this._loginChecked = loginChecked;
  }

  get hasCredentails() {
    return this.cookieService.get('auth_token');
  }

  get isLoggedIn() {
    return this.hasCredentails && this.isLoggedIn;
  }

  get isLoggedInAsync() {
    if (!this.hasCredentails) {
      return false;
    }

    if (!this.loginChecked) {
      return this.checkLogin().map(user => !!user);
    }

    return this.isLoggedIn;
  }

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  checkLogin(): Observable<UserProfile> {
    if (!this.hasCredentails) {
      this.loginChecked = true;
      return;
    }

    this.loginChecked = false;
    const loginObservable = this.apiService.getProfile(true);
    loginObservable.subscribe(
      response => {
        this.user = response;
        this.loginChecked = true;
      },
      error => {
        this.loginChecked = true;
      }
    );

    return loginObservable;
  }

  login(email: string, password: string) {
    const observable = this.apiService.login(email, password);
    observable.subscribe(
      result => {
        this.cookieService.put(`auth_token`, result.data.token);
        this.user = result.data.profile;
      },
      error => {
        console.error(error);
      }
    );

    return observable;
  }

  logout() {
    this.user = null;
    this.cookieService.remove('auth_token');
    this.loginChecked = true;
  }
}
