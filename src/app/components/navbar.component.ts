import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'mn-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgClass],
    template: `
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">MoveNest</div>

            <!-- Desktop Menu -->
            <ul class="nav-menu desktop-menu">
                <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
                <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
                <li><a routerLink="/fleet" routerLinkActive="active">Fleet</a></li>
                <li><a routerLink="/booking" routerLinkActive="active">Book Now</a></li>
                <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
            </ul>

            <!-- Mobile Toggle -->
            <button class="mobile-toggle" (click)="toggleMenu()">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
        </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-overlay" [ngClass]="{'open': isOpen}" (click)="closeMenu()">
        <!-- Mobile Menu Card -->
        <div class="mobile-menu-card" (click)="$event.stopPropagation()">
            <div class="menu-header">
                <span class="menu-title">Menu</span>
                <button class="close-btn" (click)="closeMenu()">&times;</button>
            </div>
            
            <ul class="mobile-nav-links">
                <li><a routerLink="/" (click)="closeMenu()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">HOME</a></li>
                <li><a routerLink="/services" (click)="closeMenu()" routerLinkActive="active">SERVICES</a></li>
                <li><a routerLink="/fleet" (click)="closeMenu()" routerLinkActive="active">FLEET</a></li>
                <li><a routerLink="/booking" (click)="closeMenu()" routerLinkActive="active">BOOK NOW</a></li>
                <li><a routerLink="/contact" (click)="closeMenu()" routerLinkActive="active">CONTACT</a></li>
            </ul>
        </div>
    </div>
  `,
    styles: [`
    :host {
        display: block;
    }
    .navbar {
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1rem 0;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 1000;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
    }
    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
    }
    
    /* Desktop Menu */
    .nav-menu {
        display: flex;
        list-style: none;
        gap: 2rem;
    }
    .nav-menu a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        transition: color 0.3s;
    }
    .nav-menu a.active, .nav-menu a:hover {
        color: var(--accent-color);
    }

    /* Mobile Toggle */
    .mobile-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        flex-direction: column;
        gap: 5px;
        z-index: 1001;
    }
    .bar {
        width: 25px;
        height: 3px;
        background-color: var(--primary-color);
        transition: 0.3s;
    }

    /* Mobile Overlay & Menu */
    .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(3px);
    }
    .mobile-overlay.open {
        opacity: 1;
        visibility: visible;
    }

    .mobile-menu-card {
        background: var(--primary-color);
        width: 85%;
        max-width: 350px;
        border-radius: 20px;
        padding: 2rem;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    .mobile-overlay.open .mobile-menu-card {
        transform: translateY(0) scale(1);
        opacity: 1;
    }

    .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 1rem;
    }
    .menu-title {
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        text-transform: capitalize;
    }
    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
    }

    .mobile-nav-links {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .mobile-nav-links a {
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        display: block;
        transition: color 0.3s, padding-left 0.3s;
        letter-spacing: 1px;
    }
    .mobile-nav-links a:hover, .mobile-nav-links a.active {
        color: var(--accent-color);
        padding-left: 10px;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .desktop-menu {
            display: none;
        }
        .mobile-toggle {
            display: flex;
        }
    }
  `]
})
export class NavbarComponent {
    isOpen = false;

    toggleMenu() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}
