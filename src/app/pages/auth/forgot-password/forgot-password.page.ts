import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  firebase = inject(FirebaseService);
  utils = inject(UtilsService);
  router = inject(Router);

  ngOnInit() {
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const response: any = await this.firebase.sendRecorveryEmail(this.form.value.email as string);
        console.log(response);
        
      } catch (error: any) {
        console.log(error);
        this.utils.presentToast({ message: 'Invalid email', duration: 2000, position: 'top', color: 'danger' });
      } finally {
        this.utils.loadin().then(loading => loading.dismiss());
      }
    }
  }
}
