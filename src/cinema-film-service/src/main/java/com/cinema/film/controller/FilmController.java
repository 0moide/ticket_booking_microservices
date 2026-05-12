package com.cinema.film.controller;

import com.cinema.film.entity.Film;
import com.cinema.film.service.FilmService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FilmController {

    private final FilmService filmService;

    public FilmController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping("/films")
    public List<Film> getAllFilms() {
        return filmService.getAllFilms();
    }

    @GetMapping("/films/{id}")
    public Film getFilmById(@PathVariable Long id) {
        return filmService.getFilmById(id);
    }

    @GetMapping("/films/with-sessions")
    public List<Film> getAllFilmsWithSessions() {
        return filmService.getAllFilms();
    }

    @PostMapping("/film/reset")
    public ResponseEntity<Map<String, String>> resetDatabase() {
        filmService.resetDatabase();
        return ResponseEntity.ok(Map.of("message", "Film Service database reset successfully"));
    }
}
