import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'mn-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="notifications-wrapper">
            <div *ngFor="let note of activeNotifications" 
                 class="notification-card" 
                 [class]="note.type"
                 (click)="removeNotification(note.id)">
                
                <div class="icon-section">
                    <i class="fa-solid" [ngClass]="getIcon(note.type)"></i>
                </div>
                
                <div class="content-section">
                    <h3>{{ note.title }}</h3>
                    <p [innerHTML]="note.message"></p>
                </div>

                <div class="close-btn">
                    <i class="fa-solid fa-xmark"></i>
                </div>

                <div class="progress-bar" [style.animationDuration.ms]="note.duration || 5000"></div>
            </div>
        </div>
    `,
    styles: [`
        .notifications-wrapper {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 15px;
            pointer-events: none;
        }

        .notification-card {
            pointer-events: auto;
            min-width: 320px;
            max-width: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            padding: 1rem;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 5px solid #ccc;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .notification-card.email {
            background: #f0f7ff;
            border-left-color: #3b82f6;
        }

        .notification-card.success { border-left-color: #10b981; }
        .notification-card.error { border-left-color: #ef4444; }

        .icon-section {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            font-size: 1.5rem;
            margin-right: 1rem;
        }

        .email .icon-section { color: #3b82f6; }
        .success .icon-section { color: #10b981; }
        .error .icon-section { color: #ef4444; }

        .content-section h3 {
            margin: 0 0 0.2rem 0;
            font-size: 1rem;
            color: #333;
        }

        .content-section p {
            margin: 0;
            font-size: 0.9rem;
            color: #666;
            line-height: 1.4;
        }

        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #aaa;
            font-size: 0.8rem;
        }

        .progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(0,0,0,0.1);
            width: 100%;
            transform-origin: left;
            animation: shrink linear forwards;
        }

        .email .progress-bar { background: #3b82f6; }
        .success .progress-bar { background: #10b981; }

        @keyframes shrink {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
    `]
})
export class NotificationComponent implements OnInit, OnDestroy {
    activeNotifications: AppNotification[] = [];
    private sub: Subscription | null = null;

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.sub = this.notificationService.notifications$.subscribe(note => {
            this.activeNotifications.push(note);

            const duration = note.duration || 5000;
            setTimeout(() => {
                this.removeNotification(note.id);
            }, duration);
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    removeNotification(id: string) {
        this.activeNotifications = this.activeNotifications.filter(n => n.id !== id);
    }

    getIcon(type: string) {
        switch (type) {
            case 'email': return 'fa-envelope-open-text';
            case 'success': return 'fa-circle-check';
            case 'error': return 'fa-circle-xmark';
            default: return 'fa-circle-info';
        }
    }
}
