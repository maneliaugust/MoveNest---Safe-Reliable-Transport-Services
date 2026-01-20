import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ServicesComponent } from './pages/services.component';
import { FleetComponent } from './pages/fleet.component';
import { BookingComponent } from './pages/booking.component';
import { ContactComponent } from './pages/contact.component';
import { AdminComponent } from './pages/admin.component';
import { PaymentComponent } from './pages/payment.component';
import { QuoteComponent } from './pages/quote.component';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';
import { SettingsComponent } from './pages/settings.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'fleet', component: FleetComponent },
    { path: 'booking', component: BookingComponent },
    { path: 'quote', component: QuoteComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'payment/:id', component: PaymentComponent },
    { path: '**', redirectTo: '' }
];
