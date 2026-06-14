package com.flowguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "user_progress",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "step_id"})
)
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_id", nullable = false)
    private OnboardingStep step;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "pending";

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "skipped_at")
    private LocalDateTime skippedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public UserProgress() {}

    public UUID getId()                               { return id; }
    public void setId(UUID id)                        { this.id = id; }
    public User getUser()                             { return user; }
    public void setUser(User user)                    { this.user = user; }
    public OnboardingStep getStep()                   { return step; }
    public void setStep(OnboardingStep step)          { this.step = step; }
    public String getStatus()                         { return status; }
    public void setStatus(String status)              { this.status = status; }
    public LocalDateTime getStartedAt()               { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt()             { return completedAt; }
    public void setCompletedAt(LocalDateTime t)       { this.completedAt = t; }
    public LocalDateTime getSkippedAt()               { return skippedAt; }
    public void setSkippedAt(LocalDateTime t)         { this.skippedAt = t; }
    public String getNotes()                          { return notes; }
    public void setNotes(String notes)                { this.notes = notes; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public LocalDateTime getUpdatedAt()               { return updatedAt; }
}