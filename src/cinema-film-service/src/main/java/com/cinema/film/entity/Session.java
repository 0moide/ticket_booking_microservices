package com.cinema.film.entity;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Session {
    @Id
    @Column(name = "session_id")
    private long id;
    private LocalDateTime time;

    @ManyToOne
    @JoinColumn(name = "film_id") 
    @JsonIgnore
    private Film film; 

    private int hallNumber;

    protected Session() {}

    public Session(long id, LocalDateTime time, int hallNumber) {
        this.id = id;
        this.time = time;
        this.hallNumber = hallNumber;
    }

    // Геттеры и сеттеры
    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public int getHallNumber() { return hallNumber; }
    public void setHallNumber(int hallNumber) { this.hallNumber = hallNumber; }

    public Long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public Film getFilm() { return film; }
    public void setFilm(Film film) { this.film = film; }
}