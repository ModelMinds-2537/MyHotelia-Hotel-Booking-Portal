package com.hotelbooking.backend.service;

import com.hotelbooking.backend.dto.BookingRequest;
import com.hotelbooking.backend.dto.BookingResponse;
import com.hotelbooking.backend.dto.PriceBreakdownDto;
import com.hotelbooking.backend.exception.BadRequestException;
import com.hotelbooking.backend.exception.ResourceNotFoundException;
import com.hotelbooking.backend.exception.RoomUnavailableException;
import com.hotelbooking.backend.model.Booking;
import com.hotelbooking.backend.model.BookingStatus;
import com.hotelbooking.backend.model.Hotel;
import com.hotelbooking.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelService hotelService;

    // Pricing definitions in Indian Rupees (₹) for surprise add-ons
    private static final Map<String, BigDecimal> ADDON_PRICES = new LinkedHashMap<>();
    static {
        ADDON_PRICES.put("Gourmet Breakfast Buffet", BigDecimal.valueOf(850.00)); // ₹850 per night
        ADDON_PRICES.put("Express Airport Chauffeur", BigDecimal.valueOf(2200.00)); // ₹2,200 flat
        ADDON_PRICES.put("Late Check-out (3:00 PM)", BigDecimal.valueOf(1500.00)); // ₹1,500 flat
        ADDON_PRICES.put("Wellness Spa & Sauna Pass", BigDecimal.valueOf(1800.00)); // ₹1,800 flat
    }

    public BookingService(BookingRepository bookingRepository, HotelService hotelService) {
        this.bookingRepository = bookingRepository;
        this.hotelService = hotelService;
    }

    public void validateDates(LocalDate checkInDate, LocalDate checkOutDate) {
        if (checkInDate == null || checkOutDate == null) {
            throw new BadRequestException("Check-in and check-out dates are required.");
        }
        LocalDate today = LocalDate.now();
        if (checkInDate.isBefore(today)) {
            throw new BadRequestException("Check-in date cannot be in the past (" + checkInDate + " < " + today + ").");
        }
        if (!checkOutDate.isAfter(checkInDate)) {
            throw new BadRequestException("Check-out date must be strictly after check-in date.");
        }
        long nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        if (nights > 30) {
            throw new BadRequestException("Maximum online booking length is 30 nights.");
        }
    }

    public PriceBreakdownDto calculatePrice(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate, List<String> selectedAddOns) {
        validateDates(checkInDate, checkOutDate);
        Hotel hotel = hotelService.getHotelEntity(hotelId);

        int nights = (int) ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        BigDecimal pricePerNight = hotel.getPricePerNight() != null ? hotel.getPricePerNight().setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal roomSubtotal = pricePerNight.multiply(BigDecimal.valueOf(nights)).setScale(2, RoundingMode.HALF_UP);

        // 12% Indian GST for hospitality services
        BigDecimal taxRate = BigDecimal.valueOf(0.12);
        BigDecimal taxAmount = roomSubtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);

        BigDecimal addOnsSubtotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        Map<String, BigDecimal> addOnsBreakdown = new LinkedHashMap<>();

        if (selectedAddOns != null) {
            for (String addOn : selectedAddOns) {
                if (addonExists(addOn)) {
                    BigDecimal cost = calculateAddonCost(addOn, nights);
                    addOnsBreakdown.put(addOn, cost);
                    addOnsSubtotal = addOnsSubtotal.add(cost);
                }
            }
        }

        BigDecimal totalAmount = roomSubtotal.add(taxAmount).add(addOnsSubtotal).setScale(2, RoundingMode.HALF_UP);

        int availableRooms = hotelService.calculateAvailableRooms(hotelId, hotel.getTotalRooms(), checkInDate, checkOutDate);

        PriceBreakdownDto breakdown = new PriceBreakdownDto();
        breakdown.setNumberOfNights(nights);
        breakdown.setPricePerNight(pricePerNight);
        breakdown.setRoomSubtotal(roomSubtotal);
        breakdown.setTaxRatePercent(BigDecimal.valueOf(12.0));
        breakdown.setTaxAmount(taxAmount);
        breakdown.setAddOnsSubtotal(addOnsSubtotal);
        breakdown.setAddOnsBreakdown(addOnsBreakdown);
        breakdown.setTotalAmount(totalAmount);
        breakdown.setAvailable(availableRooms > 0);
        breakdown.setAvailableRooms(availableRooms);

        return breakdown;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingResponse createBooking(BookingRequest request) {
        validateDates(request.getCheckInDate(), request.getCheckOutDate());
        Hotel hotel = hotelService.getHotelEntity(request.getHotelId());

        // Check availability
        int availableRooms = hotelService.calculateAvailableRooms(
                hotel.getId(),
                hotel.getTotalRooms(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (availableRooms < 1) {
            throw new RoomUnavailableException("Sorry, no rooms are available for " + hotel.getName() +
                    " between " + request.getCheckInDate() + " and " + request.getCheckOutDate() +
                    ". Please choose different dates.");
        }

        PriceBreakdownDto priceCalc = calculatePrice(
                hotel.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getSelectedAddOns()
        );

        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setHotel(hotel);
        booking.setGuestName(request.getGuestName().trim());
        booking.setGuestEmail(request.getGuestEmail().trim().toLowerCase());
        booking.setGuestPhone(request.getGuestPhone() != null ? request.getGuestPhone().trim() : null);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumberOfNights(priceCalc.getNumberOfNights());
        booking.setNumberOfRooms(1);
        booking.setPricePerNight(priceCalc.getPricePerNight());
        booking.setBaseAmount(priceCalc.getRoomSubtotal());
        booking.setTaxAmount(priceCalc.getTaxAmount());
        booking.setAddOnsAmount(priceCalc.getAddOnsSubtotal());
        booking.setSelectedAddOns(request.getSelectedAddOns() != null ? String.join(", ", request.getSelectedAddOns()) : "");
        booking.setTotalAmount(priceCalc.getTotalAmount());
        booking.setSpecialRequests(request.getSpecialRequests() != null ? request.getSpecialRequests().trim() : null);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByReferenceAndEmail(String reference, String email) {
        if (reference == null || reference.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Both booking reference and guest email are required to retrieve a booking.");
        }

        Booking booking = bookingRepository.findByBookingReferenceAndGuestEmailIgnoreCase(reference.trim(), email.trim())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No booking found matching reference '" + reference.trim() + "' and email '" + email.trim() + "'. Please check your credentials."));

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(String reference, String email) {
        if (reference == null || reference.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Both booking reference and guest email are required to cancel a booking.");
        }

        Booking booking = bookingRepository.findByBookingReferenceAndGuestEmailIgnoreCase(reference.trim(), email.trim())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No booking found matching reference '" + reference.trim() + "' and email '" + email.trim() + "'."));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking " + reference + " is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        Booking updated = bookingRepository.save(booking);

        return mapToResponse(updated);
    }

    private boolean addonExists(String name) {
        return ADDON_PRICES.containsKey(name);
    }

    private BigDecimal calculateAddonCost(String name, int nights) {
        BigDecimal base = ADDON_PRICES.getOrDefault(name, BigDecimal.ZERO);
        if ("Gourmet Breakfast Buffet".equalsIgnoreCase(name)) {
            return base.multiply(BigDecimal.valueOf(nights)).setScale(2, RoundingMode.HALF_UP);
        }
        return base.setScale(2, RoundingMode.HALF_UP);
    }

    private String generateBookingReference() {
        int year = LocalDate.now().getYear();
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "MH-" + year + "-" + randomPart;
    }

    public BookingResponse mapToResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId());
        r.setBookingReference(b.getBookingReference());
        if (b.getHotel() != null) {
            r.setHotelId(b.getHotel().getId());
            r.setHotelName(b.getHotel().getName());
            r.setHotelCity(b.getHotel().getCity());
            r.setHotelLocation(b.getHotel().getLocation());
            r.setHotelImageUrl(b.getHotel().getImageUrl());
            r.setRoomType(b.getHotel().getRoomType());
        }
        r.setGuestName(b.getGuestName());
        r.setGuestEmail(b.getGuestEmail());
        r.setGuestPhone(b.getGuestPhone());
        r.setCheckInDate(b.getCheckInDate());
        r.setCheckOutDate(b.getCheckOutDate());
        r.setNumberOfNights(b.getNumberOfNights());
        r.setNumberOfRooms(b.getNumberOfRooms());
        r.setPricePerNight(b.getPricePerNight());
        r.setBaseAmount(b.getBaseAmount());
        r.setTaxAmount(b.getTaxAmount());
        r.setAddOnsAmount(b.getAddOnsAmount());
        r.setSelectedAddOns(b.getSelectedAddOns());
        r.setTotalAmount(b.getTotalAmount());
        r.setSpecialRequests(b.getSpecialRequests());
        r.setStatus(b.getStatus());
        r.setCreatedAt(b.getCreatedAt());
        r.setCancelledAt(b.getCancelledAt());
        return r;
    }
}
