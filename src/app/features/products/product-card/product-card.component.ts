import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CartActions from '../../../store/cart/cart.actions';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private store: Store) {}

  addToCart(): void {
    this.store.dispatch(
      CartActions.addToCart({
        product: this.product,
        quantity: 1,
      }),
    );
  }
}
