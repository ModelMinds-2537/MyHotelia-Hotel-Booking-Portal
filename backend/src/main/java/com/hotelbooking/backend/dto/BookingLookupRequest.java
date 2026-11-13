package com.hotelbooking.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class BookingLookupRequest {

    @NotBlank(message = "Booking reference is required")
    private String bookingReference;

    @NotBlank(message = "Guest email is required")
    @Email(message = "Please provide a valid email address")
    private String guestEmail;

    public BookingLookupRequest() {
    }

    public BookingLookupRequest(String bookingReference, String guestEmail) {
        this.bookingReference = bookingReference;
        this.guestEmail = guestEmail;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }
}
