import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);
  router = inject(Router);

  ngOnInit() {
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const response: any = await this.firebase.signIn(this.form.value as User);
        if (response) {
          await this.getUserInfo(response.user.uid);
          console.log(response);
        } else {
          this.utils.presentToast({ message: 'Invalid credentials', duration: 2000, position: 'top', color: 'danger' });
        }
      } catch (error: any) {
        console.log(error);
        if (error.code === 400) {
          this.utils.presentToast({ message: `${error.error.message}`, duration: 2000, position: 'top', color: 'danger' });
        }
      } finally {
        this.utils.loadin().then(loading => loading.dismiss());
      }
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      try {
        const loading = await this.utils.loadin();
        await loading.present();

        delete this.form.value.password;

        this.firebase.getDocument(`users/${uid}`).then((response: any) => {
          if (response) {
            this.utils.saveInLocalStorage('user', response);
            this.utils.routerLink('/main/home');
            this.utils.presentToast({ message: `Te damos la bienvenida ${response.name}`, duration: 2000, position: 'top', color: 'success' });
            this.form.reset();
          } else {
            this.utils.presentToast({ message: 'Invalid credentials', duration: 2000, position: 'top', color: 'danger' });
          }
        }).catch((error: any) => {
          if (error.error.code === 400) {
            this.utils.presentToast({ message: `${error.error.message}`, duration: 2000, position: 'top', color: 'danger' });
          }
        });

      } catch (error) {
        console.log(error);
        this.utils.presentToast({ message: 'Invalid credentials', duration: 2000, position: 'top', color: 'danger' });
      } finally {
        this.utils.loadin().then(loading => loading.dismiss());
      }
    }
  }

}
