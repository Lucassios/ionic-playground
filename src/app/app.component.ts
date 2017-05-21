import {Component, ViewChild} from '@angular/core';
import {Platform, NavController, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { TabsPage } from "../pages/tabs/tabs";
import {SigninPage} from "../pages/signin/signin";
import {SignupPage} from "../pages/signup/signup";
import {AuthService} from "../services/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;
  signinPage: any = SigninPage;
  signupPage: any = SignupPage;
  isAuthenticated = false;

  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private menuController: MenuController,
              private authService: AuthService) {
    firebase.initializeApp({
      apiKey: "AIzaSyAqoSowzYAhDvbRE-kXvol-5Q4d32I7WMU",
      authDomain: "ionic3-recipebook-playground.firebaseapp.com"
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = TabsPage;
      } else {
        this.isAuthenticated = true;
        this.rootPage = SigninPage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuController.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuController.close();
  }

}

