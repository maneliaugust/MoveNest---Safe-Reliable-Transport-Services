import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ServicesComponent } from './pages/services.component';
import { FleetComponent } from './pages/fleet.component';
import { BookingComponent } from './pages/booking.component';
import { ContactComponent } from './pages/contact.component';
import { AdminComponent } from './pages/admin.component';
import { PaymentComponent } from './pages/payment.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'fleet', component: FleetComponent },
    { path: 'booking', component: BookingComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'payment/:id', component: PaymentComponent },
    { path: '**', redirectTo: '' }
];
