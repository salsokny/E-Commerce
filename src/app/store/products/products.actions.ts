import { createAction, props } from '@ngrx/store';
import { Product, ProductFilters } from '../../core/models';

export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>(),
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>(),
);

export const searchProducts = createAction(
  '[Products] Search Products',
  props<{ searchTerm: string }>(),
);

export const filterProducts = createAction(
  '[Products] Filter Products',
  props<{ filters: ProductFilters }>(),
);

export const filterProductsSuccess = createAction(
  '[Products] Filter Products Success',
  props<{ products: Product[] }>(),
);

export const sortProducts = createAction(
  '[Products] Sort Products',
  props<{ sortBy: string }>(),
);
