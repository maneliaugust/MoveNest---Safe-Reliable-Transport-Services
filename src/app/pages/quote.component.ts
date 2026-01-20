import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'mn-quote',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <section class="quote-section">
      <div class="container">
        <div class="quote-header">
          <h1>Get an Instant Quote</h1>
          <p>Calculate your transport costs and get a personalized quote</p>
        </div>

        <div class="quote-content">
          <!-- Quote Form -->
          <div class="quote-form-card">
            <form [formGroup]="quoteForm">
              <div class="form-group">
                <label>Service Type</label>
                <select formControlName="service" (change)="calculateQuote()">
                  <option value="">Select a service</option>
                  <option value="kids">Kids Transport</option>
                  <option value="staff">Staff Transport</option>
                  <option value="elderly">Luggage Transport</option>
                  <option value="events">Car Hire</option>
                </select>
              </div>

              <div class="form-group">
                <label>Pickup Location</label>
                <input type="text" formControlName="pickup" placeholder="Enter pickup address" (input)="calculateQuote()">
              </div>

              <div class="form-group">
                <label>Dropoff Location</label>
                <input type="text" formControlName="dropoff" placeholder="Enter dropoff address" (input)="calculateQuote()">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Number of Passengers</label>
                  <input type="number" formControlName="passengers" min="1" max="7" (input)="calculateQuote()">
                </div>
                <div class="form-group">
                  <label>Distance (km)</label>
                  <input type="number" formControlName="distance" min="1" placeholder="Estimated" (input)="calculateQuote()">
                </div>
              </div>

              <!-- Monthly Contract Option -->
              <div class="contract-section">
                <div class="checkbox-group">
                  <input type="checkbox" id="monthlyContract" formControlName="isMonthlyContract" (change)="calculateQuote()">
                  <label for="monthlyContract">
                    <strong>Monthly Contract</strong>
                    <span class="contract-info">For schools & companies - Get up to 30% discount</span>
                  </label>
                </div>

                <div *ngIf="quoteForm.get('isMonthlyContract')?.value" class="contract-details fade-in">
                  <div class="form-group">
                    <label>Organization Name</label>
                    <input type="text" formControlName="organizationName" placeholder="School or Company name">
                  </div>
                  <div class="form-group">
                    <label>Contract Duration</label>
                    <select formControlName="contractDuration">
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Trips per Week</label>
                    <input type="number" formControlName="tripsPerWeek" min="1" max="50" placeholder="e.g., 10">
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Quote Result -->
          <div class="quote-result-card">
            <div class="result-header">
              <i class="fa-solid fa-calculator"></i>
              <h3>Your Estimated Quote</h3>
            </div>

            <div *ngIf="!estimatedPrice" class="no-quote">
              <i class="fa-regular fa-lightbulb"></i>
              <p>Fill in the details to see your estimated price</p>
            </div>

            <div *ngIf="estimatedPrice" class="price-breakdown fade-in">
              <div class="price-item">
                <span>Base Fare</span>
                <span>R {{ baseFare }}</span>
              </div>
              <div class="price-item">
                <span>Distance ({{ quoteForm.get('distance')?.value || 0 }} km)</span>
                <span>R {{ distanceFare }}</span>
              </div>
              <div class="price-item" *ngIf="quoteForm.get('isMonthlyContract')?.value">
                <span>Monthly Discount (30%)</span>
                <span class="discount">- R {{ discount }}</span>
              </div>
              <div class="price-total">
                <span>Estimated Total</span>
                <span class="total-amount">R {{ estimatedPrice }}</span>
              </div>
              <div *ngIf="quoteForm.get('isMonthlyContract')?.value" class="monthly-info">
                <small>Monthly total ({{ quoteForm.get('tripsPerWeek')?.value || 0 }} trips/week): 
                  <strong>R {{ monthlyTotal }}</strong>
                </small>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="quote-actions" *ngIf="estimatedPrice">
              <button class="btn-whatsapp" (click)="sendWhatsAppQuote()">
                <i class="fa-brands fa-whatsapp"></i>
                Get Quote on WhatsApp
              </button>
              <button class="btn-book" (click)="bookNow()">
                <i class="fa-solid fa-calendar-check"></i>
                Book Now
              </button>
            </div>

            <div class="quote-note">
              <i class="fa-solid fa-info-circle"></i>
              <p>Prices are estimates. Final cost may vary based on actual distance, traffic, and additional requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .quote-section {
      padding: 8rem 0 5rem;
      background: linear-gradient(135deg, #f4f6f8 0%, #e8ecf0 100%);
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .quote-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .quote-header h1 {
      color: var(--primary-color);
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .quote-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .quote-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .quote-form-card, .quote-result-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input, select {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border 0.3s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--accent-color);
    }

    .contract-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px dashed #eee;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-start;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
      margin-top: 0.3rem;
      cursor: pointer;
    }

    .checkbox-group label {
      margin: 0;
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
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      margin-top: 1rem;
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;
    }

    .result-header i {
      font-size: 1.8rem;
      color: var(--accent-color);
    }

    .result-header h3 {
      margin: 0;
      color: #333;
    }

    .no-quote {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
    }

    .no-quote i {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .price-breakdown {
      margin-bottom: 2rem;
    }

    .price-item {
      display: flex;
      justify-content: space-between;
      padding: 0.8rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .price-item .discount {
      color: #28a745;
      font-weight: 600;
    }

    .price-total {
      display: flex;
      justify-content: space-between;
      padding: 1.2rem 0;
      margin-top: 1rem;
      border-top: 2px solid #333;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .total-amount {
      color: var(--accent-color);
      font-size: 1.5rem;
    }

    .monthly-info {
      background: #e3f2fd;
      padding: 0.8rem;
      border-radius: 8px;
      text-align: center;
      margin-top: 1rem;
      color: #0d47a1;
    }

    .quote-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .btn-whatsapp, .btn-book {
      padding: 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-whatsapp {
      background: #25D366;
      color: white;
    }

    .btn-whatsapp:hover {
      background: #1fb855;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
    }

    .btn-book {
      background: var(--primary-color);
      color: white;
    }

    .btn-book:hover {
      background: #1a4d4d;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(34, 102, 102, 0.3);
    }

    .quote-note {
      display: flex;
      gap: 0.8rem;
      padding: 1rem;
      background: #fff3cd;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #856404;
    }

    .quote-note i {
      margin-top: 0.2rem;
    }

    .fade-in {
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .quote-content {
        grid-template-columns: 1fr;
      }

      .quote-header h1 {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuoteComponent {
    quoteForm: FormGroup;
    estimatedPrice: number = 0;
    baseFare: number = 0;
    distanceFare: number = 0;
    discount: number = 0;
    monthlyTotal: number = 0;

    // Pricing constants
    private readonly BASE_RATES = {
        kids: 100,
        staff: 150,
        elderly: 250,  // Luggage Transport
        events: 200    // Car Hire
    };
    private readonly RATE_PER_KM = 13;
    private readonly MONTHLY_DISCOUNT = 0.20; // 20% discount

    constructor(private fb: FormBuilder, private router: Router) {
        this.quoteForm = this.fb.group({
            service: ['', Validators.required],
            pickup: ['', Validators.required],
            dropoff: ['', Validators.required],
            passengers: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
            distance: ['', [Validators.required, Validators.min(1)]],
            isMonthlyContract: [false],
            organizationName: [''],
            contractDuration: ['6'],
            tripsPerWeek: ['']
        });
    }

    bookNow() {
        const service = this.quoteForm.get('service')?.value;
        const pickup = this.quoteForm.get('pickup')?.value;
        const dropoff = this.quoteForm.get('dropoff')?.value;
        const isMonthlyContract = this.quoteForm.get('isMonthlyContract')?.value;
        const organizationName = this.quoteForm.get('organizationName')?.value;

        // Navigate to booking page with query parameters
        this.router.navigate(['/booking'], {
            queryParams: {
                service: service,
                pickup: pickup,
                dropoff: dropoff,
                isMonthlyContract: isMonthlyContract,
                organizationName: organizationName
            }
        });
    }

    calculateQuote() {
        const service = this.quoteForm.get('service')?.value;
        const distance = this.quoteForm.get('distance')?.value;
        const isMonthly = this.quoteForm.get('isMonthlyContract')?.value;

        if (!service || !distance) {
            this.estimatedPrice = 0;
            return;
        }

        // Calculate base fare
        this.baseFare = this.BASE_RATES[service as keyof typeof this.BASE_RATES] || 100;

        // Calculate distance fare
        this.distanceFare = distance * this.RATE_PER_KM;

        // Calculate total before discount
        let total = this.baseFare + this.distanceFare;

        // Apply monthly discount if applicable
        if (isMonthly) {
            this.discount = Math.round(total * this.MONTHLY_DISCOUNT);
            total = total - this.discount;

            // Calculate monthly total
            const tripsPerWeek = this.quoteForm.get('tripsPerWeek')?.value || 0;
            this.monthlyTotal = Math.round(total * tripsPerWeek * 4); // 4 weeks per month
        } else {
            this.discount = 0;
            this.monthlyTotal = 0;
        }

        this.estimatedPrice = Math.round(total);
    }

    sendWhatsAppQuote() {
        const service = this.quoteForm.get('service')?.value;
        const pickup = this.quoteForm.get('pickup')?.value;
        const dropoff = this.quoteForm.get('dropoff')?.value;
        const distance = this.quoteForm.get('distance')?.value;
        const isMonthly = this.quoteForm.get('isMonthlyContract')?.value;
        const orgName = this.quoteForm.get('organizationName')?.value;

        let message = `Hi MoveNest! I'd like to get a quote for:\n\n`;
        message += `Service: ${service}\n`;
        message += `Pickup: ${pickup}\n`;
        message += `Dropoff: ${dropoff}\n`;
        message += `Distance: ${distance} km\n`;
        message += `Estimated Price: R ${this.estimatedPrice}\n`;

        if (isMonthly) {
            message += `\nMonthly Contract for: ${orgName}\n`;
            message += `Monthly Total: R ${this.monthlyTotal}\n`;
        }

        message += `\nPlease confirm availability and final pricing.`;

        // WhatsApp business number
        const phoneNumber = '27781918983'; // Format: country code + number (no + or spaces)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }
}
