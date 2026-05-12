package com.cinema.booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import jakarta.persistence.Version;

@Entity
public class Seat {
    private int row;
    private int number;
    private SeatStatus status;
    private String name = null;
    private String email = null;
    private int seatNumber;
    private int key;

    @Transient
    private final Object lock = new Object();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Version
    private int version;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;

    protected Seat() {}

    public Seat(int row, int number) {
        this.row = row;
        this.number = number;
        this.status = SeatStatus.Available;
        this.seatNumber = row * 100 + number;
        this.key = 123;
    }

    public int getRow() { return row; }
    public void setRow(int row) {
        synchronized (lock){
            this.row = row;
        }
    }

    public int getNumber() { return number; }
    public void setNumber(int number) {
        synchronized (lock){
            this.number = number;
        }
    }

    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) {
        synchronized (lock){
            this.seatNumber = seatNumber;
        }
    }

    public SeatStatus getStatus() { return status; }
    public void setStatus(SeatStatus status) {
        synchronized (lock){
            this.status = status;
        }
    }

    public String getName() { return name; }
    public void setName(String name) { 
        synchronized (lock){
            this.name = name;
        }
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        synchronized (lock){
            this.email = email;
        }
    }

    public int getKey() { return key; }
    public void setKey(int key) {
        synchronized (lock){
            this.key = key;
        }
    }
    
    public long getId() { return id; }
    public void setId(int id) {
        synchronized (lock){
            this.id = id;
        }
    }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) {
        synchronized (lock){
            this.booking = booking;
        }
    }
}