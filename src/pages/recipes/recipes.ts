import { Component } from '@angular/core';
import {IonicPage, NavController, PopoverController, LoadingController, AlertController} from 'ionic-angular';
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {RecipesService} from "../../services/recipes";
import {Recipe} from "../../models/recipe";
import {RecipePage} from "../recipe/recipe";
import {AuthService} from "../../services/auth";
import {DatabaseOptionsPage} from "../database-options/database-options";

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  recipes: Recipe[];

  constructor(public navCtrl: NavController,
              private recipesService: RecipesService,
              private popoverController: PopoverController,
              private authService: AuthService,
              private loadingController: LoadingController,
              private alertController: AlertController) {
  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
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
            this.recipesService.fetchList(token)
              .subscribe((recipes: Recipe[]) => {
                loading.dismiss();
                if (recipes) {
                  this.recipes = recipes;
                } else {
                  this.recipes = [];
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
            this.recipesService.storeList(token)
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
