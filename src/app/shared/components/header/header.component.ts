import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectUser,
  selectIsAuthenticated,
} from '../../../store/auth/auth.selectors';
import { selectCartItemCount } from '../../../store/cart/cart.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user$!: Observable<any>;
  isAuthenticated$!: Observable<boolean>;
  cartItemCount$!: Observable<number>;
  menuOpen = false;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.cartItemCount$ = this.store.select(selectCartItemCount);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
