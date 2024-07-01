import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  utils = inject(UtilsService);

  getAuths() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    const auth: any = getAuth();
    return updateProfile(auth.currentUser, { displayName });
  }

  sendRecorveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  };

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utils.routerLink('auth');
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
