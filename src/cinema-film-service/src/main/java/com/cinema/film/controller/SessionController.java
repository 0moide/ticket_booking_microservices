package com.cinema.film.controller;

import com.cinema.film.entity.Session;
import com.cinema.film.service.FilmService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SessionController {

    private final FilmService filmService;

    public SessionController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping("/sessions/{sessionId}")
    public Session getSessionById(@PathVariable Long sessionId) {
        return filmService.getSessionById(sessionId);
    }

    @GetMapping("/sessions/check")
    public boolean sessionExists(@RequestParam Long filmId, @RequestParam Long sessionId) {
        Session session = filmService.getSessionById(sessionId);
        return session != null && session.getFilm().getId().equals(filmId);
    }
}