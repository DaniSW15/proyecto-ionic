import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const firebase = inject(FirebaseService);
  const utils = inject(UtilsService);

  return new Promise((resolve) => {
    firebase.getAuths().onAuthStateChanged((auth) => {
      if (!auth) {
        resolve(true);
      } else {
        utils.routerLink('/main/home');
        resolve(false);
      }
    });
  });
};
