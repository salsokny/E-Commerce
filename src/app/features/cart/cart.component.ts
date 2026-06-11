import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/cart/cart.selectors';
import * as CartActions from '../../store/cart/cart.actions';
import { CartItem } from '../../core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
  }

  removeItem(productId: number): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  updateQuantity(productId: number, quantity: number): void {
    this.store.dispatch(
      CartActions.updateCartQuantity({ productId, quantity }),
    );
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
