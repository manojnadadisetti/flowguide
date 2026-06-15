package com.flowguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
    private String passwordHash;

    @Column(name = "role", nullable = false, length = 50)
    private String role = "user";

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "interests", length = 1000)
    private String interests = "";

    @Column(name = "skill_level", length = 50)
    private String skillLevel = "Beginner";

    @Column(name = "streak_count", nullable = false)
    private Integer streakCount = 0;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 0;

    @Column(name = "daily_target_minutes", nullable = false)
    private Integer dailyTargetMinutes = 30;

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

    public User() {}

    public User(String email, String fullName, String passwordHash) {
        this.email = email;
        this.fullName = fullName;
        this.passwordHash = passwordHash;
    }

    public UUID getId()                        { return id; }
    public void setId(UUID id)                 { this.id = id; }
    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }
    public String getFullName()                { return fullName; }
    public void setFullName(String fullName)   { this.fullName = fullName; }
    public String getPasswordHash()            { return passwordHash; }
    public void setPasswordHash(String ph)     { this.passwordHash = ph; }
    public String getRole()                    { return role; }
    public void setRole(String role)           { this.role = role; }
    public Boolean getIsActive()               { return isActive; }
    public void setIsActive(Boolean isActive)  { this.isActive = isActive; }
    public Boolean getIsVerified()             { return isVerified; }
    public void setIsVerified(Boolean v)       { this.isVerified = v; }
    public String getAvatarUrl()               { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getPhoneNumber()             { return phoneNumber; }
    public void setPhoneNumber(String p)       { this.phoneNumber = p; }
    public String getInterests()               { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
    public String getSkillLevel()              { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
    public Integer getStreakCount()            { return streakCount; }
    public void setStreakCount(Integer s)      { this.streakCount = s; }
    public LocalDateTime getLastActivityDate() { return lastActivityDate; }
    public void setLastActivityDate(LocalDateTime d) { this.lastActivityDate = d; }
    public Integer getTotalPoints()            { return totalPoints; }
    public void setTotalPoints(Integer p)      { this.totalPoints = p; }
    public Integer getDailyTargetMinutes()     { return dailyTargetMinutes; }
    public void setDailyTargetMinutes(Integer m) { this.dailyTargetMinutes = m; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public LocalDateTime getUpdatedAt()        { return updatedAt; }
}