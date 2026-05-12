package com.cinema.booking.controller;

import com.cinema.booking.event.BookingEventProducer;
import com.cinema.booking.service.BookingService;
import com.cinema.booking.service.SeatService;
import com.cinema.common.event.BookingEvent;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;
    private final SeatService seatService;
    private final BookingEventProducer eventProducer;

    public BookingController(BookingService bookingService, 
                             SeatService seatService,
                             BookingEventProducer eventProducer) {
        this.bookingService = bookingService;
        this.seatService = seatService;
        this.eventProducer = eventProducer;
    }

    @GetMapping("/films/{filmId}/sessions/{sessionId}/seats")
    public ResponseEntity<Map<String, Object>> getSeatsBySessionId(
            @PathVariable("filmId") Long filmId,
            @PathVariable("sessionId") Long sessionId) {
        
        System.out.println("GET /films/" + filmId + "/sessions/" + sessionId + "/seats");
        
        Map<String, Object> seating = seatService.getSeatingBySessionId(sessionId);
        seating.put("filmId", filmId);
        seating.put("sessionId", sessionId);
        return ResponseEntity.ok(seating);
    }

    @PostMapping("/films/{filmId}/sessions/{sessionId}/seats/reserve-multiple")
    public ResponseEntity<Map<String, Object>> reserveMultipleSeats(
            @PathVariable("filmId") Long filmId,
            @PathVariable("sessionId") Long sessionId,
            @RequestBody Map<String, Object> request) {
        
        String userName = (String) request.get("userName");
        String userEmail = (String) request.get("userEmail");
        @SuppressWarnings("unchecked")
        java.util.List<Integer> seatNumbers = (java.util.List<Integer>) request.get("seatNumbers");
        
        System.out.println("POST reserve: filmId=" + filmId + ", sessionId=" + sessionId + ", seats=" + seatNumbers);
        
        int key = bookingService.reserveMultipleSeats(filmId, sessionId, seatNumbers, userName, userEmail);
        
        if (key != 0) {
            // Формируем информацию о местах
            String seatsInfo = seatNumbers.toString();
            
            // Отправляем событие в Kafka
            BookingEvent event = new BookingEvent(
                "RESERVATION", userEmail, userName, 
                filmId, sessionId, seatsInfo, String.valueOf(key)
            );
            eventProducer.sendBookingEvent(event);
            
            return ResponseEntity.ok(Map.of("success", true, "key", key));
        }
        return ResponseEntity.ok(Map.of("success", false));
    }

    @PostMapping("/films/{filmId}/sessions/{sessionId}/seats/unreserve-multiple")
    public ResponseEntity<Map<String, Object>> unreserveMultipleSeats(
            @PathVariable("filmId") Long filmId,
            @PathVariable("sessionId") Long sessionId,
            @RequestBody Map<String, Object> request) {
        
        String key = (String) request.get("key");
        
        System.out.println("POST unreserve: filmId=" + filmId + ", sessionId=" + sessionId + ", key=" + key);
        
        // Получаем email до отмены бронирования
        String email = bookingService.getEmailByKey(sessionId, key);
        boolean success = bookingService.unreserveMultipleSeats(sessionId, key);
        
        if (success && email != null && !email.isEmpty()) {
            // Отправляем событие отмены в Kafka
            BookingEvent event = new BookingEvent(
                "CANCELLATION", email, "", 
                filmId, sessionId, "", key
            );
            eventProducer.sendBookingEvent(event);
            
            return ResponseEntity.ok(Map.of("success", true));
        }
        
        return ResponseEntity.ok(Map.of("success", false));
    }

    @PostMapping("/booking/reset")
    public ResponseEntity<Map<String, String>> resetDatabase() {
        System.out.println("!!!!!!!!!! BOOKING RESET ENDPOINT HIT !!!!!!!!!!");
        bookingService.resetDatabase();
        return ResponseEntity.ok(Map.of("message", "Booking Service database reset successfully"));
    }
}