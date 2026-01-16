import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'mn-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styles: [`
    .hero {
        background: linear-gradient(rgba(14, 77, 100, 0.8), rgba(14, 77, 100, 0.8)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80') center/cover;
        height: 80vh;
        display: flex;
        align-items: center;
        color: white;
        text-align: center;
        padding-top: 80px;
    }
    .hero-content h1 {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        color: white;
    }
    .hero-content h1 span {
        color: var(--accent-color);
    }
    .hero-content p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }
    .btn {
        display: inline-block;
        padding: 1rem 2.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        transition: transform 0.3s;
        margin: 0.5rem;
    }
    .btn:hover {
        transform: translateY(-3px);
    }
    .btn-primary {
        background: var(--accent-color);
        color: white;
    }
    .btn-secondary {
        border: 2px solid white;
        color: white;
    }
    .features {
        padding: 5rem 0;
        background: white;
        text-align: center;
    }
    .features h2 {
        margin-bottom: 3rem;
        color: var(--primary-color);
    }
    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }
    .benefit-card {
        background: #f9f9f9;
        padding: 2.5rem;
        border-radius: 15px;
        border: 1px solid #eee;
        transition: all 0.3s;
        text-align: left;
    }
    .benefit-card:hover {
        transform: translateY(-10px);
        border-color: var(--accent-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .benefit-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
    }
    .benefit-card h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    .benefit-card p {
        color: #666;
        line-height: 1.5;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }
  `]
})
export class HomeComponent { }
