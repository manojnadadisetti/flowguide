package com.flowguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "video_tutorials")
public class VideoTutorial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "course", nullable = false, length = 50)
    private String course;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration", nullable = false, length = 50)
    private String duration;

    @Column(name = "embed_url", nullable = false, columnDefinition = "TEXT")
    private String embedUrl;

    @Column(name = "watch_url", nullable = false, columnDefinition = "TEXT")
    private String watchUrl;

    @Column(name = "color", nullable = false, length = 100)
    private String color;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public VideoTutorial() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getEmbedUrl() { return embedUrl; }
    public void setEmbedUrl(String embedUrl) { this.embedUrl = embedUrl; }

    public String getWatchUrl() { return watchUrl; }
    public void setWatchUrl(String watchUrl) { this.watchUrl = watchUrl; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
