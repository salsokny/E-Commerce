import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../../core/models';

export const selectProductsState =
  createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state: ProductState) => state.items,
);

export const selectFilteredProducts = createSelector(
  selectProductsState,
  (state: ProductState) => state.filteredItems,
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state: ProductState) => state.loading,
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state: ProductState) => state.error,
);

export const selectProductFilters = createSelector(
  selectProductsState,
  (state: ProductState) => state.filters,
);

export const selectProductById = (id: number) =>
  createSelector(selectAllProducts, (products) =>
    products.find((p) => p.id === id),
  );

export const selectCategories = createSelector(
  selectAllProducts,
  (products) => [...new Set(products.map((p) => p.category))],
);
