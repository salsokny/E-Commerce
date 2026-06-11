import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectFilteredProducts,
  selectProductsLoading,
} from '../../../store/products/products.selectors';
import * as ProductsActions from '../../../store/products/products.actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products$!: Observable<any[]>;
  loading$!: Observable<boolean>;
  searchTerm: string = '';
  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  sortBy: string = 'name';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts());
    this.products$ = this.store.select(selectFilteredProducts);
    this.loading$ = this.store.select(selectProductsLoading);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.store.dispatch(ProductsActions.sortProducts({ sortBy: this.sortBy }));
  }

  private applyFilters(): void {
    this.store.dispatch(
      ProductsActions.filterProducts({
        filters: {
          searchTerm: this.searchTerm,
          category: this.selectedCategory,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          sortBy: this.sortBy,
        },
      }),
    );
  }
}
