package com.flowguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "action", nullable = false, length = 255)
    private String action;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public AuditLog() {}

    public AuditLog(User user, String action, String entityType, UUID entityId, String ipAddress) {
        this.user = user;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.ipAddress = ipAddress;
    }

    public UUID getId()                          { return id; }
    public void setId(UUID id)                   { this.id = id; }
    public User getUser()                        { return user; }
    public void setUser(User user)               { this.user = user; }
    public String getAction()                    { return action; }
    public void setAction(String action)         { this.action = action; }
    public String getEntityType()                { return entityType; }
    public void setEntityType(String et)         { this.entityType = et; }
    public UUID getEntityId()                    { return entityId; }
    public void setEntityId(UUID entityId)       { this.entityId = entityId; }
    public String getIpAddress()                 { return ipAddress; }
    public void setIpAddress(String ip)          { this.ipAddress = ip; }
    public String getUserAgent()                 { return userAgent; }
    public void setUserAgent(String ua)          { this.userAgent = ua; }
    public String getPayload()                   { return payload; }
    public void setPayload(String payload)       { this.payload = payload; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
}