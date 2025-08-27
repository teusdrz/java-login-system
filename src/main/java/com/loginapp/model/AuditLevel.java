package com.loginapp.model;

/**
 * AuditLevel enum - Defines severity levels for audit entries
 */
public enum AuditLevel {
    INFO("Information", 1, "Normal system operation"),
    WARNING("Warning", 2, "Potentially concerning activity"),
    ERROR("Error", 3, "Error condition that needs attention"),
    CRITICAL("Critical", 4, "Critical security or system issue");
    
    private final String displayName;
    private final int severity;
    private final String description;
    
    AuditLevel(String displayName, int severity, String description) {
        this.displayName = displayName;
        this.severity = severity;
        this.description = description;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public int getSeverity() {
        return severity;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isHigherSeverityThan(AuditLevel other) {
        return this.severity > other.severity;
    }
    
    public boolean isAtLeastSeverityOf(AuditLevel other) {
        return this.severity >= other.severity;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}
