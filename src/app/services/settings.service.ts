import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
    // Business Settings (Admin only)
    businessName: string;
    businessPhone: string;
    whatsappNumber: string;
    businessEmail: string;

    // Pricing Settings (Admin only)
    baseRates: {
        kids: number;
        staff: number;
        luggage: number;
        carhire: number;
    };
    ratePerKm: number;
    monthlyDiscount: number;

    // App Settings (Both)
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    distanceUnit: 'km' | 'miles';
    mapProvider: 'google' | 'leaflet' | 'none';
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly SETTINGS_KEY = 'movenest_settings';

    private defaultSettings: AppSettings = {
        businessName: 'MoveNest',
        businessPhone: '+27 123 456 789',
        whatsappNumber: '27781918983',
        businessEmail: 'info@movenest.co.za',
        baseRates: {
            kids: 100,
            staff: 150,
            luggage: 250,
            carhire: 200
        },
        ratePerKm: 12,
        monthlyDiscount: 0.30,
        theme: 'system',
        language: 'en',
        notifications: true,
        distanceUnit: 'km',
        mapProvider: 'leaflet'
    };

    private settingsSubject = new BehaviorSubject<AppSettings>(this.defaultSettings);
    public settings$ = this.settingsSubject.asObservable();

    constructor() {
        this.loadSettings();
        this.setupSystemThemeListener();
    }

    private setupSystemThemeListener() {
        if (typeof window !== 'undefined') {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (this.getSettings().theme === 'system') {
                    this.applyTheme('system');
                }
            });
        }
    }

    private loadSettings() {
        const stored = localStorage.getItem(this.SETTINGS_KEY);
        if (stored) {
            const settings = JSON.parse(stored);
            const combined = { ...this.defaultSettings, ...settings };
            this.settingsSubject.next(combined);
            this.applyTheme(combined.theme);
        } else {
            this.applyTheme(this.defaultSettings.theme);
        }
    }

    getSettings(): AppSettings {
        return this.settingsSubject.value;
    }

    updateSettings(updates: Partial<AppSettings>): void {
        const currentSettings = this.settingsSubject.value;
        const newSettings = { ...currentSettings, ...updates };

        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
        this.settingsSubject.next(newSettings);

        if (updates.theme) {
            this.applyTheme(updates.theme);
        }
    }

    private applyTheme(theme: 'light' | 'dark' | 'system'): void {
        if (typeof document === 'undefined') return;

        let themeToApply = theme;
        if (theme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', themeToApply);
        // Also add class to body for broader compatibility
        if (themeToApply === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.style.backgroundColor = '#121212';
            document.body.style.color = '#E0E0E0';
        } else {
            document.body.classList.remove('dark-theme');
            document.body.style.backgroundColor = '#F9FAFB';
            document.body.style.color = '#333333';
        }
    }

    resetToDefaults(): void {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.defaultSettings));
        this.settingsSubject.next(this.defaultSettings);
    }

    formatDistance(km: number): string {
        const unit = this.getSettings().distanceUnit;
        if (unit === 'miles') {
            const miles = km * 0.621371;
            return `${miles.toFixed(1)} mi`;
        }
        return `${km.toFixed(1)} km`;
    }
}
