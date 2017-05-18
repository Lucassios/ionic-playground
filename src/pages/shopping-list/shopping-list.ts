import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ShoppingListService } from "../../services/shopping-list";
import {NgForm} from "@angular/forms";
import {Ingredient} from "../../models/ingredient";

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(private shoppingListService: ShoppingListService) {
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

}
