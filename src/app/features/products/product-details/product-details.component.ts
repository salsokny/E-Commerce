import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models';
import * as CartActions from '../../../store/cart/cart.actions';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private async loadProduct(id: number): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const product = await firstValueFrom(
        this.productService.getProductById(id),
      );

      this.product = product;
    } catch (err) {
      this.error = 'Failed to load product details';
      console.error('Caught server exception:', err);
    } finally {
      this.loading = false;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.store.dispatch(
        CartActions.addToCart({
          product: this.product,
          quantity: this.quantity,
        }),
      );
      try {
        localStorage.setItem('last_action', 'added_to_cart');
      } catch (e) {
        console.error('Browser localStorage is full or blocked!', e);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
