import { Component } from '@angular/core';

@Component({
    selector: 'mn-footer',
    standalone: true,
    template: `
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 MoveNest. All rights reserved.</p>
            <p>Johannesburg, South Africa</p>
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
  `]
})
export class FooterComponent { }
