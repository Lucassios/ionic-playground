import { Component } from '@angular/core';
import {IonicPage, PopoverController} from 'ionic-angular';
import { ShoppingListService } from "../../services/shopping-list";
import {NgForm} from "@angular/forms";
import {Ingredient} from "../../models/ingredient";
import {SLOptionsPage} from "./sl-options/sl-options";

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(private shoppingListService: ShoppingListService, private popoverController: PopoverController) {
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
    const popover = this.popoverController.create(SLOptionsPage);
    popover.present({ev: event});
  }

}
