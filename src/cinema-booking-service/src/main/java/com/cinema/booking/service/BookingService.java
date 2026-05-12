package com.cinema.booking.service;

import com.cinema.booking.client.FilmServiceClient;
import com.cinema.booking.entity.Booking;
import com.cinema.booking.entity.Seat;
import com.cinema.booking.entity.SeatStatus;
import com.cinema.booking.repository.BookingRepository;
import com.cinema.booking.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final FilmServiceClient filmServiceClient;
    private Long currentBookingId = 1L;

    public BookingService(BookingRepository bookingRepository, 
                          SeatRepository seatRepository,
                          FilmServiceClient filmServiceClient) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.filmServiceClient = filmServiceClient;
        initializeBookings();
    }

    @Transactional
    public void initializeBookings() {
        // Проверяем, есть ли уже данные
        if (bookingRepository.count() > 0) {
            System.out.println("Bookings already exist, skipping initialization");
            return;
        }

        System.out.println("Initializing bookings for all sessions...");

        // Сеансы от Film Service (id 1-12)
        // Нужно создать Booking для каждого sessionId
        
        // Зал 1 (ряды 5, мест 10) — для sessionId 1,2,3,7,8,9
        // Зал 2 (ряды 5, мест 10) — для sessionId 4,5,6,10,11,12
        
        // Session 1-3: Интерстеллар, зал 1
        createBooking(1L, 5, 10);
        createBooking(2L, 5, 10);
        createBooking(3L, 5, 10);
        
        // Session 4-6: Оппенгеймер, зал 2
        createBooking(4L, 5, 10);
        createBooking(5L, 5, 10);
        createBooking(6L, 5, 10);
        
        // Session 7-9: Человек-бензопила, зал 1
        createBooking(7L, 5, 10);
        createBooking(8L, 5, 10);
        createBooking(9L, 5, 10);
        
        // Session 10-12: Крепкий орешек, зал 2
        createBooking(10L, 5, 10);
        createBooking(11L, 5, 10);
        createBooking(12L, 5, 10);
        
        System.out.println("All bookings initialized successfully");
    }

    @Transactional
    public void createBooking(Long sessionId, int rows, int seatsPerRow) {
        Booking booking = new Booking(currentBookingId++, sessionId, rows, seatsPerRow);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        for (Seat seat : savedBooking.getSeats()) {
            seat.setBooking(savedBooking);
            seatRepository.save(seat);
        }
        
        System.out.println("Created booking for session " + sessionId + " with " + (rows * seatsPerRow) + " seats");
    }

    @Transactional
    public int reserveMultipleSeats(Long filmId, Long sessionId, 
                                    List<Integer> seatNumbers, 
                                    String userName, String userEmail) {
        // Проверяем существование сессии через Film Service
        if (!filmServiceClient.sessionExists(filmId, sessionId)) {
            return 0;
        }
        
        Booking booking = bookingRepository.findBySessionId(sessionId).orElse(null);
        if (booking == null) return 0;
        
        List<Seat> seatsToReserve = new ArrayList<>();
        int key = Integer.parseInt(CodeGenerator.generateNumericCode());
        
        for (int seatNumber : seatNumbers) {
            for (Seat seat : booking.getSeats()) {
                if (seat.getSeatNumber() == seatNumber && seat.getStatus() == SeatStatus.Available) {
                    seat.setStatus(SeatStatus.Reserved);
                    seat.setName(userName);
                    seat.setEmail(userEmail);
                    seat.setKey(key);
                    seatsToReserve.add(seat);
                    break;
                }
            }
        }
        
        if (!seatsToReserve.isEmpty()) {
            seatRepository.saveAll(seatsToReserve);
            return key;
        }
        return 0;
    }

    @Transactional
    public boolean unreserveMultipleSeats(Long sessionId, String key) {
        int digitalKey;
        try {
            digitalKey = Integer.parseInt(key);
        } catch (Exception e) {
            return false;
        }

        Booking booking = bookingRepository.findBySessionId(sessionId).orElse(null);
        if (booking == null) return false;

        List<Seat> seatsToUnreserve = new ArrayList<>();

        for (Seat seat : booking.getSeats()) {
            if (seat.getKey() == digitalKey && seat.getStatus() == SeatStatus.Reserved) {
                seat.setStatus(SeatStatus.Available);
                seatsToUnreserve.add(seat);
            }
        }
        
        if (!seatsToUnreserve.isEmpty()) {
            seatRepository.saveAll(seatsToUnreserve);
            return true;
        }
        return false;
    }

    public String getEmailByKey(Long sessionId, String key) {
        int digitalKey;
        try {
            digitalKey = Integer.parseInt(key);
        } catch (Exception e) {
            return null;
        }

        Booking booking = bookingRepository.findBySessionId(sessionId).orElse(null);
        if (booking == null) return null;

        for (Seat seat : booking.getSeats()) {
            if (seat.getKey() == digitalKey && seat.getStatus() == SeatStatus.Reserved) {
                return seat.getEmail();
            }
        }
        return null;
    }

    @Transactional
    public void resetDatabase() {
        System.out.println("!!!!!!!!!! BOOKING RESET CALLED !!!!!!!!!!");
        
        // Удаляем все места
        seatRepository.deleteAll();
        // Удаляем все бронирования
        bookingRepository.deleteAll();
        
        // Сбрасываем счётчик ID
        currentBookingId = 1L;
        
        // Создаём заново
        initializeBookings();
        
        System.out.println("Booking Service database reset completed");
    }
}