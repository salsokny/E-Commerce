import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartState, CartItem } from '../../core/models';

const initialState: CartState = {
  items: [],
  total: 0,
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.addToCart, (state, { product, quantity }) => {
    const existingItem = state?.items?.find(
      (item) => item?.product?.id === product.id,
    );
    const items = existingItem
      ? state.items.map((item) =>
          item?.product?.id === product?.id
            ? { ...item, quantity: item?.quantity + quantity }
            : item,
        )
      : [...state.items, { product, quantity }];
    return {
      ...state,
      items,
      total: calculateTotal(items),
    };
  }),
  on(CartActions.removeFromCart, (state, { productId }) => {
    const items = state?.items?.filter(
      (item) => item?.product?.id !== productId,
    );
    return {
      ...state,
      items,
      total: calculateTotal(items),
    };
  }),
  on(CartActions.updateCartQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      const items = state.items?.filter(
        (item) => item?.product?.id !== productId,
      );
      return {
        ...state,
        items,
        total: calculateTotal(items),
      };
    }
    const items = state.items?.map((item) =>
      item.product?.id === productId ? { ...item, quantity } : item,
    );
    return {
      ...state,
      items,
      total: calculateTotal(items),
    };
  }),
  on(CartActions.clearCart, () => initialState),
  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    total: calculateTotal(items),
  })),
);

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item?.product?.price * item?.quantity,
    0,
  );
}
