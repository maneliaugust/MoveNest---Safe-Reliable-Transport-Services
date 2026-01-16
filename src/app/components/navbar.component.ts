import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'mn-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">MoveNest</div>

            <ul class="nav-menu">
                <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
                <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
                <li><a routerLink="/fleet" routerLinkActive="active">Fleet</a></li>
                <li><a routerLink="/booking" routerLinkActive="active">Book Now</a></li>
                <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
            </ul>
        </div>
    </nav>
  `,
  styles: [`
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
  `]
})
export class NavbarComponent {}
