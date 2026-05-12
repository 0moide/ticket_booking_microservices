package com.cinema.booking.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.cinema.common.event.BookingEvent;

@Component
public class BookingEventProducer {
    
    private static final String TOPIC = "booking-events";
    
    @Autowired
    private KafkaTemplate<String, BookingEvent> kafkaTemplate;
    
    public void sendBookingEvent(BookingEvent event) {
        kafkaTemplate.send(TOPIC, event);
        System.out.println("Sent event to Kafka: " + event.getType() + " for " + event.getEmail());
    }
}