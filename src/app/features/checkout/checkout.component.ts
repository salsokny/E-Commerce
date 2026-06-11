import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/cart/cart.selectors';
import { Router } from '@angular/router';
import { CartItem } from '../../core/models';
import * as CartActions from '../../store/cart/cart.actions';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
  }

  private initForm(): void {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  onSubmit(): void {
    if (!this.checkoutForm.valid) {
      this.error = 'Please fill in all fields correctly';
      return;
    }

    this.loading = true;
    this.error = null;

    // Here you would typically call the order service to create the order
    // For demo purposes, we'll just clear the cart and redirect
    setTimeout(() => {
      this.store.dispatch(CartActions.clearCart());
      this.router.navigate(['/order-confirmation']);
      this.loading = false;
    }, 2000);
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }
}
