import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../services/booking.service';

@Component({
    selector: 'mn-payment',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <section class="payment-section">
      <div class="container">
        
        <!-- Booking Summary -->
        <div class="summary-card" *ngIf="booking">
            <div class="summary-header">
                <h3>Order Summary</h3>
                <span class="order-id">#{{booking.id}}</span>
            </div>
            <div class="summary-details">
                <div class="detail-row">
                    <span class="label">Service</span>
                    <span class="value">{{booking.service | titlecase}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date & Time</span>
                    <span class="value">{{booking.date | date}} at {{booking.time}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Pickup</span>
                    <span class="value">{{booking.pickup}}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Dropoff</span>
                    <span class="value">{{booking.dropoff}}</span>
                </div>
            </div>
        </div>

        <div class="payment-card">
            <h2>Complete Your Payment</h2>
            <p class="subtitle">Select your preferred payment method</p>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="success-overlay fade-in">
                <div class="success-content">
                    <i class="fa-solid fa-circle-check"></i>
                    <h3>Payment Successful!</h3>
                    <p>{{successMessage}}</p>
                    <button class="btn-home" (click)="goHome()">Return Home</button>
                </div>
            </div>

            <!-- Payment Options -->
            <div class="payment-options" *ngIf="!successMessage">
                <button 
                    class="option-btn" 
                    [class.active]="selectedMethod === 'cash'"
                    (click)="selectMethod('cash')">
                    <i class="fa-solid fa-money-bill-wave"></i>
                    <span>Cash on Arrival</span>
                </button>
                <button 
                    class="option-btn" 
                    [class.active]="selectedMethod === 'card'"
                    (click)="selectMethod('card')">
                    <i class="fa-regular fa-credit-card"></i>
                    <span>Pay Online (Card)</span>
                </button>
            </div>

            <!-- Cash Info -->
            <div *ngIf="selectedMethod === 'cash' && !successMessage" class="method-details fade-in">
                <div class="alert-info">
                    <p>You have selected to pay with <strong>Cash</strong>.</p>
                    <p>Please have the exact amount ready upon pickup.</p>
                </div>
                <button class="btn-confirm" (click)="confirmCashPayment()">Confirm Cash Payment</button>
            </div>

            <!-- Card Form -->
            <div *ngIf="selectedMethod === 'card' && !successMessage" class="method-details fade-in">
                <form [formGroup]="cardForm" (ngSubmit)="processCardPayment()">
                    <div class="form-group">
                        <label>Cardholder Name</label>
                        <input type="text" formControlName="name" placeholder="John Doe"
                               [class.error-input]="isFieldInvalid('name')">
                        <div class="error-msg" *ngIf="isFieldInvalid('name')">
                            Name is required
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" formControlName="number" placeholder="0000 0000 0000 0000" maxlength="19"
                               [class.error-input]="isFieldInvalid('number')">
                        <div class="error-msg" *ngIf="isFieldInvalid('number')">
                            {{ getCardNumberError() }}
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Expiry Date</label>
                            <input type="text" formControlName="expiry" placeholder="MM/YY" maxlength="5"
                                   [class.error-input]="isFieldInvalid('expiry')">
                            <div class="error-msg" *ngIf="isFieldInvalid('expiry')">
                                {{ getExpiryError() }}
                            </div>
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" formControlName="cvv" placeholder="123" maxlength="4"
                                   [class.error-input]="isFieldInvalid('cvv')">
                            <div class="error-msg" *ngIf="isFieldInvalid('cvv')">
                                Invalid CVV
                            </div>
                        </div>
                    </div>

                    <button type="submit" [disabled]="cardForm.invalid || processing" class="btn-confirm">
                        {{ processing ? 'Processing Payment...' : 'Pay Now' }}
                    </button>
                </form>
                
                <div class="secure-badge">
                    <i class="fa-solid fa-lock"></i>
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .payment-section {
        padding: 8rem 0 5rem;
        background: #f4f6f8;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    .container {
        width: 100%;
        max-width: 600px;
        padding: 0 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    /* Summary Card */
    .summary-card {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        border-left: 5px solid var(--primary-color);
    }
    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
    }
    .summary-header h3 { margin: 0; color: #333; font-size: 1.2rem; }
    .order-id { font-size: 0.9rem; color: #999; }
    .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }
    .detail-row .label { color: #666; }
    .detail-row .value { font-weight: 500; color: #333; text-align: right; }

    /* Payment Card */
    .payment-card {
        background: white;
        padding: 2.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    h2 { color: var(--primary-color); margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 2rem; }
    
    .payment-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .option-btn {
        background: white;
        border: 2px solid #eee;
        padding: 1.5rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
    }
    .option-btn i { font-size: 2rem; color: #999; }
    .option-btn span { font-weight: 500; color: #555; }
    .option-btn:hover { border-color: var(--accent-color); }
    .option-btn.active {
        border-color: var(--accent-color);
        background: rgba(255, 127, 80, 0.05);
    }
    .option-btn.active i, .option-btn.active span { color: var(--accent-color); }

    .method-details { text-align: left; margin-top: 1rem; }
    
    .alert-info {
        background: #e3f2fd;
        padding: 1rem;
        border-radius: 8px;
        color: #0d47a1;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }

    .form-group { margin-bottom: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; color: #333; }
    
    input { 
        width: 100%; 
        padding: 0.8rem; 
        border: 1px solid #ddd; 
        border-radius: 6px; 
        font-size: 1rem; 
        transition: border 0.3s;
    }
    input:focus { border-color: var(--accent-color); outline: none; }
    input.error-input { border-color: #dc3545; background: #fff8f8; }

    .error-msg {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.3rem;
        animation: slideDown 0.2s ease;
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .btn-confirm {
        width: 100%;
        padding: 1rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
    }
    .btn-confirm:hover { background: #1a4d4d; }
    .btn-confirm:disabled { background: #ccc; cursor: not-allowed; }

    .secure-badge {
        margin-top: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #888;
        font-size: 0.85rem;
    }

    /* Success Overlay */
    .success-overlay {
        text-align: center;
        padding: 2rem 0;
    }
    .success-content i {
        font-size: 4rem;
        color: #28a745;
        margin-bottom: 1rem;
    }
    .success-content h3 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    .success-content p {
        color: #666;
        margin-bottom: 2rem;
    }
    .btn-home {
        padding: 0.8rem 2rem;
        background: #333;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
    }

    .fade-in { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PaymentComponent implements OnInit {
    bookingId: string | null = null;
    booking: Booking | undefined;
    cardForm: FormGroup;
    processing = false;
    successMessage: string | null = null;
    selectedMethod: 'cash' | 'card' | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private bookingService: BookingService
    ) {
        this.cardForm = this.fb.group({
            name: ['', Validators.required],
            number: ['', [Validators.required, this.luhnValidator]],
            expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/), this.expiryValidator]],
            cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
        });
    }

    ngOnInit() {
        this.bookingId = this.route.snapshot.paramMap.get('id');
        if (this.bookingId) {
            this.booking = this.bookingService.getBookingById(this.bookingId);
            if (!this.booking) {
                this.router.navigate(['/']);
            }
        } else {
            this.router.navigate(['/']);
        }
    }

    selectMethod(method: 'cash' | 'card') {
        this.selectedMethod = method;
    }

    // Custom Luhn Validator for Credit Card Numbers
    luhnValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;

        let value = control.value.replace(/\D/g, '');
        if (value.length < 13 || value.length > 19) return { invalidLength: true };

        let sum = 0;
        let shouldDouble = false;

        // Loop through values starting from the rightmost digit
        for (let i = value.length - 1; i >= 0; i--) {
            let digit = parseInt(value.charAt(i));

            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return (sum % 10) === 0 ? null : { luhnInvalid: true };
    }

    // Custom Expiry Date Validator
    expiryValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(control.value)) return null; // Let regex handle format

        const [month, year] = control.value.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
        const currentMonth = new Date().getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return { expired: true };
        }
        return null;
    }

    isFieldInvalid(field: string): boolean {
        const control = this.cardForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    getCardNumberError(): string {
        const control = this.cardForm.get('number');
        if (control?.errors?.['required']) return 'Card number is required';
        if (control?.errors?.['invalidLength']) return 'Invalid card length';
        if (control?.errors?.['luhnInvalid']) return 'Invalid card number';
        return 'Invalid card';
    }

    getExpiryError(): string {
        const control = this.cardForm.get('expiry');
        if (control?.errors?.['required']) return 'Required';
        if (control?.errors?.['pattern']) return 'Format: MM/YY';
        if (control?.errors?.['expired']) return 'Card has expired';
        return 'Invalid date';
    }

    confirmCashPayment() {
        if (this.bookingId) {
            this.bookingService.updatePayment(this.bookingId, 'cash', 'pending');
            this.successMessage = "Your booking is confirmed! Please pay cash on arrival.";
        }
    }

    processCardPayment() {
        if (this.cardForm.valid && this.bookingId) {
            this.processing = true;

            // Simulate API call
            setTimeout(() => {
                try {
                    this.bookingService.updatePayment(this.bookingId!, 'card', 'paid');
                    this.successMessage = "Thank you! Your payment has been processed successfully.";
                } catch (error) {
                    console.error('Payment Error:', error);
                    alert('An error occurred while processing the payment. Please try again.');
                } finally {
                    this.processing = false;
                }
            }, 1000);
        } else {
            this.cardForm.markAllAsTouched();
        }
    }

    goHome() {
        this.router.navigate(['/']);
    }
}
