package com.cinema.booking.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;

@Entity
public class Booking {
    private int quantitySeats;
    private int rows;
    private int seatsPerRow;
    
    @Id
    private long id;
    
    private Long sessionId;  // ← вместо связи с Session
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
        name = "booking_seats_map",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "seat_id")
    )
    private List<Seat> seats = new ArrayList<>();

    protected Booking() {}

    public Booking(long id, Long sessionId, int quantityRow, int quantityNumber) {
        this.id = id;
        this.sessionId = sessionId;
        this.rows = quantityRow;
        this.seatsPerRow = quantityNumber;
        this.quantitySeats = quantityRow * quantityNumber;
        this.seats = new ArrayList<>(this.quantitySeats);
        
        for (int i = 0; i < this.quantitySeats; ++i) {
            Seat seat = new Seat(i / quantityNumber + 1, i % quantityNumber + 1);
            seat.setBooking(this);
            this.seats.add(seat);
        }
    }
    
    public List<Seat> getSeats() { return seats; }
    public int getRows() { return rows; }
    public int getSeatsPerRow() { return seatsPerRow; }
    public int getQuantitySeats() { return quantitySeats; }
    public long getId() { return id; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
}