package com.cinema.notification.controller;

import com.cinema.notification.dto.EmailRequest;
import com.cinema.notification.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @PostMapping("/email")
    public ResponseEntity<Void> sendEmail(@RequestBody EmailRequest request) {
        emailService.sendSimpleEmail(request.getTo(), request.getSubject(), request.getBody());
        return ResponseEntity.ok().build();
    }
}