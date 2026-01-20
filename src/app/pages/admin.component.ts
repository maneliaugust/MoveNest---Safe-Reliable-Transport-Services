import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../services/booking.service';
import { MessageService, Message } from '../services/message.service';

@Component({
  selector: 'mn-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="admin-dashboard">
      <div class="container">
        <div class="header">
            <h2>Admin Dashboard</h2>
            <div class="stats">
                <span>Bookings: {{bookings.length}}</span>
                <span>Messages: {{messages.length}}</span>
            </div>
        </div>

        <div class="tabs">
            <button class="tab-btn" [class.active]="activeTab === 'bookings'" (click)="activeTab = 'bookings'">Bookings</button>
            <button class="tab-btn" [class.active]="activeTab === 'messages'" (click)="activeTab = 'messages'">Messages</button>
        </div>
        
        <!-- Bookings Tab -->
        <div *ngIf="activeTab === 'bookings'">
            <div class="table-responsive" *ngIf="bookings.length > 0; else noBookings">
            <table class="booking-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Payment</th>
                    <th>Pick Up</th>
                    <th>Drop Off</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let booking of bookings">
                    <td>{{booking.date | date}}</td>
                    <td>{{booking.time}}</td>
                    <td>{{formatService(booking.service)}}</td>
                    <td>
                        <div class="payment-info">
                            <span class="payment-method" *ngIf="booking.paymentMethod">
                                {{booking.paymentMethod | titlecase}}
                            </span>
                            <span class="payment-status" [ngClass]="booking.paymentStatus || 'unpaid'">
                                {{booking.paymentStatus || 'Unpaid' | titlecase}}
                            </span>
                        </div>
                    </td>
                    <td>{{booking.pickup}}</td>
                    <td>{{booking.dropoff}}</td>
                    <td>
                    <span class="status-badge" [ngClass]="booking.status">{{booking.status}}</span>
                    </td>
                    <td>
                    <button class="btn-action btn-delete" (click)="deleteBooking(booking.id)">Delete</button>
                    <button *ngIf="booking.status === 'pending'" class="btn-action btn-confirm" (click)="updateStatus(booking.id, 'confirmed')">Accept</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>

            <ng-template #noBookings>
                <div class="empty-state">
                    <p>No bookings received yet.</p>
                </div>
            </ng-template>
        </div>

        <!-- Messages Tab -->
        <div *ngIf="activeTab === 'messages'">
            <div class="messages-grid" *ngIf="messages.length > 0; else noMessages">
                <div class="message-card" *ngFor="let msg of messages" [class.unread]="!msg.read">
                    <div class="msg-header">
                        <span class="msg-name">{{msg.name}}</span>
                        <span class="msg-date">{{msg.timestamp | date:'medium'}}</span>
                    </div>
                    <div class="msg-email">{{msg.email}}</div>
                    <div class="msg-body">{{msg.message}}</div>
                    <div class="msg-actions">
                        <button class="btn-action btn-delete" (click)="deleteMessage(msg.id)">Delete</button>
                    </div>
                </div>
            </div>

            <ng-template #noMessages>
                <div class="empty-state">
                    <p>No messages received yet.</p>
                </div>
            </ng-template>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .admin-dashboard {
      padding: 8rem 0 5rem;
      background: #f4f6f8;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .stats span {
        margin-left: 1.5rem;
        font-weight: 500;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    /* Tabs */
    .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    .tab-btn {
        padding: 0.8rem 2rem;
        border: none;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        color: #666;
        transition: all 0.3s;
    }
    .tab-btn.active {
        background: var(--primary-color);
        color: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    /* Table */
    .booking-table {
      width: 100%;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border-collapse: collapse;
      overflow: hidden;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: var(--primary-color);
      color: white;
      font-weight: 500;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      text-transform: capitalize;
    }
    .status-badge.pending { background: #fff3cd; color: #856404; }
    .status-badge.confirmed { background: #d4edda; color: #155724; }
    .btn-action {
      border: none;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      font-size: 0.85rem;
    }
    .btn-delete { background: #ffdede; color: #c00; }
    .btn-confirm { background: #e2e6ea; color: #333; }
    
    .payment-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 0.85rem;
    }
    .payment-method {
        font-weight: 500;
        color: #555;
    }
    .payment-status {
        display: inline-block;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        font-size: 0.75rem;
        width: fit-content;
    }
    .payment-status.paid { background: #d4edda; color: #155724; }
    .payment-status.pending { background: #fff3cd; color: #856404; }
    .payment-status.unpaid { background: #f8d7da; color: #721c24; }

    .empty-state {
        text-align: center;
        padding: 4rem;
        background: white;
        border-radius: 10px;
        color: #666;
    }

    /* Message Cards */
    .messages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    .message-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .msg-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    .msg-name {
        font-weight: bold;
        color: var(--primary-color);
    }
    .msg-date {
        font-size: 0.85rem;
        color: #999;
    }
    .msg-email {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
    }
    .msg-body {
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }
    .msg-actions {
        display: flex;
        justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .table-responsive {
        overflow-x: auto;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  bookings: Booking[] = [];
  messages: Message[] = [];
  activeTab: 'bookings' | 'messages' = 'bookings';

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.bookingService.bookings$.subscribe(data => {
      this.bookings = data;
    });
    this.messageService.messages$.subscribe(data => {
      this.messages = data;
    });
  }

  deleteBooking(id: string) {
    this.bookingService.deleteBooking(id);
  }

  updateStatus(id: string, status: 'pending' | 'confirmed' | 'completed') {
    this.bookingService.updateStatus(id, status);
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id);
  }

  formatService(key: string): string {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
