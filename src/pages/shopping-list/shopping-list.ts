import { Component } from '@angular/core';
import {IonicPage, PopoverController, LoadingController, AlertController} from 'ionic-angular';
import { ShoppingListService } from "../../services/shopping-list";
import {NgForm} from "@angular/forms";
import {Ingredient} from "../../models/ingredient";
import {AuthService} from "../../services/auth";
import {DatabaseOptionsPage} from "../database-options/database-options";

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(private shoppingListService: ShoppingListService,
              private popoverController: PopoverController,
              private authService: AuthService,
              private loadingController: LoadingController,
              private alertController: AlertController) {
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.shoppingListService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  onCheckItem(index: number) {
    console.log('teste');
    this.shoppingListService.removeItem(index);
    this.loadItems();
  }

  loadItems() {
    this.listItems = this.shoppingListService.getItems();
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingController.create({
      content: 'Please wait...'
    });
    const popover = this.popoverController.create(DatabaseOptionsPage);
    popover.present({ev: event});
    popover.onDidDismiss(data => {
      if (!data) return;
      if (data.action == 'load') {
        loading.present();
        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.shoppingListService.fetchList(token)
              .subscribe((list: Ingredient[]) => {
                loading.dismiss();
                if (list) {
                  this.listItems = list;
                } else {
                  this.listItems = [];
                }
              }, error => {
                loading.dismiss();
                this.handleError(error);
              })
          });
      } else if (data.action == 'store') {
        loading.present();
        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.shoppingListService.storeList(token)
              .subscribe(() => {
                loading.dismiss()
              }, error => {
                loading.dismiss();
                this.handleError(error);
              })
          });
      }
    });
  }

  handleError(errorMessage: string) {
    this.alertController.create({
      title: 'An error ocurred!',
      message: errorMessage,
      buttons: ['OK']
    }).present();
  }

}
