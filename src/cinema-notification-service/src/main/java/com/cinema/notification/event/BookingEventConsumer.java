package com.cinema.notification.event;

import com.cinema.common.event.BookingEvent;
import com.cinema.notification.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class BookingEventConsumer {
    
    @Autowired
    private EmailService emailService;
    
    @KafkaListener(topics = "booking-events", groupId = "notification-group")
    public void consume(BookingEvent event) {
        System.out.println("=== Received event from Kafka ===");
        System.out.println("Type: " + event.getType());
        System.out.println("Email: " + event.getEmail());
        
        if ("RESERVATION".equals(event.getType())) {
            String subject = "Подтверждение бронирования - Кинотеатр CINEMA";
            String body = String.format(
                "Здравствуйте, %s!\n\n" +
                "Вы успешно забронировали билеты.\n" +
                "Места: %s\n" +
                "Ключ для отмены: %s\n\n" +
                "С уважением,\nКинотеатр CINEMA",
                event.getUserName(), event.getSeatsInfo(), event.getKey()
            );
            emailService.sendSimpleEmail(event.getEmail(), subject, body);
            
        } else if ("CANCELLATION".equals(event.getType())) {
            String subject = "Отмена бронирования - Кинотеатр CINEMA";
            String body = String.format(
                "Здравствуйте!\n\n" +
                "Ваше бронирование (ключ: %s) было успешно отменено.\n\n" +
                "С уважением,\nКинотеатр CINEMA",
                event.getKey()
            );
            emailService.sendSimpleEmail(event.getEmail(), subject, body);
        }
    }
}