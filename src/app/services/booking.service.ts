import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private bookingsSubject = new BehaviorSubject<Booking[]>([]);
    bookings$ = this.bookingsSubject.asObservable();
    private readonly API_URL = environment.apiUrl + '/bookings';

    constructor(private http: HttpClient) {
        this.loadBookings();
    }

    private loadBookings() {
        this.http.get<Booking[]>(this.API_URL).subscribe({
            next: (bookings) => {
                this.bookingsSubject.next(bookings);
            },
            error: (error) => {
                console.error('Error loading bookings:', error);
            }
        });
    }

    getBookings(): Booking[] {
        return this.bookingsSubject.getValue();
    }

    addBooking(bookingData: Omit<Booking, 'id' | 'status' | 'timestamp'>): Observable<Booking> {
        return this.http.post<Booking>(this.API_URL, bookingData).pipe(
            tap(newBooking => {
                const currentBookings = this.bookingsSubject.getValue();
                this.bookingsSubject.next([newBooking, ...currentBookings]);
            })
        );
    }

    deleteBooking(id: string) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
            next: () => {
                const currentBookings = this.bookingsSubject.getValue();
                const updatedBookings = currentBookings.filter(b => b.id !== id);
                this.bookingsSubject.next(updatedBookings);
            },
            error: (error) => console.error('Error deleting booking:', error)
        });
    }

    updateStatus(id: string, status: 'pending' | 'confirmed' | 'completed') {
        this.http.patch<Booking>(`${this.API_URL}/${id}/status`, { status }).subscribe({
            next: (updatedBooking) => {
                const currentBookings = this.bookingsSubject.getValue();
                const updatedBookings = currentBookings.map(b =>
                    b.id === id ? updatedBooking : b
                );
                this.bookingsSubject.next(updatedBookings);
            },
            error: (error) => console.error('Error updating status:', error)
        });
    }

    updatePayment(id: string, paymentMethod: 'cash' | 'card', paymentStatus: 'pending' | 'paid') {
        // Implement if backend endpoint exists, for now just local update or add endpoint if needed
        // For this iteration, we didn't add a specific payment update endpoint, 
        // so we can either add it to backend or just update local state if it's UI only.
        // Assuming visual update for now or future implementation.
        console.warn('Backend update for payment not implemented yet');

        // Optimistic update
        const currentBookings = this.bookingsSubject.getValue();
        const updatedBookings = currentBookings.map(b =>
            b.id === id ? { ...b, paymentMethod, paymentStatus } : b
        );
        this.bookingsSubject.next(updatedBookings);
    }

    getBookingById(id: string): Booking | undefined {
        return this.bookingsSubject.getValue().find(b => b.id === id);
    }
}
