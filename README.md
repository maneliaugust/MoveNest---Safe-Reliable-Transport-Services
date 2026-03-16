# MoveNest - Safe & Reliable Transport Services

MoveNest is a modern, full-stack application designed to streamline the process of booking and managing moving services. Built with a focus on reliability and user experience, it provides a seamless interface for both customers and administrators.

## 🚀 Key Features

-   **Seamless Booking**: Intuitive multi-step booking process for transport services.
-   **Instant Quotes**: Get quick estimates based on your moving requirements.
-   **Admin Dashboard**: Centralized hub for managing bookings, fleet, and system settings.
-   **Real-time Notifications**: Email confirmations and password reset flows powered by Resend.
-   **Interactive Maps**: Integrated Leaflet maps for precise location selection.
-   **Secure Authentication**: Role-based access control with protected routes for administrators.
-   **Fleet Showcase**: Detailed view of available vehicles and service capabilities.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Angular 21](https://angular.dev/)
-   **Maps**: [Leaflet](https://leafletjs.com/)
-   **Testing**: [Vitest](https://vitest.dev/)
-   **Styling**: Vanilla CSS with modern aesthetics.

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express
-   **Email Service**: [Resend](https://resend.com/)
-   **Environment Management**: dotenv

## 🏁 Getting Started

### Prerequisites
-   Node.js (LTS version recommended)
-   npm

### Configuration

The backend requires a Resend API key for email functionality.
1.  Navigate to the `backend` directory.
2.  Copy `.env.example` to `.env`.
3.  Add your `RESEND_API_KEY` to the `.env` file.

### Installation & Running

#### 1. Backend Setup
```bash
cd backend
npm install
npm start
```

#### 2. Frontend Setup
```bash
# From the root directory
npm install
npm start
```
Open your browser and navigate to https://6971be94ff0879407b1ff53f--fluffy-kleicha-737f92.netlify.app/

## 📂 Project Structure

-   `src/app/pages/`: Core application views (Home, Booking, Admin, etc.).
-   `src/app/components/`: Reusable UI components (Navbar, Footer, Notification).
-   `src/app/services/`: Frontend business logic and API interaction details.
-   `backend/`: Node.js/Express server and service implementations.
-   `backend/services/`: Backend logic for email and third-party integrations.

## 🧪 Testing

To execute unit tests for the frontend:
```bash
ng test
```

## 🏗️ Building for Production

To create a production build of the Angular application:
```bash
ng build
```
The optimized artifacts will be stored in the `dist/` directory.
