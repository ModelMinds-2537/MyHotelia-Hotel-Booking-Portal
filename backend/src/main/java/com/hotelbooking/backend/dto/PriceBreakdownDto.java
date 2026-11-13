package com.hotelbooking.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

public class PriceBreakdownDto {

    private int numberOfNights;
    private BigDecimal pricePerNight;
    private BigDecimal roomSubtotal;
    private BigDecimal taxRatePercent;
    private BigDecimal taxAmount;
    private BigDecimal addOnsSubtotal;
    private Map<String, BigDecimal> addOnsBreakdown;
    private BigDecimal totalAmount;
    private boolean available;
    private int availableRooms;

    public PriceBreakdownDto() {
    }

    public int getNumberOfNights() {
        return numberOfNights;
    }

    public void setNumberOfNights(int numberOfNights) {
        this.numberOfNights = numberOfNights;
    }

    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public BigDecimal getRoomSubtotal() {
        return roomSubtotal;
    }

    public void setRoomSubtotal(BigDecimal roomSubtotal) {
        this.roomSubtotal = roomSubtotal;
    }

    public BigDecimal getTaxRatePercent() {
        return taxRatePercent;
    }

    public void setTaxRatePercent(BigDecimal taxRatePercent) {
        this.taxRatePercent = taxRatePercent;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getAddOnsSubtotal() {
        return addOnsSubtotal;
    }

    public void setAddOnsSubtotal(BigDecimal addOnsSubtotal) {
        this.addOnsSubtotal = addOnsSubtotal;
    }

    public Map<String, BigDecimal> getAddOnsBreakdown() {
        return addOnsBreakdown;
    }

    public void setAddOnsBreakdown(Map<String, BigDecimal> addOnsBreakdown) {
        this.addOnsBreakdown = addOnsBreakdown;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }
}
