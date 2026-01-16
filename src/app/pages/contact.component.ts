import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'mn-contact',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './contact.component.html',
    styles: [`
    .contact {
        padding: 8rem 0 5rem;
        background: #f9f9f9;
    }
    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        margin-top: 3rem;
    }
    .contact-info {
        padding: 2rem;
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    .contact-info h3 {
        margin-bottom: 1.5rem;
        color: var(--primary-color);
    }
    .contact-info p {
        margin-bottom: 1rem;
        color: #666;
    }
    .social-links {
        margin-top: 2rem;
        display: flex;
        gap: 1.5rem;
    }
    .social-link {
        text-decoration: none;
        color: var(--primary-color);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s;
    }
    .social-link i {
        font-size: 1.25rem;
    }
    .social-link:hover {
        color: var(--accent-color);
    }
    .contact-form {
        background: white;
        padding: 2.5rem;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    .form-group {
        margin-bottom: 1.5rem;
    }
    input, textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
    }
    .btn {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
    .success-msg {
        margin-top: 1rem;
        color: #28a745;
        font-weight: bold;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }
    @media (max-width: 768px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
    }
  `]
})
export class ContactComponent {
    contactData = {
        name: '',
        email: '',
        message: ''
    };
    submitted = false;

    onSubmit(event: Event) {
        event.preventDefault();
        console.log('Contact Data:', this.contactData);
        this.submitted = true;
    }
}
