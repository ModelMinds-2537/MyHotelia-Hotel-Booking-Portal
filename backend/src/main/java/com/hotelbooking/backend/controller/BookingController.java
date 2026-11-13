package com.hotelbooking.backend.controller;

import com.hotelbooking.backend.dto.ApiResponse;
import com.hotelbooking.backend.dto.BookingLookupRequest;
import com.hotelbooking.backend.dto.BookingRequest;
import com.hotelbooking.backend.dto.BookingResponse;
import com.hotelbooking.backend.dto.PriceBreakdownDto;
import com.hotelbooking.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<PriceBreakdownDto>> calculatePrice(@Valid @RequestBody BookingRequest request) {
        PriceBreakdownDto quote = bookingService.calculatePrice(
                request.getHotelId(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getSelectedAddOns()
        );
        return ResponseEntity.ok(ApiResponse.ok("Price breakdown calculated", quote));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking confirmed successfully", booking));
    }

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<BookingResponse>> lookupBooking(
            @RequestParam String reference,
            @RequestParam String email) {
        BookingResponse booking = bookingService.getBookingByReferenceAndEmail(reference, email);
        return ResponseEntity.ok(ApiResponse.ok("Booking retrieved successfully", booking));
    }

    @PostMapping("/lookup")
    public ResponseEntity<ApiResponse<BookingResponse>> lookupBookingPost(@Valid @RequestBody BookingLookupRequest request) {
        BookingResponse booking = bookingService.getBookingByReferenceAndEmail(
                request.getBookingReference(),
                request.getGuestEmail()
        );
        return ResponseEntity.ok(ApiResponse.ok("Booking retrieved successfully", booking));
    }

    @PostMapping("/{reference}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable String reference,
            @RequestParam String email) {
        BookingResponse booking = bookingService.cancelBooking(reference, email);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully. Reserved rooms have been released.", booking));
    }
}
