import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {
  const firebase = inject(FirebaseService);
  const utils = inject(UtilsService);
  const user = localStorage.getItem('user');

  return new Promise((resolve) => {
    firebase.getAuths().onAuthStateChanged((auth) => {
      if (auth) {
        if (user) {
          resolve(true);
        }
      } else {
        utils.routerLink('auth');
        resolve(false);
      }
    });
  });

};
