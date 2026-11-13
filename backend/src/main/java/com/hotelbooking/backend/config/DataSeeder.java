package com.hotelbooking.backend.config;

import com.hotelbooking.backend.model.Hotel;
import com.hotelbooking.backend.repository.HotelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final HotelRepository hotelRepository;

    public DataSeeder(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public void run(String... args) {
        List<Hotel> existing = hotelRepository.findAll();

        if (existing.isEmpty()) {
            List<Hotel> hotels = getSeedHotels();
            hotelRepository.saveAll(hotels);
            return;
        }

        // Check if existing prices are in old USD values (< 1000); if so, update to INR
        boolean needsUpdate = existing.stream().anyMatch(h -> h.getPricePerNight().compareTo(BigDecimal.valueOf(1000.00)) < 0);
        if (needsUpdate) {
            for (Hotel h : existing) {
                if (h.getName().contains("Grand Heritage")) {
                    h.setPricePerNight(BigDecimal.valueOf(8500.00));
                } else if (h.getName().contains("Azure Bay")) {
                    h.setPricePerNight(BigDecimal.valueOf(11500.00));
                } else if (h.getName().contains("Skyline Metropole")) {
                    h.setPricePerNight(BigDecimal.valueOf(9500.00));
                } else if (h.getName().contains("Pine Crest")) {
                    h.setPricePerNight(BigDecimal.valueOf(6800.00));
                } else if (h.getName().contains("Serene Lakefront")) {
                    h.setPricePerNight(BigDecimal.valueOf(14200.00));
                } else if (h.getName().contains("Emerald Valley")) {
                    h.setPricePerNight(BigDecimal.valueOf(7500.00));
                }
            }
            hotelRepository.saveAll(existing);
        }
    }

    private List<Hotel> getSeedHotels() {
        return Arrays.asList(
                new Hotel(
                        "The Grand Heritage Palace",
                        "Jaipur",
                        "Amer Road, Jaipur, Rajasthan",
                        "Step into royal indulgence at The Grand Heritage Palace. Featuring traditional Rajput architecture, handcrafted jharokhas, lush landscaped courtyards, and exceptional world-class hospitality, this sanctuary offers a majestic gateway into Rajasthan's golden era.",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                        4.9,
                        412,
                        "Free High-Speed Wi-Fi, Royal Spa & Ayurvedic Wellness, Heated Infinity Pool, Fine Dining Heritage Restaurant, 24/7 Butler Service, Airport Limousine, Valet Parking",
                        "Royal Maharaja Suite",
                        "520 sq ft suite featuring an antique four-poster king bed, private garden courtyard, handcrafted marble bathroom, and panoramic Aravali hill views.",
                        BigDecimal.valueOf(8500.00),
                        5,
                        "Royal luxury nestled in the historic pink city",
                        "26°C Sunny, Clear skies & pleasant evening breeze",
                        "Amber Fort (2.5 km), Hawa Mahal (4.0 km), City Palace (4.5 km), Jal Mahal (1.8 km)"
                ),
                new Hotel(
                        "Azure Bay Beachfront Resort",
                        "Goa",
                        "Candolim Beach Road, North Goa",
                        "Unwind where pristine golden sands meet turquoise Arabian waves. Azure Bay features tranquil private cabanas, oceanfront infinity pools, and sunset dining under swaying palm canopies.",
                        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
                        4.8,
                        534,
                        "Private Beach Cabanas, Oceanfront Infinity Pool, Sunset Cocktail Bar, Water Sports Center, Free Wi-Fi, Fresh Seafood Grill, Daily Yoga Sessions",
                        "Panoramic Oceanview King Villa",
                        "480 sq ft beachfront villa with private sun deck, floor-to-ceiling glass doors opening directly to the ocean breeze, and a soaking tub.",
                        BigDecimal.valueOf(11500.00),
                        4,
                        "Idyllic coastal haven with private beach access & ocean sunsets",
                        "29°C Tropical Breeze, Warm waters & golden sunsets",
                        "Candolim Beach (0.2 km), Fort Aguada (3.5 km), Baga Beach (5.2 km), Chapora Fort (8.0 km)"
                ),
                new Hotel(
                        "The Skyline Metropole Hotel",
                        "Mumbai",
                        "Nariman Point, South Mumbai, Maharashtra",
                        "A landmark of contemporary elegance in South Mumbai's prestigious financial and cultural district. Enjoy soaring cityscape views, bespoke guest experiences, and easy access to Marine Drive.",
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                        4.7,
                        688,
                        "Rooftop Sky Lounge, Olympic Lap Pool, High-Tech Business Hub, Luxury Spa, Free High-Speed Wi-Fi, 24/7 In-Room Dining, Concierge Service",
                        "Executive Skyline Club Room",
                        "420 sq ft room featuring floor-to-ceiling bay windows overlooking the Arabian Sea, ergonomic work desk, Italian marble bathroom, and club lounge access.",
                        BigDecimal.valueOf(9500.00),
                        6,
                        "Sophisticated cosmopolitan luxury overlooking the Arabian Sea",
                        "28°C Pleasant, Coastal breeze & clear skylines",
                        "Marine Drive (0.5 km), Gateway of India (2.8 km), Colaba Causeway (3.1 km), National Centre for Performing Arts (0.4 km)"
                ),
                new Hotel(
                        "Pine Crest Alpine Sanctuary",
                        "Manali",
                        "Old Manali Road, Manali, Himachal Pradesh",
                        "Perched amidst ancient deodar forests with unobstructed views of snow-draped Himalayan peaks, Pine Crest blends rustic wooden lodge charm with modern luxury.",
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                        4.9,
                        328,
                        "Fireplace Living Lounge, Mountain Trekking Guide, Heated Indoor Pool, Organic Farm-to-Table Dining, Free Wi-Fi, Bonfire & Stargazing Deck",
                        "Himalayan Cedar Log Chalet",
                        "460 sq ft wooden chalet crafted from aromatic cedar timber, featuring an authentic stone fireplace, private balcony facing snow peaks, and heated floors.",
                        BigDecimal.valueOf(6800.00),
                        5,
                        "Breathtaking cedar forest retreat with majestic Himalayan views",
                        "14°C Crisp Alpine, Fresh mountain air & starry clear nights",
                        "Hadimba Temple (1.2 km), Manu Temple (0.8 km), Jogini Waterfall (4.2 km), Solang Valley (9.5 km)"
                ),
                new Hotel(
                        "Serene Lakefront Palace",
                        "Udaipur",
                        "Lake Pichola Eastern Banks, Udaipur, Rajasthan",
                        "Bathed in legendary romance, Serene Lakefront Palace floats like a pearl over the shimmering waters of Lake Pichola. Enjoy private gondola arrivals and royal courtyard dinners.",
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                        5.0,
                        295,
                        "Private Boat Transfers, Lakeview Rooftop Dining, Aromatherapy Spa, Candlelight Dinners, Butler Service, Swimming Pool, Complimentary High Tea",
                        "Lakeview Royal Haven",
                        "550 sq ft luxury haven with bay window seating over the water, hand-painted frescoes, antique brass fixtures, and a Jacuzzi overlooking the lake.",
                        BigDecimal.valueOf(14200.00),
                        3,
                        "Timeless romance floating amidst shimmering waters of Lake Pichola",
                        "25°C Warm Days, Gentle lake breeze in the evening",
                        "Lake Pichola (0.1 km), City Palace Udaipur (0.8 km), Jag Mandir (0.9 km), Bagore Ki Haveli (0.6 km)"
                ),
                new Hotel(
                        "Emerald Valley Tea Plantation Villa",
                        "Munnar",
                        "Chithirapuram Post, Munnar, Kerala",
                        "Nestled within 100 acres of emerald tea slopes and misty valleys, this colonial plantation manor offers rejuvenating mountain tranquility and aromatic tea garden walks.",
                        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
                        4.8,
                        210,
                        "Guided Tea Tasting Tours, Mountain View Balcony, Ayurvedic Wellness Center, Nature Trail Excursions, Free Wi-Fi, Traditional Kerala Cuisine",
                        "Misty Valley Colonial Suite",
                        "440 sq ft heritage suite featuring teakwood furnishings, tea plantation views from bed, rainfall shower, and afternoon tea service.",
                        BigDecimal.valueOf(7500.00),
                        4,
                        "Serene hillside colonial manor surrounded by misty tea gardens",
                        "19°C Gentle Mist, Refreshing mountain showers & crisp air",
                        "Tea Museum (4.5 km), Attukad Waterfalls (3.0 km), Mattupetty Dam (10 km), Pothamedu Viewpoint (5.0 km)"
                )
        );
    }
}
