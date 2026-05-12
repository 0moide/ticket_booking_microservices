package com.cinema.film.service;

import com.cinema.film.entity.Film;
import com.cinema.film.entity.Session;
import com.cinema.film.repository.FilmRepository;
import com.cinema.film.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FilmService {
    private final FilmRepository filmRepository;
    private final SessionRepository sessionRepository;
    private Long currentFilmId = 1L;
    private Long currentSessionId = 1L;

    public FilmService(FilmRepository filmRepository, SessionRepository sessionRepository) {
        this.filmRepository = filmRepository;
        this.sessionRepository = sessionRepository;
        initializeFilms();
        addSessions();
    }

    @Transactional
    public void initializeFilms() {
        if (filmRepository.count() > 0) {
            return;
        }
        ArrayList<String> genres = new ArrayList<>();
        genres.add("Научная фантастика");
        genres.add("Приключения");
        Film film1 = new Film(currentFilmId++, "Интерстеллар", 
                "Фантастический эпос про задыхающуюся Землю, космические полеты и парадоксы времени", 
                genres, 169, 
                "interstellar.jpg", 16);
        filmRepository.save(film1);

        genres = new ArrayList<>();
        genres.add("Биография");
        genres.add("Драма");
        Film film2 = new Film(currentFilmId++, "Оппенгеймер", 
                "История создания атомной бомбы.", 
                genres, 180, 
                "oppenheimer.jpg", 18);
        filmRepository.save(film2);
        
        genres = new ArrayList<>();
        genres.add("Приключения");
        genres.add("Боевик");
        genres.add("Драма");
        Film film3 = new Film(currentFilmId++, "Человек-бензопила: история Резе", 
                "Новые приключения Дендзи", 
                genres, 100, 
                "chainsaw_man.jpg", 18);
        filmRepository.save(film3);
        
        genres = new ArrayList<>();
        genres.add("Боевик");
        Film film4 = new Film(currentFilmId++, "Крепкий орешек", 
                "Классический боевик с Брюсом Уиллисом.", 
                genres, 132, 
                "default.jpg", 16);
        filmRepository.save(film4);
    }

    @Transactional
    public void addSessions() {
        List<Film> films = filmRepository.findAll();
        
        // Интерстеллар (id = 1)
        Film film1 = films.get(0);
        List<Session> sessions1 = new ArrayList<>();
        
        Session session1 = new Session(currentSessionId++, LocalDateTime.now().withHour(15).withMinute(30), 1);
        session1.setFilm(film1);
        sessionRepository.save(session1);
        sessions1.add(session1);
        
        Session session2 = new Session(currentSessionId++, LocalDateTime.now().plusDays(1).withHour(17).withMinute(30), 1);
        session2.setFilm(film1);
        sessionRepository.save(session2);
        sessions1.add(session2);
        
        Session session3 = new Session(currentSessionId++, LocalDateTime.now().plusDays(3).withHour(13).withMinute(30), 1);
        session3.setFilm(film1);
        sessionRepository.save(session3);
        sessions1.add(session3);
        
        film1.setSessions(sessions1);
        filmRepository.save(film1);
        
        // Оппенгеймер (id = 2)
        Film film2 = films.get(1);
        List<Session> sessions2 = new ArrayList<>();
        
        Session session4 = new Session(currentSessionId++, LocalDateTime.now().withHour(15).withMinute(30), 2);
        session4.setFilm(film2);
        sessionRepository.save(session4);
        sessions2.add(session4);
        
        Session session5 = new Session(currentSessionId++, LocalDateTime.now().plusDays(1).withHour(17).withMinute(30), 2);
        session5.setFilm(film2);
        sessionRepository.save(session5);
        sessions2.add(session5);
        
        Session session6 = new Session(currentSessionId++, LocalDateTime.now().plusDays(2).withHour(19).withMinute(30), 2);
        session6.setFilm(film2);
        sessionRepository.save(session6);
        sessions2.add(session6);
        
        film2.setSessions(sessions2);
        filmRepository.save(film2);
        
        // Человек-бензопила (id = 3)
        Film film3 = films.get(2);
        List<Session> sessions3 = new ArrayList<>();
        
        Session session7 = new Session(currentSessionId++, LocalDateTime.now().withHour(9).withMinute(30), 1);
        session7.setFilm(film3);
        sessionRepository.save(session7);
        sessions3.add(session7);
        
        Session session8 = new Session(currentSessionId++, LocalDateTime.now().plusDays(1).withHour(11).withMinute(30), 1);
        session8.setFilm(film3);
        sessionRepository.save(session8);
        sessions3.add(session8);
        
        Session session9 = new Session(currentSessionId++, LocalDateTime.now().plusDays(5).withHour(13).withMinute(30), 1);
        session9.setFilm(film3);
        sessionRepository.save(session9);
        sessions3.add(session9);
        
        film3.setSessions(sessions3);
        filmRepository.save(film3);
        
        // Крепкий орешек (id = 4)
        Film film4 = films.get(3);
        List<Session> sessions4 = new ArrayList<>();
        
        Session session10 = new Session(currentSessionId++, LocalDateTime.now().withHour(9).withMinute(30), 2);
        session10.setFilm(film4);
        sessionRepository.save(session10);
        sessions4.add(session10);
        
        Session session11 = new Session(currentSessionId++, LocalDateTime.now().plusDays(1).withHour(11).withMinute(30), 2);
        session11.setFilm(film4);
        sessionRepository.save(session11);
        sessions4.add(session11);
        
        Session session12 = new Session(currentSessionId++, LocalDateTime.now().plusDays(3).withHour(13).withMinute(30), 2);
        session12.setFilm(film4);
        sessionRepository.save(session12);
        sessions4.add(session12);
        
        film4.setSessions(sessions4);
        filmRepository.save(film4);
    }

    public List<Film> getAllFilms() {
        return new ArrayList<>(filmRepository.findAll());
    }
    
    public Film getFilmById(Long id) {
        return filmRepository.findById(id).orElse(null);
    }

    public Session getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId).orElse(null);
    }

    public String getSessionTime(Long sessionId) {
        Session session = getSessionById(sessionId);
        if (session == null) return "";
        return session.getTime().toString();
    }

    public int getHallNumber(Long sessionId) {
        Session session = getSessionById(sessionId);
        if (session == null) return -1;
        return session.getHallNumber();
    }

    @Transactional
    public void resetDatabase() {
        System.out.println("Resetting Film Service database...");
        
        // Удаляем все сеансы
        sessionRepository.deleteAll();
        // Удаляем все фильмы
        filmRepository.deleteAll();
        
        // Сбрасываем счётчики ID (если нужно)
        currentFilmId = 1L;
        currentSessionId = 1L;
        
        // Создаём заново
        initializeFilms();
        addSessions();
        
        System.out.println("Film Service database reset completed");
    }
}