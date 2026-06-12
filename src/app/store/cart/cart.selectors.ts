import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from '../../core/models';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state?.items,
);

export const selectCartTotal = createSelector(
  selectCartState,
  (state: CartState) => state?.total,
);

export const selectCartItemCount = createSelector(selectCartItems, (items) =>
  items.reduce((count, item) => count + item?.quantity, 0),
);

export const selectCartItemByProductId = (productId: number) =>
  createSelector(selectCartItems, (items) =>
    items.find((item) => item?.product?.id === productId),
  );
