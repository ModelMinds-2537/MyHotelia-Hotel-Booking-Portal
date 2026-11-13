package com.hotelbooking.backend.controller;

import com.hotelbooking.backend.dto.ApiResponse;
import com.hotelbooking.backend.dto.HotelDto;
import com.hotelbooking.backend.dto.PriceBreakdownDto;
import com.hotelbooking.backend.service.BookingService;
import com.hotelbooking.backend.service.HotelService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelService hotelService;
    private final BookingService bookingService;

    public HotelController(HotelService hotelService, BookingService bookingService) {
        this.hotelService = hotelService;
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HotelDto>>> getAllHotels(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        List<HotelDto> hotels = hotelService.getAllHotels(checkIn, checkOut);
        return ResponseEntity.ok(ApiResponse.ok("Hotels retrieved successfully", hotels));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<HotelDto>>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        List<HotelDto> hotels = hotelService.searchHotels(location, checkIn, checkOut);
        return ResponseEntity.ok(ApiResponse.ok("Hotels found", hotels));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelDto>> getHotelById(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        HotelDto hotel = hotelService.getHotelById(id, checkIn, checkOut);
        return ResponseEntity.ok(ApiResponse.ok("Hotel retrieved successfully", hotel));
    }

    @GetMapping("/{id}/quote")
    public ResponseEntity<ApiResponse<PriceBreakdownDto>> getPriceQuote(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) List<String> addOns) {
        PriceBreakdownDto quote = bookingService.calculatePrice(id, checkIn, checkOut, addOns);
        return ResponseEntity.ok(ApiResponse.ok("Price calculation successful", quote));
    }
}
