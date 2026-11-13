# MyHotelia — Making Every Stay Memorable.

A full-stack luxury hotel booking portal built with **Java (Spring Boot)**, **React 19 (Vite)**, and **MySQL 8.0**. 

The design follows the requested warm peach/apricot glow gradient (`#fff7ed` to `#fed7aa`) blended with crisp white cards, rich navy blue (`#0d2744`), and golden ochre accents, featuring the official **MyHotelia** crest logo.

---

## Surprise Features: "Smart Stay Enhancer & Luxury Boarding Pass"

Beyond the core booking and cancellation requirements, **MyHotelia** includes:
1. **Destination Weather & Travel Advisory**: Destination Weather Information & Travel Advisory (e.g., *"26°C Sunny, Clear skies & pleasant evening breeze"*), helping guests plan packings and daily excursions.
2. **Curated Nearby Attractions**: Handpicked local landmarks with exact distance indicators (e.g., Amber Fort 2.5 km, Hawa Mahal 4.0 km, Marine Drive 0.5 km).
3. **Interactive Stay Add-Ons with Real-Time Re-calculation**: Guests can customize their stay with options such as:
   - *Gourmet Breakfast Buffet* (₹850/night)
   - *Express Airport Chauffeur* (₹2,200 flat)
   - *Late Check-out until 3:00 PM* (₹1,500 flat)
   - *Wellness Spa & Sauna Pass* (₹1,800 flat)  
   The total price updates reactively in Indian Rupees (₹) before booking confirmation.
4. **Printable Luxury Digital Boarding Pass / Voucher**: After confirming or retrieving a booking, guests can generate and print a boarding-pass voucher with barcode/QR code aesthetic, check-in instructions, and booking breakdown.

---

##  Technology Stack

- **Backend**: Java 21, Spring Boot 4.1.2, Spring Data JPA, Hibernate, Jakarta Bean Validation
- **Frontend**: React 19, Vite, Lucide Icons, Modern CSS3 with Glassmorphism
- **Database**: MySQL 8.0
- **Testing**: JUnit 5, Mockito, Spring Boot Test

---

##  Core Requirements & Business Rules Implemented

| Rule / Requirement | Implementation Detail |
| :--- | :--- |
| **Browse Hotels** | Displays name, city, location, description, rating, amenities, room category, and nightly price. |
| **Search & Date Filters** | Filter by city or hotel query, plus check-in and check-out date range. |
| **Live Capacity Tracking** | Real-time calculation of overlapping confirmed bookings for each night of the stay. Rejects requests exceeding hotel capacity (`RoomUnavailableException`). |
| **Date Validations** | Check-in cannot be in the past (`checkIn >= today`); check-out must be strictly after check-in (`checkOut > checkIn`). |
| **Backend Total Calculation** | Server computes `baseAmount = price * nights`, `taxAmount = 12%`, plus any chosen add-ons. |
| **Booking Confirmation** | Generates unique reference code (`MH-2026-XXXXXX`) stored in MySQL. |
| **Retrieve & Cancel Booking** | Secure lookup by reference code **and** guest email. Cancelling marks the reservation as `CANCELLED` and **immediately releases reserved room capacity** for that date window. |
| **Secrets Management** | Database credentials and ports use environment variable defaults (`${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`) avoiding hardcoded secrets. |

---

##  Database Setup (MySQL)

### Option 1: Automatic Seeding (Recommended)
Spring Boot automatically creates tables and seeds all 6 sample hotels upon application startup via `DataSeeder.java`.

### Option 2: Manual SQL Script
You can manually run ['db-setup.sql'](db-setup.sql):
```bash
mysql -u root -p < db-setup.sql
```

The script sets up:
- Database: `hotel_booking_db`
- Tables: `hotels` and `bookings` (with foreign keys, unique indices on booking references, and compound indexes for date ranges)
- Sample data for 6 luxury hotels:
  1. *The Grand Heritage Palace* (Jaipur) — ₹8,500/night, 5 rooms
  2. *Azure Bay Beachfront Resort* (Goa) — ₹11,500/night, 4 rooms
  3. *The Skyline Metropole Hotel* (Mumbai) — ₹9,500/night, 6 rooms
  4. *Pine Crest Alpine Sanctuary* (Manali) — ₹6,800/night, 5 rooms
  5. *Serene Lakefront Palace* (Udaipur) — ₹14,200/night, 3 rooms
  6. *Emerald Valley Tea Plantation Villa* (Munnar) — ₹7,500/night, 4 rooms

---

##  Running the Application

### 1. Start the Backend (Spring Boot)
Ensure MySQL service is running, then in a terminal:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows PowerShell: `.\mvnw.cmd spring-boot:run`)*  
The REST APIs will be live at `http://localhost:8080/api/hotels`.

### 2. Start the Frontend (React + Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`. Requests to `/api/*` are automatically proxied to the backend.

---

##  Automated Tests

Run the test suite via Maven:
```bash
cd backend
./mvnw test
```
*(On Windows PowerShell: `.\mvnw.cmd test`)*

### Test Coverage Highlights:
- **`BookingCalculationAndValidationTest`**:
  - Validates future date ranges
  - Asserts that check-in in the past throws `BadRequestException`
  - Asserts that checkout on/before check-in throws `BadRequestException`
  - Validates exact room subtotal, 12% tax calculation, and add-on pricing
- **`BookingAvailabilityAndLifecycleTest`**:
  - Asserts initial availability matches `totalRooms`
  - Tests progressive capacity reduction with concurrent bookings
  - Confirms capacity exhaustion triggers `RoomUnavailableException`
  - Asserts that cancelling a booking **instantly restores availability**

---

##  API Reference

### Hotels
- `GET /api/hotels?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`: Get all hotels with live availability for stay dates.
- `GET /api/hotels/search?location=jaipur&checkIn=...&checkOut=...`: Search by city, location, or name.
- `GET /api/hotels/{id}?checkIn=...&checkOut=...`: Retrieve specific hotel details and availability.
- `GET /api/hotels/{id}/quote?checkIn=...&checkOut=...&addOns=...`: Get detailed itemized price breakdown.

### Bookings
- `POST /api/bookings/calculate`: Preview total price breakdown for a booking request.
- `POST /api/bookings`: Book a room (validates dates, capacity, email, and creates booking).
- `GET /api/bookings/lookup?reference=MH-2026-XXXXXX&email=guest@example.com`: Retrieve booking details.
- `POST /api/bookings/{reference}/cancel?email=guest@example.com`: Cancel booking and release rooms.
