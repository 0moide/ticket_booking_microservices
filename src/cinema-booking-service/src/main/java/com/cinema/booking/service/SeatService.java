package com.cinema.booking.service;

import com.cinema.booking.entity.Booking;
import com.cinema.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class SeatService {
    private final BookingRepository bookingRepository;

    public SeatService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Map<String, Object> getSeatingBySessionId(Long sessionId) {
        Map<String, Object> response = new HashMap<>();
        
        System.out.println("SeatService.getSeatingBySessionId: sessionId=" + sessionId);
        
        try {
            Booking booking = bookingRepository.findBySessionId(sessionId).orElse(null);
            
            if (booking != null) {
                response.put("seats", booking.getSeats());
                response.put("rows", booking.getRows());
                response.put("seatsPerRow", booking.getSeatsPerRow());
                response.put("hallNumber", 1);
                System.out.println("Found booking with " + booking.getSeats().size() + " seats");
            } else {
                System.err.println("No booking found for sessionId: " + sessionId);
                response.put("error", "Booking not found for session: " + sessionId);
                response.put("seats", new java.util.ArrayList<>());
                response.put("rows", 0);
                response.put("seatsPerRow", 0);
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            response.put("error", e.getMessage());
            response.put("seats", new java.util.ArrayList<>());
            response.put("rows", 0);
            response.put("seatsPerRow", 0);
        }
        
        return response;
    }
}