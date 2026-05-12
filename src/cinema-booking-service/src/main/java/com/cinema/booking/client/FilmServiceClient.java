package com.cinema.booking.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class FilmServiceClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${film.service.url:http://localhost:8081}")
    private String filmServiceUrl;
    
    public FilmServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    public boolean sessionExists(Long filmId, Long sessionId) {
        // Проверяем существование сессии по ID
        String url = filmServiceUrl + "/api/sessions/" + sessionId;
        System.out.println("Checking session: " + url);
        try {
            Object response = restTemplate.getForObject(url, Object.class);
            System.out.println("Session exists: " + (response != null));
            return response != null;
        } catch (Exception e) {
            System.out.println("Session check error: " + e.getMessage());
            return false;
        }
    }
}