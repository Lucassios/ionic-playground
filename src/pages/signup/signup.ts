import { Component } from '@angular/core';
import {IonicPage, LoadingController, AlertController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private alertController: AlertController) { }

  onSignup(form: NgForm) {
    const loading = this.loadingController.create({
      content: 'Signing you up...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertController.create({
          title: 'Signup up failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
