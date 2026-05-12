package com.cinema.common.event;

import java.io.Serializable;

public class BookingEvent implements Serializable {
    private String type;
    private String email;
    private String userName;
    private Long filmId;
    private Long sessionId;
    private String seatsInfo;
    private String key;
    
    public BookingEvent() {}
    
    public BookingEvent(String type, String email, String userName, 
                        Long filmId, Long sessionId, String seatsInfo, String key) {
        this.type = type;
        this.email = email;
        this.userName = userName;
        this.filmId = filmId;
        this.sessionId = sessionId;
        this.seatsInfo = seatsInfo;
        this.key = key;
    }
    
    // Геттеры и сеттеры
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }
    
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    
    public String getSeatsInfo() { return seatsInfo; }
    public void setSeatsInfo(String seatsInfo) { this.seatsInfo = seatsInfo; }
    
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
}