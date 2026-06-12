import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface CartItem {
  product: { name: string; price: number };
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  public checkoutForm!: FormGroup;
  public loading = false;
  public error: string | null = null;

  // Replace these mock observables with your real CartService or NgRx Store selectors
  public cartItems$!: Observable<CartItem[]>;
  public cartTotal$!: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      street: [''],
      city: [''],
      zipCode: [''],
      country: [''],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: [null, [Validators.required]], // Managed by custom Datepicker
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  // Datepicker Handler: Captures chosen year from the calendar overlay panel
  public setYearHandler(normalizedYear: Date): void {
    const ctrlValue = this.checkoutForm.get('expiryDate')?.value || new Date();
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    this.checkoutForm.get('expiryDate')?.setValue(ctrlValue);
  }

  // Datepicker Handler: Captures chosen month, saves it, and shuts the overlay drawer
  public setMonthHandler(
    normalizedMonth: Date,
    datepicker: MatDatepicker<Date>,
  ): void {
    const ctrlValue = this.checkoutForm.get('expiryDate')?.value || new Date();
    ctrlValue.setMonth(normalizedMonth.getMonth());
    this.checkoutForm.get('expiryDate')?.setValue(ctrlValue);
    datepicker.close();
  }

  public onSubmit(): void {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.invalid) {
      return;
    }
    this.loading = true;
  }

  public backToCart(): void {
    this.router.navigate(['/cart']);
  }
}
