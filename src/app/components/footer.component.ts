import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'mn-footer',
    standalone: true,
    imports: [RouterLink],
    template: `
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 MoveNest. All rights reserved.</p>
            <p>Johannesburg, South Africa</p>
            <p><a routerLink="/admin" class="admin-link">Admin Login</a></p>
        </div>
    </footer>
  `,
    styles: [`
    .footer {
        background: #333;
        color: white;
        padding: 3rem 0;
        text-align: center;
        margin-top: auto;
    }
    .footer p {
        margin: 0.5rem 0;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }
    .admin-link {
        color: rgba(255,255,255,0.3);
        text-decoration: none;
        font-size: 0.8rem;
    }
    .admin-link:hover {
        color: white;
    }
  `]
})
export class FooterComponent { }
