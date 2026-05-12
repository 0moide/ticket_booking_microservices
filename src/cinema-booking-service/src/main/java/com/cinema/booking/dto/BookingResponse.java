package com.cinema.booking.dto;

public class BookingResponse {
    private boolean success;
    private Integer key;
    
    public BookingResponse(boolean success, Integer key) {
        this.success = success;
        this.key = key;
    }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public Integer getKey() { return key; }
    public void setKey(Integer key) { this.key = key; }
}