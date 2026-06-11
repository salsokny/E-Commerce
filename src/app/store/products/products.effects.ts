import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as ProductsActions from './products.actions';
import { ProductService } from '../../core/services/product.service';

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.productService.getAllProducts().pipe(
          map((products) => ProductsActions.loadProductsSuccess({ products })),
          catchError((error) =>
            of(ProductsActions.loadProductsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService,
  ) {}
}
