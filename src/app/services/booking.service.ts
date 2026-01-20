import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Booking {
    id: string;
    service: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed';
    paymentMethod?: 'cash' | 'card';
    paymentStatus?: 'unpaid' | 'pending' | 'paid';
    isMonthlyContract?: boolean;
    organizationName?: string;
    contractDuration?: number;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private bookingsSubject = new BehaviorSubject<Booking[]>([]);
    bookings$ = this.bookingsSubject.asObservable();
    private readonly STORAGE_KEY = 'movenest_bookings';

    constructor() {
        this.loadBookings();
    }

    private loadBookings() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const bookings = JSON.parse(stored);
                this.bookingsSubject.next(bookings);
            } catch (e) {
                console.error('Error parsing bookings', e);
                this.bookingsSubject.next([]);
            }
        }
    }

    getBookings(): Booking[] {
        return this.bookingsSubject.getValue();
    }

    addBooking(bookingData: Omit<Booking, 'id' | 'status' | 'timestamp'>) {
        const newBooking: Booking = {
            ...bookingData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            timestamp: new Date()
        };

        const currentBookings = this.bookingsSubject.getValue();
        const updatedBookings = [newBooking, ...currentBookings];

        this.bookingsSubject.next(updatedBookings);
        this.saveBookings(updatedBookings);

        return newBooking;
    }

    deleteBooking(id: string) {
        const currentBookings = this.bookingsSubject.getValue();
        const updatedBookings = currentBookings.filter(b => b.id !== id);

        this.bookingsSubject.next(updatedBookings);
        this.saveBookings(updatedBookings);
    }

    updateStatus(id: string, status: 'pending' | 'confirmed' | 'completed') {
        const currentBookings = this.bookingsSubject.getValue();
        const updatedBookings = currentBookings.map(b =>
            b.id === id ? { ...b, status } : b
        );

        this.bookingsSubject.next(updatedBookings);
        this.saveBookings(updatedBookings);
    }

    updatePayment(id: string, paymentMethod: 'cash' | 'card', paymentStatus: 'pending' | 'paid') {
        const currentBookings = this.bookingsSubject.getValue();
        const updatedBookings = currentBookings.map(b =>
            b.id === id ? { ...b, paymentMethod, paymentStatus } : b
        );

        this.bookingsSubject.next(updatedBookings);
        this.saveBookings(updatedBookings);
    }

    getBookingById(id: string): Booking | undefined {
        return this.bookingsSubject.getValue().find(b => b.id === id);
    }

    private saveBookings(bookings: Booking[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    }
}
