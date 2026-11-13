package com.hotelbooking.backend.service;

import com.hotelbooking.backend.dto.HotelDto;
import com.hotelbooking.backend.exception.ResourceNotFoundException;
import com.hotelbooking.backend.model.Booking;
import com.hotelbooking.backend.model.BookingStatus;
import com.hotelbooking.backend.model.Hotel;
import com.hotelbooking.backend.repository.BookingRepository;
import com.hotelbooking.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HotelService {

    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;

    public HotelService(HotelRepository hotelRepository, BookingRepository bookingRepository) {
        this.hotelRepository = hotelRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<HotelDto> getAllHotels(LocalDate checkIn, LocalDate checkOut) {
        List<Hotel> hotels = hotelRepository.findAll();
        return hotels.stream()
                .map(hotel -> mapToDto(hotel, checkIn, checkOut))
                .collect(Collectors.toList());
    }

    public List<HotelDto> searchHotels(String query, LocalDate checkIn, LocalDate checkOut) {
        List<Hotel> hotels;
        if (query == null || query.trim().isEmpty()) {
            hotels = hotelRepository.findAll();
        } else {
            hotels = hotelRepository.searchByLocationOrName(query.trim());
        }
        return hotels.stream()
                .map(hotel -> mapToDto(hotel, checkIn, checkOut))
                .collect(Collectors.toList());
    }

    public HotelDto getHotelById(Long id, LocalDate checkIn, LocalDate checkOut) {
        Hotel hotel = getHotelEntity(id);
        return mapToDto(hotel, checkIn, checkOut);
    }

    public Hotel getHotelEntity(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public int calculateAvailableRooms(Long hotelId, Integer totalRooms, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            // Default to total rooms when dates are not specified or invalid
            return totalRooms;
        }

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                hotelId,
                BookingStatus.CONFIRMED,
                checkIn,
                checkOut
        );

        if (overlapping.isEmpty()) {
            return totalRooms;
        }

        int maxBookedOnAnyDay = 0;
        LocalDate cur = checkIn;
        while (cur.isBefore(checkOut)) {
            final LocalDate day = cur;
            int bookedOnDay = (int) overlapping.stream()
                    .filter(b -> !day.isBefore(b.getCheckInDate()) && day.isBefore(b.getCheckOutDate()))
                    .mapToInt(Booking::getNumberOfRooms)
                    .sum();
            if (bookedOnDay > maxBookedOnAnyDay) {
                maxBookedOnAnyDay = bookedOnDay;
            }
            cur = cur.plusDays(1);
        }

        int available = totalRooms - maxBookedOnAnyDay;
        return Math.max(available, 0);
    }

    public HotelDto mapToDto(Hotel hotel, LocalDate checkIn, LocalDate checkOut) {
        HotelDto dto = new HotelDto();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setCity(hotel.getCity());
        dto.setLocation(hotel.getLocation());
        dto.setDescription(hotel.getDescription());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setRating(hotel.getRating());
        dto.setReviewCount(hotel.getReviewCount());
        dto.setRoomType(hotel.getRoomType());
        dto.setRoomDescription(hotel.getRoomDescription());
        dto.setPricePerNight(hotel.getPricePerNight());
        dto.setTotalRooms(hotel.getTotalRooms());
        dto.setTagline(hotel.getTagline());
        dto.setWeatherGuide(hotel.getWeatherGuide());

        if (hotel.getAmenities() != null) {
            dto.setAmenities(Arrays.stream(hotel.getAmenities().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setAmenities(Collections.emptyList());
        }

        if (hotel.getTopAttractions() != null) {
            dto.setTopAttractions(Arrays.stream(hotel.getTopAttractions().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setTopAttractions(Collections.emptyList());
        }

        int available = calculateAvailableRooms(hotel.getId(), hotel.getTotalRooms(), checkIn, checkOut);
        dto.setAvailableRooms(available);

        return dto;
    }
}
