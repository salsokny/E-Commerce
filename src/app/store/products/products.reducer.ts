import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { ProductState } from '../../core/models';

const initialState: ProductState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'name',
  },
};

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    items: products,
    filteredItems: applyFilters(products, state.filters),
    loading: false,
  })),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductsActions.filterProducts, (state, { filters }) => ({
    ...state,
    filters,
    filteredItems: applyFilters(state.items, filters),
  })),
  on(ProductsActions.sortProducts, (state, { sortBy }) => ({
    ...state,
    filters: { ...state.filters, sortBy },
    filteredItems: sortItems([...state.filteredItems], sortBy),
  })),
);

function applyFilters(items: any[], filters: any): any[] {
  return items.filter(
    (item) =>
      (filters.searchTerm === '' ||
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (filters.category === '' || item.category === filters.category) &&
      item.price >= filters.minPrice &&
      item.price <= filters.maxPrice,
  );
}

function sortItems(items: any[], sortBy: string): any[] {
  switch (sortBy) {
    case 'price-asc':
      return items.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return items.sort((a, b) => b.price - a.price);
    case 'rating':
      return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return items.sort((a, b) => a.name.localeCompare(b.name));
  }
}
