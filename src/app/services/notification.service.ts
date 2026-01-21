import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface AppNotification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'email';
    title: string;
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationsSource = new Subject<AppNotification>();
    notifications$ = this.notificationsSource.asObservable();

    show(notification: Omit<AppNotification, 'id'>) {
        const id = Math.random().toString(36).substr(2, 9);
        this.notificationsSource.next({ ...notification, id });
    }

    showEmail(title: string, message: string) {
        this.show({
            type: 'email',
            title,
            message,
            duration: 10000 // Emails stay longer
        });
    }

    success(message: string) {
        this.show({ type: 'success', title: 'Success', message });
    }

    error(message: string) {
        this.show({ type: 'error', title: 'Error', message });
    }
}
