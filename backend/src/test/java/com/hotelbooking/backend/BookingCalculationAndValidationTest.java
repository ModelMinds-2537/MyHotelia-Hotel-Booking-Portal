package com.hotelbooking.backend;

import com.hotelbooking.backend.dto.PriceBreakdownDto;
import com.hotelbooking.backend.exception.BadRequestException;
import com.hotelbooking.backend.model.Hotel;
import com.hotelbooking.backend.repository.BookingRepository;
import com.hotelbooking.backend.service.BookingService;
import com.hotelbooking.backend.service.HotelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingCalculationAndValidationTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private HotelService hotelService;

    @InjectMocks
    private BookingService bookingService;

    private Hotel sampleHotel;

    @BeforeEach
    void setUp() {
        sampleHotel = new Hotel();
        sampleHotel.setId(1L);
        sampleHotel.setName("The Grand Heritage Palace");
        sampleHotel.setPricePerNight(new BigDecimal("8500.00"));
        sampleHotel.setTotalRooms(5);
    }

    @Test
    @DisplayName("Should successfully validate normal future stay dates")
    void testValidDatesPass() {
        LocalDate checkIn = LocalDate.now().plusDays(5);
        LocalDate checkOut = LocalDate.now().plusDays(9);

        assertDoesNotThrow(() -> bookingService.validateDates(checkIn, checkOut));
    }

    @Test
    @DisplayName("Should reject check-in dates in the past")
    void testPastCheckInThrowsException() {
        LocalDate checkIn = LocalDate.now().minusDays(1);
        LocalDate checkOut = LocalDate.now().plusDays(2);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.validateDates(checkIn, checkOut)
        );
        assertTrue(ex.getMessage().contains("past"));
    }

    @Test
    @DisplayName("Should reject check-out dates on or before check-in date")
    void testCheckOutBeforeOrSameAsCheckInThrowsException() {
        LocalDate checkIn = LocalDate.now().plusDays(3);
        LocalDate sameDay = checkIn;
        LocalDate beforeDay = checkIn.minusDays(1);

        assertThrows(BadRequestException.class, () ->
                bookingService.validateDates(checkIn, sameDay)
        );
        assertThrows(BadRequestException.class, () ->
                bookingService.validateDates(checkIn, beforeDay)
        );
    }

    @Test
    @DisplayName("Should correctly calculate base room price in INR, 12% GST, and total for multi-night stay without add-ons")
    void testPriceCalculationWithoutAddons() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(5); // 3 nights

        when(hotelService.getHotelEntity(1L)).thenReturn(sampleHotel);
        when(hotelService.calculateAvailableRooms(eq(1L), eq(5), eq(checkIn), eq(checkOut))).thenReturn(5);

        PriceBreakdownDto price = bookingService.calculatePrice(1L, checkIn, checkOut, Collections.emptyList());

        assertEquals(3, price.getNumberOfNights());
        assertEquals(new BigDecimal("8500.00"), price.getPricePerNight());
        // 3 * 8500.00 = 25500.00
        assertEquals(new BigDecimal("25500.00"), price.getRoomSubtotal());
        // 12% GST = 3060.00
        assertEquals(new BigDecimal("3060.00"), price.getTaxAmount());
        assertEquals(new BigDecimal("0.00"), price.getAddOnsSubtotal());
        // Total = 25500.00 + 3060.00 = 28560.00
        assertEquals(new BigDecimal("28560.00"), price.getTotalAmount());
        assertTrue(price.isAvailable());
        assertEquals(5, price.getAvailableRooms());
    }

    @Test
    @DisplayName("Should correctly compute INR price breakdown including night-based and flat add-ons")
    void testPriceCalculationWithAddons() {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = LocalDate.now().plusDays(4); // 2 nights

        when(hotelService.getHotelEntity(1L)).thenReturn(sampleHotel);
        when(hotelService.calculateAvailableRooms(anyLong(), anyInt(), any(), any())).thenReturn(3);

        // Breakfast: 850 * 2 = 1700.00, Airport Chauffeur: 2200.00 flat
        PriceBreakdownDto price = bookingService.calculatePrice(
                1L,
                checkIn,
                checkOut,
                Arrays.asList("Gourmet Breakfast Buffet", "Express Airport Chauffeur")
        );

        assertEquals(2, price.getNumberOfNights());
        // Base = 2 * 8500 = 17000.00
        assertEquals(new BigDecimal("17000.00"), price.getRoomSubtotal());
        // 12% GST = 2040.00
        assertEquals(new BigDecimal("2040.00"), price.getTaxAmount());
        // Addons: 1700.00 + 2200.00 = 3900.00
        assertEquals(new BigDecimal("3900.00"), price.getAddOnsSubtotal());
        // Total = 17000 + 2040 + 3900 = 22940.00
        assertEquals(new BigDecimal("22940.00"), price.getTotalAmount());
    }
}
