import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { User, UserRole, AuthSession } from '../models/user.model';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<AuthSession | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly USERS_KEY = 'movenest_users';
    private readonly SESSION_KEY = 'movenest_session';
    private readonly ADMIN_CODE = 'MOVENEST2026';

    private readonly API_URL = 'http://localhost:3000/api/auth';
    private resetCodes: Map<string, string> = new Map();

    constructor(
        private notificationService: NotificationService,
        private http: HttpClient
    ) {
        this.loadSession();
    }

    private loadSession() {
        const sessionData = localStorage.getItem(this.SESSION_KEY);
        if (sessionData) {
            const session = JSON.parse(sessionData);
            this.currentUserSubject.next(session);
        }
    }

    private getUsers(): User[] {
        const usersData = localStorage.getItem(this.USERS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    }

    private saveUsers(users: User[]) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    register(email: string, password: string, name: string, phone: string, role: UserRole, adminCode?: string): { success: boolean; message: string } {
        // Validate admin code if registering as admin
        if (role === UserRole.ADMIN && adminCode !== this.ADMIN_CODE) {
            return { success: false, message: 'Invalid admin code' };
        }

        const users = this.getUsers();

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser: User = {
            id: this.generateId(),
            email,
            password, // In production, hash this on backend
            name,
            phone,
            role,
            createdAt: new Date(),
            preferences: {
                savedAddresses: [],
                notifications: true,
                theme: 'light',
                language: 'en'
            }
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Registration successful' };
    }

    login(email: string, password: string): { success: boolean; message: string } {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Create session
        const session: AuthSession = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            loginTime: new Date()
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        this.currentUserSubject.next(session);

        return { success: true, message: 'Login successful' };
    }

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return this.currentUserSubject.value !== null;
    }

    isAdmin(): boolean {
        const session = this.currentUserSubject.value;
        return session?.role === UserRole.ADMIN;
    }

    isUser(): boolean {
        const session = this.currentUserSubject.value;
        return session?.role === UserRole.USER;
    }

    getCurrentUser(): AuthSession | null {
        return this.currentUserSubject.value;
    }

    getUserById(userId: string): User | undefined {
        const users = this.getUsers();
        return users.find(u => u.id === userId);
    }

    updateUser(userId: string, updates: Partial<User>): boolean {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) return false;

        users[index] = { ...users[index], ...updates };
        this.saveUsers(users);

        // Update session if current user
        const session = this.currentUserSubject.value;
        if (session && session.userId === userId) {
            const updatedSession = {
                ...session,
                name: updates.name || session.name,
                email: updates.email || session.email
            };
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(updatedSession));
            this.currentUserSubject.next(updatedSession);
        }

        return true;
    }

    resetPassword(email: string, newPassword: string): { success: boolean; message: string } {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            return { success: false, message: 'Email address not found' };
        }

        users[userIndex].password = newPassword;
        this.saveUsers(users);
        this.resetCodes.delete(email);

        return { success: true, message: 'Password has been reset successfully' };
    }

    sendResetCode(email: string): Observable<{ success: boolean; message: string }> {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return of({ success: false, message: 'Email address not found' }).pipe(delay(500));
        }

        return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/send-reset-code`, {
            email,
            userName: user.name
        }).pipe(
            tap(() => this.notificationService.success('Email sent! Check your inbox.')),
            catchError(error => {
                console.error('Failed to send reset code', error);
                const msg = error.error?.message || 'Failed to send verify email';
                this.notificationService.error(msg);
                return of({ success: false, message: msg });
            })
        );
    }

    verifyResetCode(email: string, code: string): Observable<boolean> {
        return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/verify-code`, {
            email,
            code
        }).pipe(
            map(response => response.success),
            catchError(() => of(false))
        );
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
