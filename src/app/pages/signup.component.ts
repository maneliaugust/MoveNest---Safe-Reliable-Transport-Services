import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Component({
    selector: 'mn-signup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <section class="auth-section">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Create Account</h1>
                    <p>Join MoveNest today</p>
                </div>

                <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            formControlName="name"
                            placeholder="John Doe"
                            [class.error]="isFieldInvalid('name')">
                        <span class="error-message" *ngIf="isFieldInvalid('name')">
                            Name is required
                        </span>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            formControlName="email"
                            placeholder="your@email.com"
                            [class.error]="isFieldInvalid('email')">
                        <span class="error-message" *ngIf="isFieldInvalid('email')">
                            Valid email is required
                        </span>
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            formControlName="phone"
                            placeholder="+27 123 456 789"
                            [class.error]="isFieldInvalid('phone')">
                        <span class="error-message" *ngIf="isFieldInvalid('phone')">
                            Phone number is required
                        </span>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            formControlName="password"
                            placeholder="Min 8 chars, uppercase, number & special char"
                            [class.error]="isFieldInvalid('password')">
                        <span class="error-message" *ngIf="signupForm.get('password')?.hasError('required') && signupForm.get('password')?.touched">
                            Password is required
                        </span>
                        <span class="error-message" *ngIf="signupForm.get('password')?.hasError('minlength') && signupForm.get('password')?.touched">
                            Password must be at least 8 characters
                        </span>
                        <span class="error-message" *ngIf="signupForm.get('password')?.hasError('passwordStrength') && signupForm.get('password')?.touched">
                            Password must include uppercase, lowercase, number & special character
                        </span>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            formControlName="confirmPassword"
                            placeholder="Re-enter password"
                            [class.error]="isFieldInvalid('confirmPassword')">
                        <span class="error-message" *ngIf="signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched">
                            Passwords do not match
                        </span>
                    </div>

                    <div class="form-group role-selection">
                        <label>Account Type</label>
                        <div class="role-options">
                            <label class="role-option">
                                <input type="radio" formControlName="role" [value]="UserRole.USER">
                                <span class="role-card">
                                    <i class="fa-solid fa-user"></i>
                                    <strong>User</strong>
                                    <small>Book transport services</small>
                                </span>
                            </label>
                            <label class="role-option">
                                <input type="radio" formControlName="role" [value]="UserRole.ADMIN">
                                <span class="role-card">
                                    <i class="fa-solid fa-user-shield"></i>
                                    <strong>Admin</strong>
                                    <small>Manage bookings</small>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group" *ngIf="signupForm.get('role')?.value === UserRole.ADMIN">
                        <label for="adminCode">Admin Code</label>
                        <input 
                            type="text" 
                            id="adminCode" 
                            formControlName="adminCode"
                            placeholder="Enter admin code"
                            [class.error]="isFieldInvalid('adminCode')">
                        <span class="error-message" *ngIf="isFieldInvalid('adminCode')">
                            Admin code is required
                        </span>
                    </div>

                    <div class="error-banner" *ngIf="errorMessage">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        {{ errorMessage }}
                    </div>

                    <div class="success-banner" *ngIf="successMessage">
                        <i class="fa-solid fa-circle-check"></i>
                        {{ successMessage }}
                    </div>

                    <button type="submit" class="btn-primary" [disabled]="signupForm.invalid || loading">
                        <span *ngIf="!loading">Create Account</span>
                        <span *ngIf="loading">Creating Account...</span>
                    </button>
                </form>

                <div class="auth-footer">
                    <p>Already have an account? <a routerLink="/login">Login</a></p>
                </div>
            </div>
        </div>
    </section>
    `,
    styles: [`
    .auth-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #226666 0%, #1a4d4d 100%);
        padding: 3rem 1rem;
    }

    .auth-container {
        width: 100%;
        max-width: 500px;
    }

    .auth-card {
        background: white;
        padding: 3rem 2.5rem;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .auth-header {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .auth-header h1 {
        color: var(--primary-color);
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .auth-header p {
        color: #666;
        font-size: 1rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="password"] {
        width: 100%;
        padding: 0.9rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    input:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    input.error {
        border-color: #dc3545;
    }

    .error-message {
        display: block;
        color: #dc3545;
        font-size: 0.85rem;
        margin-top: 0.4rem;
    }

    .role-selection {
        margin: 2rem 0;
    }

    .role-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .role-option {
        cursor: pointer;
    }

    .role-option input[type="radio"] {
        display: none;
    }

    .role-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        transition: all 0.3s;
        text-align: center;
    }

    .role-card i {
        font-size: 2rem;
        color: #666;
    }

    .role-card strong {
        font-size: 1rem;
        color: #333;
    }

    .role-card small {
        font-size: 0.8rem;
        color: #999;
    }

    .role-option input[type="radio"]:checked + .role-card {
        border-color: var(--accent-color);
        background: rgba(255, 107, 53, 0.05);
    }

    .role-option input[type="radio"]:checked + .role-card i {
        color: var(--accent-color);
    }

    .error-banner {
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 0.9rem 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        font-size: 0.9rem;
    }

    .success-banner {
        background: #efe;
        border: 1px solid #cfc;
        color: #3c3;
        padding: 0.9rem 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        font-size: 0.9rem;
    }

    .btn-primary {
        width: 100%;
        padding: 1rem;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
        background: #e65a2f;
        transform: translateY(-2px);
    }

    .btn-primary:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .auth-footer {
        margin-top: 2rem;
        text-align: center;
        color: #666;
    }

    .auth-footer a {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 600;
    }

    .auth-footer a:hover {
        text-decoration: underline;
    }

    @media (max-width: 480px) {
        .auth-card {
            padding: 2rem 1.5rem;
        }

        .auth-header h1 {
            font-size: 1.6rem;
        }

        .role-options {
            grid-template-columns: 1fr;
        }
    }
    `]
})
export class SignupComponent {
    signupForm: FormGroup;
    loading = false;
    errorMessage = '';
    successMessage = '';
    UserRole = UserRole;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.signupForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
            confirmPassword: ['', Validators.required],
            role: [UserRole.USER, Validators.required],
            adminCode: ['']
        }, { validators: this.passwordMatchValidator });

        // Add conditional validator for admin code
        this.signupForm.get('role')?.valueChanges.subscribe(role => {
            const adminCodeControl = this.signupForm.get('adminCode');
            if (role === UserRole.ADMIN) {
                adminCodeControl?.setValidators([Validators.required]);
            } else {
                adminCodeControl?.clearValidators();
            }
            adminCodeControl?.updateValueAndValidity();
        });
    }

    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

        return valid ? null : { passwordStrength: true };
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) return null;

        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    isFieldInvalid(field: string): boolean {
        const control = this.signupForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit() {
        if (this.signupForm.invalid) return;

        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const { name, email, phone, password, role, adminCode } = this.signupForm.value;
        const result = this.authService.register(email, password, name, phone, role, adminCode);

        this.loading = false;

        if (result.success) {
            this.successMessage = result.message + ' - Redirecting to login...';
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 2000);
        } else {
            this.errorMessage = result.message;
        }
    }
}
