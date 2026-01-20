import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'mn-booking',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterLink],
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
    .contract-option {
        padding: 1.5rem;
        background: #f0f8ff;
        border-radius: 10px;
        border: 2px dashed #4a90e2;
    }
    .checkbox-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 0.8rem;
    }
    .checkbox-wrapper input[type="checkbox"] {
        width: auto;
        margin-top: 0.3rem;
        cursor: pointer;
    }
    .checkbox-wrapper label {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    .contract-info {
        font-size: 0.85rem;
        color: #28a745;
        font-weight: normal;
    }
    .contract-details {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #ddd;
    }
    .quote-link {
        text-align: center;
        margin: 1.5rem 0;
        padding: 1rem;
        background: #fff3cd;
        border-radius: 8px;
    }
    .quote-link a {
        color: var(--accent-color);
        font-weight: 600;
        text-decoration: none;
    }
    .quote-link a:hover {
        text-decoration: underline;
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
        service: '',
        pickup: '',
        dropoff: '',
        date: '',
        time: '',
        isMonthlyContract: false,
        organizationName: ''
    };
    submitted = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            // Pre-fill service if coming from quote or services page
            if (params['service']) {
                this.bookingData.service = params['service'];
            }

            // Pre-fill pickup location from quote
            if (params['pickup']) {
                this.bookingData.pickup = params['pickup'];
            }

            // Pre-fill dropoff location from quote
            if (params['dropoff']) {
                this.bookingData.dropoff = params['dropoff'];
            }

            // Pre-fill monthly contract checkbox from quote
            if (params['isMonthlyContract']) {
                this.bookingData.isMonthlyContract = params['isMonthlyContract'] === 'true';
            }

            // Pre-fill organization name from quote
            if (params['organizationName']) {
                this.bookingData.organizationName = params['organizationName'];
            }
        });
    }

    onSubmit(event: Event) {
        event.preventDefault();

        const newBooking = this.bookingService.addBooking(this.bookingData);

        console.log('Booking Submitted:', this.bookingData);
        this.submitted = true;

        // Redirect to payment
        setTimeout(() => {
            this.router.navigate(['/payment', newBooking.id]);
        }, 1500);
    }
}
