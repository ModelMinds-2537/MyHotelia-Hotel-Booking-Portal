# MyHotelia – Hotel Booking Portal
## Design Document

## 1. Project Overview

**MyHotelia** is a full-stack hotel booking portal developed to allow users to explore hotels, check room availability, calculate booking prices, make reservations, retrieve booking details, and cancel bookings.

The application provides hotel information such as location, description, room type, amenities, ratings, pricing, destination weather guidance, and nearby attractions. Users can also select additional services during booking and view the updated price breakdown.

### Main Objectives

- Provide an easy-to-use interface for browsing and searching hotels.
- Allow users to check room availability for selected dates.
- Calculate booking costs, including taxes and optional add-ons.
- Allow users to create, retrieve, and cancel bookings.
- Prevent bookings when no rooms are available for the selected dates.
- Provide additional destination information and booking-related features.

### Technology Stack

Frontend - React 19, Vite, JavaScript
Backend - Java, Spring Boot 4.1.2
Database - MySQL 8.0
ORM - Spring Data JPA
Build Tool - Maven
API Communication - REST APIs
Development Environment - Visual Studio Code, Eclipse IDE, MySQL Workbench

---

## 2. System Architecture

MyHotelia follows a three-tier architecture consisting of the presentation layer, application layer, and database layer.

### 2.1 Presentation Layer – Frontend

The frontend is developed using React and Vite. It provides the user interface through which users interact with the application.

Its responsibilities include:

- Displaying available hotels and their details.
- Searching hotels by destination.
- Collecting check-in and check-out dates.
- Displaying room availability and price breakdowns.
- Collecting guest details and booking information.
- Displaying booking confirmation and reference details.
- Allowing users to retrieve and cancel bookings.
- Displaying destination information, additional services, and printable booking vouchers.

The frontend communicates with the backend through HTTP requests to the REST API endpoints.

### 2.2 Application Layer – Backend

The backend is developed using Java and Spring Boot. It handles the application's business logic and acts as an intermediary between the frontend and database.

The backend follows a layered structure:

- **Controller Layer:** Receives HTTP requests and returns API responses.
- **Service Layer:** Handles business logic such as hotel searching, price calculation, date validation, room availability, booking creation, and cancellation.
- **Repository Layer:** Uses Spring Data JPA to perform database operations.
- **Model Layer:** Defines the Hotel and Booking entities.
- **DTO Layer:** Transfers structured request and response data between the frontend and backend.
- **Exception Layer:** Handles application errors and returns appropriate error responses.

### 2.3 Database Layer

MySQL is used to store hotel information and booking records.

The database contains two main tables:

- `hotels`
- `bookings`

Spring Data JPA and Hibernate are used to map Java entity classes to database tables and perform database operations.

### 2.4 Application Flow

The overall interaction follows this sequence:

1. The user opens the MyHotelia frontend.
2. The frontend sends an API request to the Spring Boot backend.
3. The controller receives the request and forwards it to the appropriate service.
4. The service performs the required validation and business logic.
5. The repository retrieves or updates the required information in MySQL.
6. The backend returns a structured response.
7. The frontend displays the result to the user.

---

## 3. Database Design

The application uses a relational database named `hotel_booking_db`.

The database schema and sample hotel records are provided in the root-level `db-setup.sql` file. The application also contains a `DataSeeder` component that inserts initial hotel data when the hotel table is empty.

### 3.1 Hotels Table

The `hotels` table stores information about hotels available on the platform.

id - Primary key; uniquely identifies a hotel
name - Name of the hotel
city - City where the hotel is located
location - Detailed hotel location
description - Hotel description
image_url - Hotel image URL
rating - Hotel rating
review_count - Number of reviews
amenities - Available hotel amenities
room_type - Room type offered
room_description - Description of the room
price_per_night - Room price per night
total_rooms - Total room capacity
tagline - Short hotel tagline
weather_guide - Predefined destination weather information
top_attractions - Nearby tourist attractions
created_at - Record creation timestamp

**Primary Key:** `id`

### 3.2 Bookings Table

The `bookings` table stores guest reservation details and calculated booking amounts.

id - Primary key; uniquely identifies a booking
booking_reference - Unique booking reference
hotel_id - Foreign key referencing the hotels table
guest_name - Name of the guest
guest_email - Guest email address
guest_phone - Guest contact number
check_in_date - Booking check-in date
check_out_date - Booking check-out date
number_of_nights - Total number of nights
number_of_rooms - Number of rooms reserved
price_per_night - Room price per night at booking time
base_amount - Total room cost before tax
tax_amount - Calculated tax
add_ons_amount - Total cost of selected add-ons
selected_add_ons - Selected additional services
total_amount - Final booking amount
special_requests - Additional guest requests
status - Booking status
created_at - Booking creation timestamp
cancelled_at - Booking cancellation timestamp

**Primary Key:** `id`

**Foreign Key:** `hotel_id` references `hotels(id)`.

**Unique Constraint:** `booking_reference` must be unique.

**Indexes:** The database includes indexes on guest email and hotel booking dates/status to support booking lookup and availability-related queries.

### 3.3 Entity Relationship

The database has a one-to-many relationship between hotels and bookings.

- One hotel can have multiple booking records.
- Each booking belongs to one hotel.
- The `hotel_id` column in the bookings table establishes this relationship.

             HOTELS
        -----------------
        PK  id
            name
            city
            location
            price_per_night
            total_rooms
        -----------------
              |
              | 1
              |
              | Many
              |
           BOOKINGS
        -----------------
        PK  id
        FK  hotel_id
            booking_reference
            guest_name
            guest_email
            check_in_date
            check_out_date
            total_amount
            status
        -----------------

### 3.4 Database Constraints

The following constraints help maintain data integrity:

- Primary keys uniquely identify hotel and booking records.
- The booking reference is unique.
- Required hotel and guest information is stored in non-nullable fields.
- The booking's hotel ID references an existing hotel.
- Booking status is stored using the values `CONFIRMED` and `CANCELLED`.
- Date and booking validation is performed in the backend before a booking is saved.

---

## 4. API Design

The backend exposes REST API endpoints under the `/api` base path. The frontend uses these endpoints to retrieve hotel information and perform booking operations.

### 4.1 Hotel APIs

GET - `/api/hotels` - Retrieves the list of hotels. Optional check-in and check-out dates can be suppied to obtain availability information.
GET - `/api/hotels/search?location={location}` - Searches hotels by destination. Date parameters can also be supplied.
GET - `/api/hotels/{id}` - Retrieves details of a particular hotel.
GET - `/api/hotels/{id}/quote` - Retrieves a price quotation and availability for the selected hotel, dates, and add-ons.

### 4.2 Booking APIs

POST - `/api/bookings/calculate` - Calculates the booking price before confirmation.
POST - `/api/bookings` - Creates a new booking after validation and availability checking.
GET - `/api/bookings/lookup?reference={reference}&email={email}` - Retrieves a booking using its reference and guest email.
POST - `/api/bookings/lookup` - Retrieves a booking using reference and email details in the request body.
POST - `/api/bookings/{reference}/cancel?email={email}` - Cancels an existing booking after verifying the guest email.

### 4.3 API Response Handling

The backend uses structured API response objects to return information to the frontend.

Successful operations return the requested data along with a response message. For example, a successful booking creation returns HTTP status `201 Created`.

The application also uses exception handling for errors such as:

- Invalid booking dates.
- Hotel or booking records not found.
- Unavailable rooms.
- Invalid booking lookup details.
- Attempts to cancel an already cancelled booking.

These errors are handled through the backend exception-handling mechanism and returned as appropriate HTTP error responses.

---

## 5. Booking Logic and Business Rules

The booking process is handled mainly by the `BookingService` and `HotelService` classes.

### 5.1 Date Validation

Before calculating a booking price or creating a reservation, the backend validates the selected dates.

The following rules are applied:

1. Check-in and check-out dates are mandatory.
2. Check-in dates cannot be in the past.
3. Check-out must be later than check-in.
4. The maximum online booking duration is 30 nights.

The number of nights is calculated using the difference between the check-in and check-out dates.

### 5.2 Room Availability Calculation

Room availability is calculated by comparing the hotel's total room capacity with the number of rooms already reserved for overlapping dates.

The application considers bookings with `CONFIRMED` status when calculating occupied rooms.

Two bookings overlap when:


Existing Check-in < Requested Check-out
AND
Existing Check-out > Requested Check-in


This approach allows one guest's checkout date to match another guest's check-in date without treating the two reservations as overlapping.

The availability calculation is:

Available Rooms = Total Rooms - Occupied Rooms


Cancelled bookings are excluded from the occupied room count. Therefore, cancelling a booking makes the reserved capacity available again for the relevant dates.

The current booking implementation reserves one room per booking.

### 5.3 Price Calculation

The booking price is calculated on the backend using the hotel's stored price per night, the number of nights, and the selected add-ons.

The calculation follows these steps:

**Step 1: Room Subtotal**

Room Subtotal = Price Per Night × Number of Nights

**Step 2: Tax Calculation**

The application currently applies a 12% tax rate in its booking calculation.

Tax Amount = Room Subtotal × 12%

**Step 3: Add-on Calculation**

The cost of selected additional services is added to the room subtotal.

Gourmet Breakfast Buffet  - ₹850 per night
Airport Chauffeur - ₹2,200 flat
Late Check-out (3:00 PM) - ₹1,500 flat
Wellness Spa & Sauna Pass - ₹1,800 flat

The breakfast buffet is charged per night, while the other listed add-ons are charged as flat amounts.

**Step 4: Final Amount**

Total Amount = Room Subtotal + Tax Amount + Add-ons Amount

The backend uses `BigDecimal` for monetary calculations to avoid common floating-point precision problems.

### 5.4 Booking Creation

When a user confirms a booking:

1. The backend validates the selected dates.
2. It retrieves the selected hotel.
3. It checks room availability for the requested dates.
4. If no room is available, the booking is rejected.
5. If availability exists, the backend calculates the final price.
6. A unique booking reference is generated.
7. Guest details, dates, price information, selected add-ons, and booking status are saved.
8. The booking is returned to the frontend as a confirmation response.

New bookings are assigned the `CONFIRMED` status.

### 5.5 Booking Retrieval

Users can retrieve their booking by providing their booking reference and registered email address.

The backend checks both values before returning the booking details. This prevents a booking from being retrieved using only its reference.

### 5.6 Booking Cancellation

Users can cancel a booking by providing the booking reference and guest email.

The backend:

1. Checks whether the booking exists.
2. Verifies the guest email against the booking record.
3. Checks whether the booking has already been cancelled.
4. Updates the booking status to `CANCELLED`.
5. Records the cancellation timestamp.

The booking record is retained in the database rather than deleted. Cancelled bookings no longer count towards room occupancy.

---

## 6. Handling Simultaneous Bookings

One important booking-system challenge is handling two users attempting to reserve the last available room for the same dates.

For example, suppose a hotel has only one room remaining for a particular date range. Two users may check availability at nearly the same time and both see that one room is available.

If both booking requests are processed without appropriate transaction handling, both could potentially receive a confirmation.

### Current Implementation

The `createBooking()` method in `BookingService` uses Spring's transactional annotation with `SERIALIZABLE` isolation:

@Transactional(isolation = Isolation.SERIALIZABLE)

The booking process checks room availability inside the transactional booking operation before saving the new booking.

The intention is to prevent conflicting transactions from incorrectly reserving the same remaining capacity.

The existing automated availability test checks capacity through sequential booking operations: it verifies that bookings can be made up to the available capacity, that an additional booking is rejected, and that cancellation restores availability.

**Important limitation:** The current automated test does not simulate two genuinely simultaneous booking requests. Therefore, concurrent booking protection has not been fully verified through a multi-threaded integration test.

### Possible Improvement

For a production-level booking system, a stronger approach would be to use explicit database locking, such as pessimistic row-level locking on the relevant hotel or room-inventory record.

The backend could:

1. Lock the relevant inventory record within a transaction.
2. Recalculate availability while holding the lock.
3. Create the booking only if capacity remains.
4. Commit the transaction and release the lock.
5. Reject the other request if no capacity remains.

A concurrent integration test using two threads and one remaining room should also be added to verify that only one request succeeds.

---

## 7. Additional Features (Surprise Features)

MyHotelia includes additional features to improve the hotel discovery and booking experience.

### 7.1 Destination Weather Guide and Travel Advisory

The hotel details include destination-specific weather descriptions and nearby tourist attractions.

The weather information is predefined and stored with the hotel data. It is intended to provide users with general destination guidance; it is not a live weather service.

### 7.2 Customizable Booking Add-ons

Users can select optional services during the booking process, including breakfast, airport chauffeur service, late checkout, and spa access.

The backend calculates the cost of the selected add-ons and includes it in the final booking amount.

### 7.3 Printable Booking Voucher

The application provides a printable booking voucher so users can keep a record of their reservation details.

This improves convenience by making important booking information available in a printable format.

---

## 8. Design Decisions and Trade-offs

### 8.1 React with Vite

React was selected to build a component-based and interactive frontend. Vite provides a lightweight development and build environment.

**Trade-off:** The frontend requires a separate development server during local development, but this keeps frontend and backend responsibilities independent.

### 8.2 Spring Boot

Spring Boot was selected for backend development because it provides REST API support, dependency injection, validation, transaction management, and integration with Spring Data JPA.

**Trade-off:** It introduces a structured Java project and additional configuration compared with a smaller backend framework, but it provides a maintainable architecture for business logic.

### 8.3 MySQL and Spring Data JPA

MySQL was selected because hotel and booking information is relational and requires consistent relationships between records.

Spring Data JPA reduces the need to write repetitive database operations manually.

**Trade-off:** JPA simplifies database interaction, but developers must still understand transaction boundaries, query behaviour, and database constraints.

### 8.4 BigDecimal for Financial Calculations

`BigDecimal` is used for prices and tax calculations to improve monetary precision.

**Trade-off:** It requires more explicit rounding and scale handling than primitive numeric types, but it is more appropriate for financial calculations.

### 8.5 Retaining Cancelled Booking Records

Bookings are cancelled by updating their status instead of deleting them.

**Reason:** This preserves booking history and allows cancelled reservations to be distinguished from confirmed reservations.

### 8.6 Backend-Side Price Calculation

The backend calculates the final booking amount rather than relying on the frontend.

**Reason:** This ensures that the booking amount is calculated using the backend's stored hotel prices and defined add-on prices.

---

## 9. Limitations and Future Improvements

Although MyHotelia implements the main hotel discovery and booking workflow, several improvements can be made.

### 9.1 Authentication and Authorization

The current application uses booking reference and guest email for booking retrieval and cancellation. A complete user registration, login, and role-based access system could be introduced in the future.

### 9.2 Online Payment Integration

The current booking workflow does not include a payment gateway. A secure payment integration could be added to support online payments and payment confirmations.

### 9.3 Live Weather Integration

The current destination weather information is predefined. A weather API could be integrated to display live weather conditions and forecasts.

### 9.4 Stronger Concurrency Testing

The application uses `SERIALIZABLE` transaction isolation during booking creation, but the existing tests verify sequential capacity handling. Multi-threaded integration tests and explicit inventory locking could improve confidence in simultaneous booking scenarios.

### 9.5 Multiple Rooms per Booking

The current implementation reserves one room per booking. Support for selecting multiple rooms and calculating their combined price could be added.

### 9.6 Improved Booking Management

Additional features such as booking history, automated email confirmations, cancellation policies, and administrative hotel management could be introduced.

### 9.7 Production Deployment

The application currently supports local development. It could be deployed to cloud infrastructure with production database configuration, HTTPS, environment-based secrets, monitoring, and automated backups.

### 9.8 AI-Powered Chatbot Integration

An AI-powered chatbot could be integrated into MyHotelia to provide users with instant assistance throughout their hotel booking journey.

The chatbot could help users with:
- Finding hotels based on their preferred destination and budget.
- Answering questions about hotel facilities, amenities, and room details.
- Explaining booking procedures, pricing, taxes, and additional services.
- Providing information about booking references and cancellation procedures.
- Suggesting nearby tourist attractions and travel information.

The chatbot could be connected to the Spring Boot backend through dedicated REST APIs and an AI language model API. It could retrieve relevant hotel and booking information from the application and generate helpful responses based on user queries.

This enhancement would improve user interaction, reduce the effort required to navigate the application, and provide a more personalized booking experience.
---

## 10. Conclusion

MyHotelia demonstrates the development of a full-stack hotel booking application using React, Spring Boot, and MySQL.

The system brings together hotel discovery, date validation, room availability calculation, price estimation, booking creation, booking retrieval, and cancellation in a single application.

The layered backend architecture separates controllers, services, repositories, and entities, while the relational database maintains hotel and booking information.

The project also demonstrates important backend concepts such as REST API development, database relationships, transactional operations, validation, exception handling, and financial calculations.

Further improvements such as payment integration, authentication, live weather information, and stronger concurrency testing can make the application more suitable for real-world deployment.

---

## 11. Development Notes

- **Approximate development time:** Approximately 16 hours
- **Unfinished items:** User authentication, online payment integration, live weather API integration, multiple-room booking, multi-threaded concurrent booking verification, and AI-powered chatbot integration are not currently implemented.
- **AI assistance:** AI assistance was used for debugging, code explanations, documentation preparation, and reviewing implementation approaches. The project was tested and reviewed during development."