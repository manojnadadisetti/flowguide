package com.flowguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "onboarding_steps")
public class OnboardingStep {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "step_order", nullable = false, unique = true)
    private Integer stepOrder;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = true;

    @Column(name = "icon", length = 100)
    private String icon;

    @Column(name = "help_text", columnDefinition = "TEXT")
    private String helpText;

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

    public OnboardingStep() {}

    public UUID getId()                          { return id; }
    public void setId(UUID id)                   { this.id = id; }
    public Integer getStepOrder()                { return stepOrder; }
    public void setStepOrder(Integer stepOrder)  { this.stepOrder = stepOrder; }
    public String getTitle()                     { return title; }
    public void setTitle(String title)           { this.title = title; }
    public String getDescription()               { return description; }
    public void setDescription(String desc)      { this.description = desc; }
    public String getCategory()                  { return category; }
    public void setCategory(String category)     { this.category = category; }
    public Boolean getIsRequired()               { return isRequired; }
    public void setIsRequired(Boolean r)         { this.isRequired = r; }
    public String getIcon()                      { return icon; }
    public void setIcon(String icon)             { this.icon = icon; }
    public String getHelpText()                  { return helpText; }
    public void setHelpText(String helpText)     { this.helpText = helpText; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
}