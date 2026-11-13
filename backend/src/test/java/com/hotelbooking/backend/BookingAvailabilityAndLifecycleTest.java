package com.hotelbooking.backend;

import com.hotelbooking.backend.dto.BookingRequest;
import com.hotelbooking.backend.dto.BookingResponse;
import com.hotelbooking.backend.exception.BadRequestException;
import com.hotelbooking.backend.exception.RoomUnavailableException;
import com.hotelbooking.backend.model.Booking;
import com.hotelbooking.backend.model.BookingStatus;
import com.hotelbooking.backend.model.Hotel;
import com.hotelbooking.backend.repository.BookingRepository;
import com.hotelbooking.backend.repository.HotelRepository;
import com.hotelbooking.backend.service.BookingService;
import com.hotelbooking.backend.service.HotelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BookingAvailabilityAndLifecycleTest {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelService hotelService;

    @Autowired
    private BookingService bookingService;

    private Hotel testHotel;

    @BeforeEach
    void setUp() {
        testHotel = new Hotel(
                "Test Boutique Hotel",
                "Jaipur",
                "Civil Lines, Jaipur",
                "A charming boutique hotel for automated testing.",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                4.8,
                50,
                "Free Wi-Fi, Pool",
                "Deluxe Room",
                "Comfortable king room",
                BigDecimal.valueOf(5000.00),
                2, // Only 2 rooms total!
                "Charming boutique",
                "25C Sunny",
                "Amber Fort"
        );
        testHotel = hotelRepository.save(testHotel);
    }

    @Test
    @DisplayName("Availability should equal total rooms when no bookings exist")
    void testInitialAvailability() {
        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(13);

        int available = hotelService.calculateAvailableRooms(testHotel.getId(), testHotel.getTotalRooms(), checkIn, checkOut);
        assertEquals(2, available);
    }

    @Test
    @DisplayName("Booking a room decreases availability; booking up to capacity exhausts it")
    void testCapacityTracking() {
        LocalDate checkIn = LocalDate.now().plusDays(10);
        LocalDate checkOut = LocalDate.now().plusDays(12);

        // Book 1st room
        BookingRequest req1 = new BookingRequest();
        req1.setHotelId(testHotel.getId());
        req1.setGuestName("Alice Smith");
        req1.setGuestEmail("alice@example.com");
        req1.setCheckInDate(checkIn);
        req1.setCheckOutDate(checkOut);
        BookingResponse b1 = bookingService.createBooking(req1);
        assertNotNull(b1.getBookingReference());
        assertEquals(BookingStatus.CONFIRMED, b1.getStatus());

        // Check remaining
        int availableAfter1 = hotelService.calculateAvailableRooms(testHotel.getId(), testHotel.getTotalRooms(), checkIn, checkOut);
        assertEquals(1, availableAfter1);

        // Book 2nd room (exhausting capacity of 2)
        BookingRequest req2 = new BookingRequest();
        req2.setHotelId(testHotel.getId());
        req2.setGuestName("Bob Jones");
        req2.setGuestEmail("bob@example.com");
        req2.setCheckInDate(checkIn);
        req2.setCheckOutDate(checkOut);
        BookingResponse b2 = bookingService.createBooking(req2);
        assertNotNull(b2.getBookingReference());

        // Check remaining
        int availableAfter2 = hotelService.calculateAvailableRooms(testHotel.getId(), testHotel.getTotalRooms(), checkIn, checkOut);
        assertEquals(0, availableAfter2);

        // Attempt 3rd booking for the same stay -> must fail with RoomUnavailableException
        BookingRequest req3 = new BookingRequest();
        req3.setHotelId(testHotel.getId());
        req3.setGuestName("Charlie Brown");
        req3.setGuestEmail("charlie@example.com");
        req3.setCheckInDate(checkIn);
        req3.setCheckOutDate(checkOut);

        assertThrows(RoomUnavailableException.class, () -> bookingService.createBooking(req3));
    }

    @Test
    @DisplayName("Cancelling a booking immediately releases reserved capacity for that stay")
    void testCancellationReleasesCapacity() {
        LocalDate checkIn = LocalDate.now().plusDays(15);
        LocalDate checkOut = LocalDate.now().plusDays(17);

        // Book both rooms
        BookingRequest req1 = new BookingRequest();
        req1.setHotelId(testHotel.getId());
        req1.setGuestName("Guest One");
        req1.setGuestEmail("guest1@example.com");
        req1.setCheckInDate(checkIn);
        req1.setCheckOutDate(checkOut);
        BookingResponse b1 = bookingService.createBooking(req1);

        BookingRequest req2 = new BookingRequest();
        req2.setHotelId(testHotel.getId());
        req2.setGuestName("Guest Two");
        req2.setGuestEmail("guest2@example.com");
        req2.setCheckInDate(checkIn);
        req2.setCheckOutDate(checkOut);
        bookingService.createBooking(req2);

        // Available is now 0
        assertEquals(0, hotelService.calculateAvailableRooms(testHotel.getId(), testHotel.getTotalRooms(), checkIn, checkOut));

        // Cancel b1
        BookingResponse cancelled = bookingService.cancelBooking(b1.getBookingReference(), "guest1@example.com");
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());
        assertNotNull(cancelled.getCancelledAt());

        // Reserved capacity is released! Available should now be 1
        int availableAfterCancel = hotelService.calculateAvailableRooms(testHotel.getId(), testHotel.getTotalRooms(), checkIn, checkOut);
        assertEquals(1, availableAfterCancel);

        // Cannot cancel twice
        assertThrows(BadRequestException.class, () ->
                bookingService.cancelBooking(b1.getBookingReference(), "guest1@example.com")
        );
    }
}
