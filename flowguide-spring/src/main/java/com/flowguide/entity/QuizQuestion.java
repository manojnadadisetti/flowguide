package com.flowguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "course", nullable = false, length = 50)
    private String course;

    @Column(name = "question", nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "options_raw", nullable = false, columnDefinition = "TEXT")
    private String optionsRaw;  // pipe-separated options

    @Column(name = "correct_index", nullable = false)
    private Integer correctIndex;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public QuizQuestion() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getOptionsRaw() { return optionsRaw; }
    public void setOptionsRaw(String optionsRaw) { this.optionsRaw = optionsRaw; }

    public Integer getCorrectIndex() { return correctIndex; }
    public void setCorrectIndex(Integer correctIndex) { this.correctIndex = correctIndex; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
