import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'mn-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <section class="auth-section">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your MoveNest account</p>
                </div>

                <form *ngIf="!forgotPasswordMode" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                        <div class="label-wrapper">
                            <label for="password">Password</label>
                            <a href="javascript:void(0)" class="forgot-link" (click)="toggleForgotPassword(true)">Forgot Password?</a>
                        </div>
                        <input 
                            type="password" 
                            id="password" 
                            formControlName="password"
                            placeholder="Enter your password"
                            [class.error]="isFieldInvalid('password')">
                        <span class="error-message" *ngIf="isFieldInvalid('password')">
                            Password is required
                        </span>
                    </div>

                    <div class="error-banner" *ngIf="errorMessage && !forgotPasswordMode">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        {{ errorMessage }}
                    </div>

                    <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || loading">
                        <span *ngIf="!loading">Login</span>
                        <span *ngIf="loading">Logging in...</span>
                    </button>
                </form>

                <!-- Forgot Password Flow -->
                <div *ngIf="forgotPasswordMode" class="forgot-password-flow">
                    <!-- Step 1: Email Verification -->
                    <div *ngIf="forgotPasswordStep === 'email'" class="step-container">
                        <h2>Reset Password</h2>
                        <p>Enter your email to verify your account</p>
                        
                        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onVerifyEmail()">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" formControlName="email" placeholder="registered@email.com">
                            </div>

                            <div class="error-banner" *ngIf="forgotPasswordError">
                                <i class="fa-solid fa-circle-exclamation"></i>
                                {{ forgotPasswordError }}
                            </div>

                            <button type="submit" class="btn-primary" [disabled]="forgotPasswordForm.invalid || loading">
                                Continue
                            </button>
                        </form>
                    </div>

                    <!-- Step 2: Verification Code -->
                    <div *ngIf="forgotPasswordStep === 'code'" class="step-container">
                        <h2>Check Your Email</h2>
                        <p>We've sent a 4-digit code to <strong>{{ targetEmail }}</strong></p>
                        
                        <form [formGroup]="verificationCodeForm" (ngSubmit)="onVerifyCode()">
                            <div class="form-group">
                                <label>Verification Code</label>
                                <div class="code-inputs">
                                    <input type="text" formControlName="code" maxlength="4" placeholder="0000" class="code-input">
                                </div>
                            </div>

                            <div class="error-banner" *ngIf="forgotPasswordError">
                                <i class="fa-solid fa-circle-exclamation"></i>
                                {{ forgotPasswordError }}
                            </div>

                            <button type="submit" class="btn-primary" [disabled]="verificationCodeForm.invalid || loading">
                                Verify Code
                            </button>
                        </form>
                    </div>

                    <!-- Step 3: New Password -->
                    <div *ngIf="forgotPasswordStep === 'new-password'" class="step-container">
                        <h2>Create New Password</h2>
                        <p>Choose a secure password for your account</p>
                        
                        <form [formGroup]="resetPasswordForm" (ngSubmit)="onResetPassword()">
                            <div class="form-group">
                                <label>New Password</label>
                                <input type="password" formControlName="newPassword" placeholder="Minimum 6 characters">
                            </div>

                            <div class="form-group">
                                <label>Confirm Password</label>
                                <input type="password" formControlName="confirmPassword" placeholder="Confirm your password">
                            </div>

                            <div class="error-banner" *ngIf="resetError">
                                <i class="fa-solid fa-circle-exclamation"></i>
                                {{ resetError }}
                            </div>

                            <button type="submit" class="btn-primary" [disabled]="resetPasswordForm.invalid || loading">
                                Reset Password
                            </button>
                        </form>
                    </div>

                    <!-- Step 3: Success -->
                    <div *ngIf="forgotPasswordStep === 'success'" class="step-container success-step">
                        <div class="success-icon">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h2>Password Reset!</h2>
                        <p>Your password has been successfully updated. You can now login with your new password.</p>
                        
                        <button class="btn-primary" (click)="toggleForgotPassword(false)">
                            Back to Login
                        </button>
                    </div>

                    <a *ngIf="forgotPasswordStep !== 'success'" href="javascript:void(0)" class="back-link" (click)="toggleForgotPassword(false)">
                        <i class="fa-solid fa-arrow-left"></i> Back to Login
                    </a>
                </div>

                <div class="auth-footer" *ngIf="!forgotPasswordMode">
                    <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
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
        padding: 2rem 1rem;
    }

    .auth-container {
        width: 100%;
        max-width: 450px;
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

    .label-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .label-wrapper label {
        margin-bottom: 0;
    }

    .forgot-link {
        font-size: 0.85rem;
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 600;
    }

    .forgot-link:hover {
        text-decoration: underline;
    }

    input {
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

    .forgot-password-flow h2 {
        color: var(--primary-color);
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .forgot-password-flow p {
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }

    .back-link {
        display: block;
        text-align: center;
        margin-top: 1.5rem;
        color: #666;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .back-link:hover {
        color: var(--primary-color);
    }

    .success-step {
        text-align: center;
    }

    .success-icon {
        font-size: 4rem;
        color: #28a745;
        margin-bottom: 1.5rem;
    }

    .code-input {
        letter-spacing: 0.5rem;
        text-align: center;
        font-size: 1.5rem !important;
        font-weight: 700;
        color: var(--primary-color);
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
    }
    `]
})
export class LoginComponent {
    loginForm: FormGroup;
    forgotPasswordForm: FormGroup;
    verificationCodeForm: FormGroup;
    resetPasswordForm: FormGroup;
    loading = false;
    errorMessage = '';

    // Forgot Password State
    forgotPasswordMode = false;
    forgotPasswordStep: 'email' | 'code' | 'new-password' | 'success' = 'email';
    forgotPasswordError = '';
    resetError = '';
    targetEmail = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.verificationCodeForm = this.fb.group({
            code: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
        });

        this.resetPasswordForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.passwordMatcher });
    }

    passwordMatcher(group: FormGroup) {
        const password = group.get('newPassword')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return password === confirm ? null : { mismatch: true };
    }

    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit() {
        if (this.loginForm.invalid) return;

        this.loading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;
        const result = this.authService.login(email, password);

        this.loading = false;

        if (result.success) {
            // Redirect based on role
            if (this.authService.isAdmin()) {
                this.router.navigate(['/admin']);
            } else {
                this.router.navigate(['/']);
            }
        } else {
            this.errorMessage = result.message;
        }
    }

    toggleForgotPassword(show: boolean) {
        this.forgotPasswordMode = show;
        this.forgotPasswordStep = 'email';
        this.forgotPasswordError = '';
        this.resetError = '';
        this.errorMessage = '';
        if (!show) {
            this.forgotPasswordForm.reset();
            this.resetPasswordForm.reset();
        }
    }

    onVerifyEmail() {
        if (this.forgotPasswordForm.invalid) return;

        this.loading = true;
        this.forgotPasswordError = '';

        const email = this.forgotPasswordForm.value.email;

        this.authService.sendResetCode(email).subscribe({
            next: (result) => {
                this.loading = false;
                if (result.success) {
                    this.targetEmail = email;
                    this.forgotPasswordStep = 'code';
                } else {
                    this.forgotPasswordError = result.message;
                }
            },
            error: () => {
                this.loading = false;
                this.forgotPasswordError = 'Failed to connect to server';
            }
        });
    }

    onVerifyCode() {
        if (this.verificationCodeForm.invalid) return;

        this.loading = true;
        this.forgotPasswordError = '';

        const code = this.verificationCodeForm.value.code;

        this.authService.verifyResetCode(this.targetEmail, code).subscribe(isValid => {
            this.loading = false;
            if (isValid) {
                this.forgotPasswordStep = 'new-password';
            } else {
                this.forgotPasswordError = 'Invalid verification code';
            }
        });
    }

    onResetPassword() {
        if (this.resetPasswordForm.invalid) return;

        this.loading = true;
        this.resetError = '';

        const newPassword = this.resetPasswordForm.value.newPassword;
        const result = this.authService.resetPassword(this.targetEmail, newPassword);

        setTimeout(() => {
            this.loading = false;
            if (result.success) {
                this.forgotPasswordStep = 'success';
            } else {
                this.resetError = result.message;
            }
        }, 800);
    }
}
