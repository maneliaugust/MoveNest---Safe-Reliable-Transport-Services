import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as L from 'leaflet';
import { AuthService } from '../services/auth.service';
import { SettingsService, AppSettings } from '../services/settings.service';
import { User, SavedAddress } from '../models/user.model';

@Component({
    selector: 'mn-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    template: `
    <section class="settings-section">
        <div class="container">
            <div class="settings-header">
                <h1><i class="fa-solid fa-gear"></i> Settings</h1>
                <p *ngIf="currentUser">Welcome, {{ currentUser.name }}</p>
            </div>

            <div class="settings-content">
                <!-- Sidebar Navigation -->
                <div class="settings-sidebar">
                    <button 
                        class="tab-btn" 
                        [class.active]="activeTab === 'profile'"
                        (click)="activeTab = 'profile'">
                        <i class="fa-solid fa-user"></i>
                        Profile
                    </button>
                    
                    <button 
                        *ngIf="isAdmin"
                        class="tab-btn" 
                        [class.active]="activeTab === 'business'"
                        (click)="activeTab = 'business'">
                        <i class="fa-solid fa-building"></i>
                        Business Info
                    </button>
                    
                    <button 
                        *ngIf="isAdmin"
                        class="tab-btn" 
                        [class.active]="activeTab === 'pricing'"
                        (click)="activeTab = 'pricing'">
                        <i class="fa-solid fa-dollar-sign"></i>
                        Pricing
                    </button>
                    
                    <button 
                        class="tab-btn" 
                        [class.active]="activeTab === 'app'"
                        (click)="activeTab = 'app'">
                        <i class="fa-solid fa-sliders"></i>
                        App Settings
                    </button>

                    <button 
                        class="tab-btn" 
                        [class.active]="activeTab === 'navigation'"
                        (click)="activeTab = 'navigation'">
                        <i class="fa-solid fa-map-location-dot"></i>
                        Navigation
                    </button>
                    
                    <button 
                        class="tab-btn logout-btn" 
                        (click)="logout()">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </button>
                </div>

                <!-- Main Content Area -->
                <div class="settings-main">
                    <!-- Profile Settings -->
                    <div *ngIf="activeTab === 'profile'" class="settings-panel">
                        <h2>Profile Information</h2>
                        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" formControlName="name">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" formControlName="email">
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" formControlName="phone">
                            </div>
                            
                            <div class="success-message" *ngIf="profileSuccess">
                                <i class="fa-solid fa-check-circle"></i>
                                Profile updated successfully!
                            </div>
                            
                            <button type="submit" class="btn-primary" [disabled]="profileForm.invalid">
                                Save Changes
                            </button>
                        </form>

                        <div class="section-divider"></div>

                        <h3>Saved Addresses</h3>
                        <div class="saved-addresses">
                            <div *ngFor="let address of savedAddresses" class="address-card">
                                <div class="address-info">
                                    <strong>{{ address.label }}</strong>
                                    <p>{{ address.address }}</p>
                                </div>
                                <button class="btn-delete" (click)="deleteAddress(address.id)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            <button class="btn-add" (click)="showAddAddressForm = !showAddAddressForm">
                                <i class="fa-solid fa-plus"></i>
                                Add New Address
                            </button>
                            
                            <form *ngIf="showAddAddressForm" [formGroup]="addressForm" (ngSubmit)="addAddress()" class="add-address-form">
                                <div class="form-group">
                                    <label>Label (e.g., Home, Work)</label>
                                    <input type="text" formControlName="label">
                                </div>
                                <div class="form-group">
                                    <label>Address</label>
                                    <input type="text" formControlName="address">
                                </div>
                                <button type="submit" class="btn-primary" [disabled]="addressForm.invalid">
                                    Save Address
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Business Settings (Admin Only) -->
                    <div *ngIf="activeTab === 'business' && isAdmin" class="settings-panel">
                        <h2>Business Information</h2>
                        <form [formGroup]="businessForm" (ngSubmit)="saveBusinessSettings()">
                            <div class="form-group">
                                <label>Business Name</label>
                                <input type="text" formControlName="businessName">
                            </div>
                            <div class="form-group">
                                <label>Business Phone</label>
                                <input type="tel" formControlName="businessPhone">
                            </div>
                            <div class="form-group">
                                <label>WhatsApp Number</label>
                                <input type="tel" formControlName="whatsappNumber">
                                <small>Format: 27123456789 (country code + number, no spaces)</small>
                            </div>
                            <div class="form-group">
                                <label>Business Email</label>
                                <input type="email" formControlName="businessEmail">
                            </div>
                            
                            <div class="success-message" *ngIf="businessSuccess">
                                <i class="fa-solid fa-check-circle"></i>
                                Business settings updated successfully!
                            </div>
                            
                            <button type="submit" class="btn-primary" [disabled]="businessForm.invalid">
                                Save Changes
                            </button>
                        </form>
                    </div>

                    <!-- Pricing Settings (Admin Only) -->
                    <div *ngIf="activeTab === 'pricing' && isAdmin" class="settings-panel">
                        <h2>Pricing Configuration</h2>
                        <form [formGroup]="pricingForm" (ngSubmit)="savePricingSettings()">
                            <h3>Base Rates</h3>
                            <div class="pricing-grid">
                                <div class="form-group">
                                    <label>Kids Transport</label>
                                    <div class="input-with-prefix">
                                        <span>R</span>
                                        <input type="number" formControlName="kidsRate" min="0">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Staff Transport</label>
                                    <div class="input-with-prefix">
                                        <span>R</span>
                                        <input type="number" formControlName="staffRate" min="0">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Luggage Transport</label>
                                    <div class="input-with-prefix">
                                        <span>R</span>
                                        <input type="number" formControlName="luggageRate" min="0">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Car Hire</label>
                                    <div class="input-with-prefix">
                                        <span>R</span>
                                        <input type="number" formControlName="carhireRate" min="0">
                                    </div>
                                </div>
                            </div>

                            <div class="section-divider"></div>

                            <h3>Additional Rates</h3>
                            <div class="form-group">
                                <label>Rate per Kilometer</label>
                                <div class="input-with-prefix">
                                    <span>R</span>
                                    <input type="number" formControlName="ratePerKm" min="0" step="0.1">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Monthly Contract Discount</label>
                                <div class="input-with-suffix">
                                    <input type="number" formControlName="monthlyDiscount" min="0" max="100">
                                    <span>%</span>
                                </div>
                            </div>
                            
                            <div class="success-message" *ngIf="pricingSuccess">
                                <i class="fa-solid fa-check-circle"></i>
                                Pricing updated successfully!
                            </div>
                            
                            <button type="submit" class="btn-primary" [disabled]="pricingForm.invalid">
                                Save Changes
                            </button>
                        </form>
                    </div>

                    <!-- App Settings (Both) -->
                    <div *ngIf="activeTab === 'app'" class="settings-panel">
                        <h2>App Preferences</h2>
                        <form [formGroup]="appForm" (ngSubmit)="saveAppSettings()">
                            <div class="form-group">
                                <label>Theme</label>
                                <select formControlName="theme">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Language</label>
                                <select formControlName="language">
                                    <option value="en">English</option>
                                    <option value="af">Afrikaans</option>
                                </select>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" formControlName="notifications">
                                    Enable Notifications
                                </label>
                            </div>
                            
                            <div class="success-message" *ngIf="appSuccess">
                                <i class="fa-solid fa-check-circle"></i>
                                App settings updated successfully!
                            </div>
                            
                            <button type="submit" class="btn-primary">
                                Save Changes
                            </button>
                        </form>
                    </div>

                    <!-- Navigation Settings (New) -->
                    <div *ngIf="activeTab === 'navigation'" class="settings-panel">
                        <h2>Navigation Details</h2>
                        
                        <div class="nav-overview-card">
                            <div class="nav-header">
                                <div class="trip-status">
                                    <span class="status-dot"></span>
                                    Actual Trip Details
                                </div>
                                <div class="trip-timer">Est. Time: {{ illustrativeTime || '---' }}</div>
                            </div>
                            
                            <div class="route-info">
                                <div class="route-point">
                                    <div class="point-icon pickup"><i class="fa-solid fa-location-dot"></i></div>
                                    <div class="point-details">
                                        <label>Pickup Location</label>
                                        <strong>{{ illustrativePickup }}</strong>
                                    </div>
                                </div>
                                
                                <div class="route-connector"></div>
                                
                                <div class="route-point">
                                    <div class="point-icon dropoff"><i class="fa-solid fa-flag-checkered"></i></div>
                                    <div class="point-details">
                                        <label>Drop-off Location</label>
                                        <strong>{{ illustrativeDropoff || 'Not specified' }}</strong>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="nav-metrics">
                                <div class="metric">
                                    <div class="metric-val">
                                        <label>Distance</label>
                                        <strong>{{ illustrativeKm > 0 ? formatTripDistance(illustrativeKm) : '---' }}</strong>
                                    </div>
                                </div>
                                <div class="metric" *ngIf="illustrativePickup || illustrativeDropoff">
                                    <a [href]="getMapsUrl()" target="_blank" class="maps-link">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        Open in Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="map-container-wrapper" *ngIf="isMapVisible">
                            <div id="map" class="settings-map"></div>
                        </div>

                        <div class="section-divider"></div>

                        <h3>Trip Configuration</h3>
                        
                        <div class="test-locations-grid">
                            <div class="form-group">
                                <label>Trip Pickup</label>
                                <input type="text" [(ngModel)]="illustrativePickup" (ngModelChange)="calculateDistance()" [ngModelOptions]="{standalone: true}" placeholder="Enter pickup address">
                            </div>
                            <div class="form-group">
                                <label>Trip Drop-off</label>
                                <input type="text" [(ngModel)]="illustrativeDropoff" (ngModelChange)="calculateDistance()" [ngModelOptions]="{standalone: true}" placeholder="Enter drop-off address">
                            </div>
                            <div class="form-group">
                                <label>Direct Distance (km)</label>
                                <input type="number" [(ngModel)]="illustrativeKm" [ngModelOptions]="{standalone: true}" min="0" readonly>
                                <small>Auto-calculated based on locations</small>
                            </div>
                        </div>

                        <form [formGroup]="navSettingsForm" (ngSubmit)="saveNavSettings()">
                            <div class="form-group">
                                <label>Distance Unit</label>
                                <select formControlName="distanceUnit">
                                    <option value="km">Kilometers (km)</option>
                                    <option value="miles">Miles (mi)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Map Provider</label>
                                <select formControlName="mapProvider">
                                    <option value="leaflet">OpenSource (Leaflet)</option>
                                    <option value="google">Google Maps</option>
                                    <option value="none">Text Only</option>
                                </select>
                            </div>

                            <div class="success-message" *ngIf="navSuccess">
                                <i class="fa-solid fa-check-circle"></i>
                                Navigation settings updated!
                            </div>

                            <button type="submit" class="btn-primary">
                                Save Preferences
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `,
    styles: [`
    .settings-section {
        padding: 8rem 0 5rem;
        background: var(--bg-color);
        min-height: 100vh;
        transition: background 0.3s, color 0.3s;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .settings-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .settings-header h1 {
        color: var(--primary-color);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .settings-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
    }

    .settings-content {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 2rem;
        align-items: start;
    }

    .settings-sidebar {
        background: var(--card-bg);
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        position: sticky;
        top: 100px;
        border: 1px solid var(--border-color);
    }

    .tab-btn {
        width: 100%;
        padding: 1rem;
        background: transparent;
        border: none;
        text-align: left;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-muted);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 0.5rem;
    }

    .tab-btn:hover {
        background: var(--bg-color);
        color: var(--primary-color);
    }

    .tab-btn.active {
        background: var(--accent-color);
        color: white;
    }

    .map-container-wrapper {
        margin-top: 2rem;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #e0e0e0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .settings-map {
        height: 300px;
        width: 100%;
        background: #f0f0f0;
    }

    .tab-btn i {
        width: 20px;
    }

    .logout-btn {
        margin-top: 2rem;
        color: #dc3545;
        border-top: 1px solid #eee;
        padding-top: 1.5rem;
    }

    .logout-btn:hover {
        background: #fee;
    }

    .settings-main {
        background: var(--card-bg);
        padding: 2.5rem;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        border: 1px solid var(--border-color);
    }

    .settings-panel h2 {
        color: var(--primary-color);
        margin-bottom: 2rem;
        font-size: 1.8rem;
    }

    .settings-panel h3 {
        color: var(--text-color);
        margin: 2rem 0 1rem;
        font-size: 1.3rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
        font-size: 0.95rem;
    }

    input, select {
        width: 100%;
        padding: 0.9rem 1rem;
        border: 2px solid var(--border-color);
        background: var(--bg-color);
        color: var(--text-color);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s;
    }

    input:focus, select:focus {
        outline: none;
        border-color: var(--accent-color);
    }

    small {
        display: block;
        color: #999;
        font-size: 0.85rem;
        margin-top: 0.3rem;
    }

    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    .input-with-prefix,
    .input-with-suffix {
        display: flex;
        align-items: center;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
    }

    .input-with-prefix span,
    .input-with-suffix span {
        padding: 0.9rem 1rem;
        background: #f0f0f0;
        font-weight: 600;
        color: #666;
    }

    .input-with-prefix input,
    .input-with-suffix input {
        border: none;
        flex: 1;
    }

    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
        width: auto;
        cursor: pointer;
    }

    .section-divider {
        height: 1px;
        background: #e0e0e0;
        margin: 2.5rem 0;
    }

    .saved-addresses {
        margin-top: 1.5rem;
    }

    .address-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .address-info strong {
        display: block;
        color: var(--primary-color);
        margin-bottom: 0.3rem;
    }

    .address-info p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }

    .btn-delete {
        padding: 0.5rem 1rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .btn-delete:hover {
        background: #c82333;
    }

    .btn-add {
        width: 100%;
        padding: 1rem;
        background: #f0f0f0;
        border: 2px dashed #ccc;
        border-radius: 8px;
        color: #666;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.3s;
    }

    .btn-add:hover {
        background: #e0e0e0;
        border-color: var(--accent-color);
        color: var(--accent-color);
    }

    .add-address-form {
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .success-message {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
    }

    /* Navigation Panel Styles */
    .nav-overview-card {
        background: #1a4d4d;
        border-radius: 12px;
        padding: 1.5rem;
        color: white;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .trip-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .status-dot {
        width: 10px;
        height: 10px;
        background: #4ade80;
        border-radius: 50%;
        box-shadow: 0 0 10px #4ade80;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }

    .route-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .route-point {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .point-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    }

    .point-icon.pickup { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
    .point-icon.dropoff { background: rgba(74, 222, 128, 0.2); color: #4ade80; }

    .point-details label {
        display: block;
        color: rgba(255,255,255,0.6);
        font-size: 0.75rem;
        margin-bottom: 2px;
    }

    .point-details strong {
        font-size: 0.95rem;
    }

    .route-connector {
        width: 2px;
        height: 20px;
        background: rgba(255,255,255,0.2);
        margin-left: 17px;
    }

    .nav-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        background: rgba(255,255,255,0.05);
        padding: 1rem;
        border-radius: 8px;
    }

    .metric {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }

    .metric i {
        font-size: 1.2rem;
        color: var(--accent-color);
    }

    .metric-val label {
        color: rgba(255,255,255,0.6);
        font-size: 0.7rem;
        margin-bottom: 1px;
    }

    .metric-val strong {
        font-size: 1rem;
    }

    .btn-primary {
        padding: 1rem 2rem;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
        background: #e65a2f;
    }

    .btn-primary:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .maps-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-color);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        transition: opacity 0.3s;
    }

    .maps-link:hover {
        opacity: 0.8;
        text-decoration: underline;
    }

    .test-locations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--bg-color);
        border-radius: 12px;
        border: 1px dashed var(--border-color);
    }

    @media (max-width: 768px) {
        .settings-section {
            padding-top: 6rem;
            padding-bottom: 2rem;
        }

        .container {
            padding: 0 1rem;
        }

        .settings-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .settings-sidebar {
            position: static;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .tab-btn {
            margin-bottom: 0;
            padding: 0.8rem;
            font-size: 0.85rem;
            justify-content: center;
            flex-direction: column;
            gap: 0.4rem;
            text-align: center;
            height: 100%;
        }

        .tab-btn i {
            font-size: 1.2rem;
            width: auto;
        }

        .logout-btn {
            margin-top: 0;
            border-top: none;
            background: rgba(220, 53, 69, 0.05);
            color: #dc3545;
        }

        .settings-main {
            padding: 1.5rem;
        }

        .pricing-grid {
            grid-template-columns: 1fr;
        }

        .nav-metrics {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .maps-link {
            justify-content: center;
            padding-top: 0.8rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            width: 100%;
        }
    }
    `]
})
export class SettingsComponent implements OnInit {
    private _activeTab = 'profile';
    get activeTab() { return this._activeTab; }
    set activeTab(value: string) {
        this._activeTab = value;
        if (value === 'navigation') {
            setTimeout(() => this.initMap(), 100);
        }
    }
    isAdmin = false;
    currentUser: any = null;
    private map: any;
    private markers: any[] = [];
    private polyline: any;

    profileForm: FormGroup;
    businessForm: FormGroup;
    pricingForm: FormGroup;
    appForm: FormGroup;
    navSettingsForm: FormGroup;
    addressForm: FormGroup;

    savedAddresses: SavedAddress[] = [];
    showAddAddressForm = false;

    pricingSuccess = false;
    appSuccess = false;
    navSuccess = false;
    profileSuccess = false;
    businessSuccess = false;

    // Illustrative Trip Data
    illustrativePickup = '';
    illustrativeDropoff = '';
    illustrativeKm = 0;
    illustrativeTime = '';
    isMapVisible = true;

    // Realistic South African City Coordinates
    private readonly CITY_COORDS: { [key: string]: [number, number] } = {
        'johannesburg': [-26.2041, 28.0473],
        'pretoria': [-25.7479, 28.1878],
        'durban': [-29.8587, 31.0218],
        'cape town': [-33.9249, 18.4232],
        'port elizabeth': [-33.9608, 25.6022],
        'bloemfontein': [-29.1181, 26.2231],
        'sandton': [-26.1076, 28.0567],
        'midrand': [-25.9992, 28.1262],
        'centurion': [-25.8640, 28.1858],
        'east london': [-33.0292, 27.8546],
        'nelspruit': [-25.4753, 30.9694],
        'polokwane': [-23.8962, 29.4486]
    };

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private settingsService: SettingsService,
        private router: Router
    ) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required]
        });

        this.businessForm = this.fb.group({
            businessName: ['', Validators.required],
            businessPhone: ['', Validators.required],
            whatsappNumber: ['', Validators.required],
            businessEmail: ['', [Validators.required, Validators.email]]
        });

        this.pricingForm = this.fb.group({
            kidsRate: [100, [Validators.required, Validators.min(0)]],
            staffRate: [150, [Validators.required, Validators.min(0)]],
            luggageRate: [250, [Validators.required, Validators.min(0)]],
            carhireRate: [200, [Validators.required, Validators.min(0)]],
            ratePerKm: [12, [Validators.required, Validators.min(0)]],
            monthlyDiscount: [30, [Validators.required, Validators.min(0), Validators.max(100)]]
        });

        this.appForm = this.fb.group({
            theme: ['light'],
            language: ['en'],
            notifications: [true]
        });

        this.navSettingsForm = this.fb.group({
            distanceUnit: ['km'],
            mapProvider: ['leaflet']
        });

        this.addressForm = this.fb.group({
            label: ['', Validators.required],
            address: ['', Validators.required]
        });
    }

    ngOnInit() {
        // Check authentication
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        this.currentUser = this.authService.getCurrentUser();
        this.isAdmin = this.authService.isAdmin();

        // Load user data
        if (this.currentUser) {
            const user = this.authService.getUserById(this.currentUser.userId);
            if (user) {
                this.profileForm.patchValue({
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                });
                this.savedAddresses = user.preferences?.savedAddresses || [];
            }
        }

        // Load app settings
        const settings = this.settingsService.getSettings();
        this.businessForm.patchValue({
            businessName: settings.businessName,
            businessPhone: settings.businessPhone,
            whatsappNumber: settings.whatsappNumber,
            businessEmail: settings.businessEmail
        });

        this.pricingForm.patchValue({
            kidsRate: settings.baseRates.kids,
            staffRate: settings.baseRates.staff,
            luggageRate: settings.baseRates.luggage,
            carhireRate: settings.baseRates.carhire,
            ratePerKm: settings.ratePerKm,
            monthlyDiscount: settings.monthlyDiscount * 100
        });

        this.appForm.patchValue({
            theme: settings.theme,
            language: settings.language,
            notifications: settings.notifications
        });

        this.navSettingsForm.patchValue({
            mapProvider: settings.mapProvider
        });

        // Initialize with demo data if empty
        if (!this.illustrativePickup) {
            this.illustrativePickup = 'Sandton City';
            this.illustrativeDropoff = 'O.R. Tambo International Airport';
            this.calculateDistance();
        }
    }

    saveProfile() {
        if (this.profileForm.invalid || !this.currentUser) return;

        const updates = this.profileForm.value;
        this.authService.updateUser(this.currentUser.userId, updates);

        this.profileSuccess = true;
        setTimeout(() => this.profileSuccess = false, 3000);
    }

    saveBusinessSettings() {
        if (this.businessForm.invalid) return;

        const values = this.businessForm.value;
        this.settingsService.updateSettings({
            businessName: values.businessName,
            businessPhone: values.businessPhone,
            whatsappNumber: values.whatsappNumber,
            businessEmail: values.businessEmail
        });

        this.businessSuccess = true;
        setTimeout(() => this.businessSuccess = false, 3000);
    }

    savePricingSettings() {
        if (this.pricingForm.invalid) return;

        const values = this.pricingForm.value;
        this.settingsService.updateSettings({
            baseRates: {
                kids: values.kidsRate,
                staff: values.staffRate,
                luggage: values.luggageRate,
                carhire: values.carhireRate
            },
            ratePerKm: values.ratePerKm,
            monthlyDiscount: values.monthlyDiscount / 100
        });

        this.pricingSuccess = true;
        setTimeout(() => this.pricingSuccess = false, 3000);
    }

    saveAppSettings() {
        const values = this.appForm.value;
        this.settingsService.updateSettings(values);

        this.appSuccess = true;
        setTimeout(() => this.appSuccess = false, 3000);
    }

    saveNavSettings() {
        const values = this.navSettingsForm.value;
        this.settingsService.updateSettings(values);

        this.isMapVisible = values.mapProvider !== 'none';
        if (this.isMapVisible) {
            setTimeout(() => this.initMap(), 100);
        }

        this.navSuccess = true;
        setTimeout(() => this.navSuccess = false, 3000);
    }

    formatTripDistance(km: number): string {
        return this.settingsService.formatDistance(km);
    }

    private getCoordinates(query: string): [number, number] {
        const normalized = query.toLowerCase().trim();

        // Exact match in dictionary
        if (this.CITY_COORDS[normalized]) {
            return this.CITY_COORDS[normalized];
        }

        // Partial match
        for (const city in this.CITY_COORDS) {
            if (normalized.includes(city)) {
                return this.CITY_COORDS[city];
            }
        }

        // Fallback: Deterministic shift from a base point
        const getShift = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return (hash % 100) / 500;
        };

        const baseLat = -25.9278;
        const baseLng = 28.1223;
        return [
            baseLat + getShift(query),
            baseLng + getShift(query.split('').reverse().join(''))
        ];
    }

    private calculateHaversineDistance(coords1: [number, number], coords2: [number, number]): number {
        const R = 6371; // Earth's radius in km
        const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
        const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    calculateDistance() {
        if (this.illustrativePickup && this.illustrativeDropoff) {
            const pickupCoords = this.getCoordinates(this.illustrativePickup);
            const dropoffCoords = this.getCoordinates(this.illustrativeDropoff);

            let km = this.calculateHaversineDistance(pickupCoords, dropoffCoords);

            // Realism: Road distance is usually 25% - 40% more than straight line
            const roadFactor = km > 100 ? 1.25 : 1.35;
            this.illustrativeKm = parseFloat((km * roadFactor).toFixed(1));

            // Refined Time Logic: Standard highway speeds for long distance
            // Johannesburg to Durban is ~625km (road dist), target ~6 hours
            let avgSpeed = 60; // km/h for local
            if (this.illustrativeKm > 400) avgSpeed = 112; // Optimized for 6h @ 625km
            else if (this.illustrativeKm > 100) avgSpeed = 90;
            else if (this.illustrativeKm > 20) avgSpeed = 75;

            const travelHours = this.illustrativeKm / avgSpeed;
            const baseMinutes = travelHours * 60;

            // Add padding for traffic and stops
            let trafficPadding = 10;
            if (this.illustrativeKm > 400) trafficPadding = 25;
            else if (this.illustrativeKm > 100) trafficPadding = 20;

            const totalMinutes = Math.round(baseMinutes + trafficPadding);

            if (totalMinutes > 60) {
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                this.illustrativeTime = `${hours}h ${mins}m`;
            } else {
                this.illustrativeTime = `${totalMinutes} mins`;
            }

            if (this.isMapVisible && this.map) {
                this.updateMapMarkers();
            }
        } else {
            this.illustrativeKm = 0;
            this.illustrativeTime = '';
        }
    }

    private updateMapMarkers() {
        if (!this.map || !this.illustrativePickup || !this.illustrativeDropoff) return;

        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Clear existing polyline
        if (this.polyline) {
            this.map.removeLayer(this.polyline);
        }

        const pickup: [number, number] = this.getCoordinates(this.illustrativePickup);
        const dropoff: [number, number] = this.getCoordinates(this.illustrativeDropoff);

        const pickupMarker = L.marker(pickup).addTo(this.map)
            .bindPopup(`<b>Pickup:</b> ${this.illustrativePickup}`);

        const dropoffMarker = L.marker(dropoff).addTo(this.map)
            .bindPopup(`<b>Drop-off:</b> ${this.illustrativeDropoff}`);

        this.markers.push(pickupMarker, dropoffMarker);

        this.polyline = L.polyline([pickup, dropoff], {
            color: '#ff6b35',
            weight: 3,
            opacity: 1
        }).addTo(this.map);

        this.map.fitBounds(this.polyline.getBounds(), { padding: [50, 50] });
    }

    private initMap() {
        // Check for map container first
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.log('Map container not found, skipping init');
            return;
        }

        // Cleanup existing map if necessary
        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        this.map = L.map('map').setView([-25.9278, 28.1223], 10);

        // Fix marker icon issue with Webpack/Angular
        const defaultIcon = L.icon({
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = defaultIcon;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Fix for tiles not loading in tabbed interface
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);

        // If we already have illustrative locations, show them immediately
        if (this.illustrativePickup && this.illustrativeDropoff) {
            this.updateMapMarkers();
        }
    }

    addAddress() {
        if (this.addressForm.invalid || !this.currentUser) return;

        const newAddress: SavedAddress = {
            id: Date.now().toString(),
            label: this.addressForm.value.label,
            address: this.addressForm.value.address
        };

        this.savedAddresses.push(newAddress);

        const user = this.authService.getUserById(this.currentUser.userId);
        if (user) {
            this.authService.updateUser(this.currentUser.userId, {
                preferences: {
                    ...user.preferences,
                    savedAddresses: this.savedAddresses
                }
            });
        }

        this.addressForm.reset();
        this.showAddAddressForm = false;
    }

    deleteAddress(id: string) {
        if (!this.currentUser) return;

        this.savedAddresses = this.savedAddresses.filter(a => a.id !== id);

        const user = this.authService.getUserById(this.currentUser.userId);
        if (user) {
            this.authService.updateUser(this.currentUser.userId, {
                preferences: {
                    ...user.preferences,
                    savedAddresses: this.savedAddresses
                }
            });
        }
    }

    getMapsUrl(): string {
        const origin = encodeURIComponent(this.illustrativePickup || '');
        const destination = encodeURIComponent(this.illustrativeDropoff || '');

        if (origin && destination) {
            return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
        } else if (origin) {
            return `https://www.google.com/maps/search/?api=1&query=${origin}`;
        } else if (destination) {
            return `https://www.google.com/maps/search/?api=1&query=${destination}`;
        }
        return 'https://www.google.com/maps';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
