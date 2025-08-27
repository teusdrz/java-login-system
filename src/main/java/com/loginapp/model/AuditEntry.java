package com.loginapp.model;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * AuditEntry class - Represents a single audit log entry
 */
public class AuditEntry {
    private String auditId;
    private AuditAction action;
    private AuditLevel level;
    private String userId;
    private String description;
    private Map<String, Object> details;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String userAgent;
    private String sessionId;
    
    public AuditEntry(String auditId, AuditAction action, AuditLevel level, String userId, 
                     String description, Map<String, Object> details) {
        this.auditId = auditId;
        this.action = action;
        this.level = level;
        this.userId = userId;
        this.description = description;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getAuditId() { return auditId; }
    public void setAuditId(String auditId) { this.auditId = auditId; }
    
    public AuditAction getAction() { return action; }
    public void setAction(AuditAction action) { this.action = action; }
    
    public AuditLevel getLevel() { return level; }
    public void setLevel(AuditLevel level) { this.level = level; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    @Override
    public String toString() {
        return "AuditEntry{" +
                "auditId='" + auditId + '\'' +
                ", action=" + action +
                ", level=" + level +
                ", userId='" + userId + '\'' +
                ", description='" + description + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}