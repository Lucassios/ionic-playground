import { Component } from '@angular/core';
import {IonicPage, LoadingController, AlertController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private alertController: AlertController) { }

  onSignin(form: NgForm) {
    const loading = this.loadingController.create({
      content: 'Signing you in...'
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertController.create({
          title: 'Sign in failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
