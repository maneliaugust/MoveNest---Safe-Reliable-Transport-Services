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

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                        <label for="password">Password</label>
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

                    <div class="error-banner" *ngIf="errorMessage">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        {{ errorMessage }}
                    </div>

                    <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || loading">
                        <span *ngIf="!loading">Login</span>
                        <span *ngIf="loading">Logging in...</span>
                    </button>
                </form>

                <div class="auth-footer">
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
    loading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
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
}
