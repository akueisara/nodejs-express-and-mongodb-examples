import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private currentUser: firebase.User = null;

  constructor(public authService: AuthService, public router: Router) {
    this.authService.getAuthState()
    .subscribe((user) => {
      if (user) {
        // User is signed in.
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }
  canActivate(): boolean {
    if (!this.currentUser) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
