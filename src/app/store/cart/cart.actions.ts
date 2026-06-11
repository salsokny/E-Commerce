import { createAction, props } from '@ngrx/store';
import { CartItem, Product } from '../../core/models';

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product; quantity: number }>(),
);

export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: number }>(),
);

export const updateCartQuantity = createAction(
  '[Cart] Update Cart Quantity',
  props<{ productId: number; quantity: number }>(),
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCart = createAction('[Cart] Load Cart');

export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ items: CartItem[] }>(),
);
