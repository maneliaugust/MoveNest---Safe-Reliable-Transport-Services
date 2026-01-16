import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'mn-services',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './services.component.html',
    styles: [`
    .services-preview {
        padding: 8rem 0 5rem;
        text-align: center;
        background: white;
    }
    .section-subtitle {
        margin-bottom: 3rem;
        color: #666;
        font-size: 1.1rem;
    }
    .service-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2.5rem;
        margin-top: 1rem;
    }
    .service-card {
        background: #f9f9f9;
        border: 1px solid #eee;
        padding: 2.5rem;
        border-radius: 15px;
        transition: all 0.3s;
        text-align: left;
        display: flex;
        flex-direction: column;
    }
    .service-card:hover {
        border-color: var(--primary-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        transform: translateY(-5px);
    }
    .service-card h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        text-align: center;
    }
    .service-card p {
        margin-bottom: 1rem;
        color: #555;
        font-size: 0.95rem;
    }
    .service-card ul {
        list-style: none;
        padding: 0;
        margin-bottom: 2rem;
        flex-grow: 1;
    }
    .service-card li {
        margin-bottom: 0.5rem;
        padding-left: 1.5rem;
        position: relative;
        font-size: 0.9rem;
        color: #666;
    }
    .service-card li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--accent-color);
        font-weight: bold;
    }
    .btn {
        display: block;
        width: 100%;
        padding: 0.8rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        transition: background 0.3s;
        background: var(--primary-color);
        color: white;
        text-align: center;
    }
    .btn:hover {
        background: #0b3d4f;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }
  `]
})
export class ServicesComponent { }
