package com.loginapp.api.dto;

import com.loginapp.model.AuditEntry;
import java.time.LocalDateTime;

/**
 * AuditEntryDto - Audit log entry DTO
 */
public class AuditEntryDto {
    private String auditId;
    private String action;
    private String level;
    private String userId;
    private String description;
    private LocalDateTime timestamp;
    private String ipAddress;

    // Constructors
    public AuditEntryDto() {}

    public AuditEntryDto(AuditEntry auditEntry) {
        this.auditId = auditEntry.getAuditId();
        this.action = auditEntry.getAction().getDisplayName();
        this.level = auditEntry.getLevel().getDisplayName();
        this.userId = auditEntry.getUserId();
        this.description = auditEntry.getDescription();
        this.timestamp = auditEntry.getTimestamp();
        this.ipAddress = auditEntry.getIpAddress();
    }

    // Getters and Setters
    public String getAuditId() {
        return auditId;
    }
    
    public void setAuditId(String auditId) {
        this.auditId = auditId;
    }

    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }

    public String getLevel() {
        return level;
    }
    
    public void setLevel(String level) {
        this.level = level;
    }

    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}
