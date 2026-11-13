package com.hotelbooking.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Integer reviewCount;

    @Column(length = 500, nullable = false)
    private String amenities;

    @Column(nullable = false, length = 100)
    private String roomType;

    @Column(length = 500)
    private String roomDescription;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(nullable = false)
    private Integer totalRooms;

    @Column(length = 200)
    private String tagline;

    @Column(length = 200)
    private String weatherGuide;

    @Column(length = 500)
    private String topAttractions;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Hotel() {
    }

    public Hotel(String name, String city, String location, String description, String imageUrl,
                 Double rating, Integer reviewCount, String amenities, String roomType,
                 String roomDescription, BigDecimal pricePerNight, Integer totalRooms,
                 String tagline, String weatherGuide, String topAttractions) {
        this.name = name;
        this.city = city;
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.amenities = amenities;
        this.roomType = roomType;
        this.roomDescription = roomDescription;
        this.pricePerNight = pricePerNight;
        this.totalRooms = totalRooms;
        this.tagline = tagline;
        this.weatherGuide = weatherGuide;
        this.topAttractions = topAttractions;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getRoomDescription() {
        return roomDescription;
    }

    public void setRoomDescription(String roomDescription) {
        this.roomDescription = roomDescription;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getWeatherGuide() {
        return weatherGuide;
    }

    public void setWeatherGuide(String weatherGuide) {
        this.weatherGuide = weatherGuide;
    }

    public String getTopAttractions() {
        return topAttractions;
    }

    public void setTopAttractions(String topAttractions) {
        this.topAttractions = topAttractions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
