package com.cinema.film.dto;

import java.time.LocalDateTime;

public class SessionDto {
    private Long id;
    private LocalDateTime time;
    private int hallNumber;

    public SessionDto() {}

    public SessionDto(Long id, LocalDateTime time, int hallNumber) {
        this.id = id;
        this.time = time;
        this.hallNumber = hallNumber;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public int getHallNumber() { return hallNumber; }
    public void setHallNumber(int hallNumber) { this.hallNumber = hallNumber; }
}