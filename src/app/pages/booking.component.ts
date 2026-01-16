import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'mn-booking',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './booking.component.html',
    styles: [`
    .booking {
        padding: 8rem 0 5rem;
        background: white;
    }
    .booking-container {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 4rem;
        margin-top: 3rem;
    }
    .booking-form {
        background: #f9f9f9;
        padding: 3rem;
        border-radius: 15px;
    }
    .form-group {
        margin-bottom: 1.5rem;
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    input, select {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
    }
    .btn {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 8px;
        background: var(--accent-color);
        color: white;
        font-weight: bold;
        cursor: pointer;
        font-size: 1.1rem;
    }
    .booking-info {
        padding: 2.5rem;
        background: var(--primary-color);
        color: white;
        border-radius: 15px;
        align-self: flex-start;
    }
    .booking-info h3 {
        margin-bottom: 1.5rem;
        color: white;
    }
    .booking-info ul {
        list-style: none;
        padding: 0;
    }
    .booking-info li {
        margin-bottom: 1rem;
        font-weight: 500;
        color: white;
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
        .booking-container {
            grid-template-columns: 1fr;
        }
        .form-row {
            grid-template-columns: 1fr;
        }
    }
  `]
})
export class BookingComponent implements OnInit {
    bookingData = {
        service: 'kids_transport',
        pickup: '',
        dropoff: '',
        date: '',
        time: ''
    };
    submitted = false;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['service']) {
                this.bookingData.service = params['service'];
            }
        });
    }

    onSubmit(event: Event) {
        event.preventDefault();
        console.log('Booking Data:', this.bookingData);
        this.submitted = true;
    }
}
