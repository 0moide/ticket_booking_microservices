package com.cinema.film.entity;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Film {
    @Id
    private Long id;
    private String title;
    private String description;
    private List<String> genre;
    private int duration;
    private String posterFileName;
    private int minAge;

    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL)
    private List<Session> sessions = new ArrayList<>();

    protected Film() {}
    
    public Film(Long id, String title, String description, List<String> genre, 
                int duration, String posterFileName, int minAge) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.duration = duration;
        this.posterFileName = posterFileName;
        this.minAge = minAge;
    }
    
    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<String> getGenre() { return genre; }
    public void setGenre(List<String> genre) { this.genre = genre; }
    
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    
    public String getPosterFileName() { return posterFileName; }
    public void setPosterFileName(String posterFileName) { this.posterFileName = posterFileName; }
    
    public int getMinAge() { return minAge; }
    public void setMinAge(int minAge) { this.minAge = minAge; }

    public List<Session> getSessions() { return sessions; }
    public void setSessions(List<Session> sessions) { this.sessions = sessions; } 
    
    public String getPosterUrl() {
        return "/images/posters/" + posterFileName;
    }
}