import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  loadin() {
    return this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent',
      duration: 2000
    });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create({
      message: opts?.message,
      duration: opts?.duration,
      position: opts?.position,
      color: opts?.color
    });

    toast.present();
  }

  routerLink(path: string) {
    this.router.navigateByUrl(path);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      return data;
    }

  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
    
}
