import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartSubject = new BehaviorSubject<CartItem[]>(
    this.getCartFromStorage(),
  );

  // Publicly exposed immutable stream for UI components to listen to
  public readonly cart$: Observable<CartItem[]> =
    this.cartSubject.asObservable();

  public readonly cartTotal$: Observable<number> = this.cart$.pipe(
    map((items) =>
      items?.reduce(
        (total, item) => total + item?.product?.price * item?.quantity,
        0,
      ),
    ),
  );

  public readonly cartCount$: Observable<number> = this.cart$.pipe(
    map((items) => items?.reduce((count, item) => count + item?.quantity, 0)),
  );

  public addToCart(product: Product, quantity: number = 1): void {
    try {
      const currentCart = this.getCart(); // Helper to grab current raw snapshot
      const itemIndex = currentCart.findIndex(
        (item) => item.product.id === product.id,
      );

      // FIX: Generate a completely fresh array instance to satisfy ChangeDetection requirements
      let updatedCart = [...currentCart];

      if (itemIndex > -1) {
        // FIX: Create a fresh object instance for the updated element to ensure pure state immutability
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          quantity: updatedCart[itemIndex]?.quantity + quantity,
        };
      } else {
        // Append a fresh item to our non-mutated array stack safely
        updatedCart = [...updatedCart, { product, quantity }];
      }

      this.updateCartState(updatedCart);
    } catch (error) {
      throw new Error(
        `Failed to add item to cart: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public removeFromCart(productId: number): void {
    try {
      // Array.filter natively constructs an entirely new array, preserving reference safety!
      const updatedCart = this.getCart().filter(
        (item) => item?.product?.id !== productId,
      );
      this.updateCartState(updatedCart);
    } catch (error) {
      throw new Error(
        `Failed to remove item from cart: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public updateQuantity(productId: number, quantity: number): void {
    try {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }

      const updatedCart = this.getCart().map((item) => {
        if (item?.product?.id === productId) {
          return { ...item, quantity }; // Return cloned object copy with fresh count value
        }
        return item; // Keep unchanged items as they are
      });

      this.updateCartState(updatedCart);
    } catch (error) {
      throw new Error(
        `Failed to update cart quantity: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  public clearCart(): void {
    this.updateCartState([]);
  }

  private updateCartState(cart: CartItem[]): void {
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private getCartFromStorage(): CartItem[] {
    try {
      const cartString = localStorage.getItem('cart');
      return cartString ? (JSON.parse(cartString) as CartItem[]) : [];
    } catch (error) {
      throw new Error('Failed to parse cart data from local storage');
      return [];
    }
  }
}
