package com.loginapp.model;

/**
 * AuditAction enum - Defines all possible audit actions in the system
 */
public enum AuditAction {
    // Authentication actions
    LOGIN_SUCCESS("Login Successful"),
    LOGIN_FAILED("Login Failed"),
    LOGOUT("User Logout"),
    PASSWORD_CHANGED("Password Changed"),
    PASSWORD_RESET_REQUEST("Password Reset Requested"),
    PASSWORD_RESET_COMPLETED("Password Reset Completed"),
    
    // Authorization actions
    ACCESS_GRANTED("Access Granted"),
    ACCESS_DENIED("Access Denied"),
    PERMISSION_CHANGED("Permission Changed"),
    ROLE_CHANGED("Role Changed"),
    
    // User management actions
    USER_CREATED("User Created"),
    USER_UPDATED("User Updated"),
    USER_DELETED("User Deleted"),
    USER_ACTIVATED("User Activated"),
    USER_DEACTIVATED("User Deactivated"),
    USER_LOCKED("User Locked"),
    USER_UNLOCKED("User Unlocked"),
    
    // System actions
    SYSTEM_STARTUP("System Startup"),
    SYSTEM_SHUTDOWN("System Shutdown"),
    SYSTEM_CONFIG_CHANGED("System Configuration Changed"),
    DATABASE_BACKUP("Database Backup"),
    DATABASE_RESTORE("Database Restore"),
    
    // Backup actions
    BACKUP_CREATED("Backup Created"),
    BACKUP_RESTORED("Backup Restored"),
    BACKUP_DELETED("Backup Deleted"),
    BACKUP_VERIFIED("Backup Verified"),
    BACKUP_FAILED("Backup Failed"),
    
    // Security actions
    SECURITY_INCIDENT("Security Incident"),
    ACCOUNT_LOCKOUT("Account Lockout"),
    SUSPICIOUS_ACTIVITY("Suspicious Activity"),
    INTRUSION_ATTEMPT("Intrusion Attempt"),
    
    // API actions
    API_REQUEST("API Request"),
    API_RESPONSE("API Response"),
    API_ERROR("API Error"),
    
    // Session management
    SESSION_CREATED("Session Created"),
    SESSION_EXPIRED("Session Expired"),
    SESSION_TERMINATED("Session Terminated"),
    
    // Data operations
    DATA_EXPORT("Data Export"),
    DATA_IMPORT("Data Import"),
    DATA_MODIFIED("Data Modified"),
    DATA_VIEWED("Data Viewed");
    
    private final String displayName;
    
    AuditAction(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}
