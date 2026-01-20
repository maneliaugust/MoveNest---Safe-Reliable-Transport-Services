import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'mn-fleet',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './fleet.component.html',
    styles: [`
    .fleet {
        padding: 8rem 0 5rem;
        background: #f9f9f9;
        text-align: center;
    }
    .fleet-showcase {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        margin-top: 3rem;
        background: white;
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        align-items: center;
        text-align: left;
    }
    .fleet-image img {
        width: 100%;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .fleet-content h3 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }
    .fleet-content p {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 2rem;
    }
    .fleet-specs {
        margin-bottom: 2.5rem;
    }
    .spec-item {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
    }
    .spec-label {
        font-weight: bold;
        color: var(--primary-color);
        margin-right: 1rem;
    }
    .btn-primary {
        background: var(--accent-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        display: inline-block;
        font-weight: bold;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    @media (max-width: 768px) {
        .fleet-showcase {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
        }
        .fleet-image {
            margin-bottom: 1rem;
        }
    }
  `]
})
export class FleetComponent { }
