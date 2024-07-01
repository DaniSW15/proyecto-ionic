import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);
  router = inject(Router);

  ngOnInit() {
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const loading = await this.utils.loadin();
        await loading.present();

        this.firebase.signUp(this.form.value as User).then(async (response: any) => {
          console.log(response);
          await this.firebase.updateUser(this.form.value.name as string);
          let uid = response.user.uid;
          this.form.controls.uid.setValue(uid);
          await this.onUserInfo(uid);
          this.utils.presentToast({ message: 'Welcome!', duration: 2000, position: 'top', color: 'success' });
        }).catch((error: any) => {
          console.log(error);
          this.utils.presentToast({ message: 'Invalid credentials', duration: 2000, position: 'top', color: 'danger' });
        });

      } catch (error) {
        console.log(error);
        this.utils.presentToast({ message: 'Invalid credentials', duration: 2000, position: 'top', color: 'danger' });
      } finally {
        this.utils.loadin().then(loading => loading.dismiss());
      }
    }
  }

  async onUserInfo(uid: string) {
    if (this.form.valid) {
      try {
        const loading = await this.utils.loadin();
        await loading.present();

        delete this.form.value.password;

        this.firebase.setDocument(`users/${uid}`, this.form.value).then(async (res: any) => {
          this.utils.saveInLocalStorage('user', this.form.value);
          this.utils.routerLink('/home');
          console.log(res);
        }).catch((error: any) => {
          console.log(error);
          this.utils.presentToast({ message: 'Invalid credentials', duration: 2000, position: 'top', color: 'danger' });
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
