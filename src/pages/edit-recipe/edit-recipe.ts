import {Component, OnInit} from '@angular/core';
import {
  IonicPage, NavParams, ActionSheetController, AlertController, ToastController,
  NavController
} from 'ionic-angular';
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import {RecipesService} from "../../services/recipes";

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {

  recipeForm: FormGroup;
  mode = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];

  constructor(private navParams: NavParams,
              private actionSheetController: ActionSheetController,
              private alertCtrl: AlertController,
              private toastController: ToastController,
              private recipesService: RecipesService,
              private navController: NavController) {
  }

  ngOnInit(): void {
    this.mode = this.navParams.get('mode');
    this.initializeForm();
  }

  onSubmit() {
    const value = this.recipeForm.value;
    let ingredients = [];
    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      })
    }
    this.recipesService.addRecipe(value.title, value.description, value.difficulty, value.ingredients);
    this.recipeForm.reset();
    this.navController.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      'title': 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIntegredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray> this.recipeForm.get('ingredients');
            const length = fArray.length;
            if (length > 0) {
              for (let i = length - 1; i >= 0; i--) {
                fArray.removeAt(i);
              }
              const toast = this.toastController.create({
                message: 'All ingredients were deleted!',
                duration: 1000,
                position: 'bottom'
              });
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIntegredientAlert() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastController.create({
                message: 'Please enter a valid value!',
                duration: 1000,
                position: 'bottom'
              });
              toast.present();
              return;
            }
            (<FormArray>this.recipeForm.get('ingredients'))
              .push(new FormControl(data.name, Validators.required));
            const toast = this.toastController.create({
              message: 'Item added!',
              duration: 1000,
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });
  }

  private initializeForm() {
    this.recipeForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'difficulty': new FormControl('Medium', Validators.required),
      'ingredients': new FormArray([])
    });
  }

}
