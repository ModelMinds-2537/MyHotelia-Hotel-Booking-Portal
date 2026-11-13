package com.hotelbooking.backend.repository;

import com.hotelbooking.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Hotel> searchByLocationOrName(@Param("query") String query);
}
