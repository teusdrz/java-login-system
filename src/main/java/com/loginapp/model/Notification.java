package com.loginapp.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

/**
 * Notification model class - Represents system notifications
 * Enhanced with priority levels, categories, and read status tracking
 */
public class Notification {
    
    public enum NotificationType {
        SECURITY_ALERT("Security Alert", NotificationPriority.HIGH),
        LOGIN_SUCCESS("Login Success", NotificationPriority.LOW),
        LOGIN_FAILURE("Login Failure", NotificationPriority.MEDIUM),
        ACCOUNT_LOCKED("Account Locked", NotificationPriority.HIGH),
        ROLE_CHANGED("Role Changed", NotificationPriority.MEDIUM),
        USER_CREATED("User Created", NotificationPriority.LOW),
        USER_DELETED("User Deleted", NotificationPriority.MEDIUM),
        SYSTEM_BACKUP("System Backup", NotificationPriority.MEDIUM),
        SYSTEM_RESTORE("System Restore", NotificationPriority.HIGH),
        PASSWORD_CHANGED("Password Changed", NotificationPriority.MEDIUM),
        PROFILE_UPDATED("Profile Updated", NotificationPriority.LOW),
        SYSTEM_MAINTENANCE("System Maintenance", NotificationPriority.HIGH),
        DATA_EXPORT("Data Export", NotificationPriority.LOW),
        SUSPICIOUS_ACTIVITY("Suspicious Activity", NotificationPriority.CRITICAL);
        
        private final String displayName;
        private final NotificationPriority defaultPriority;
        
        NotificationType(String displayName, NotificationPriority defaultPriority) {
            this.displayName = displayName;
            this.defaultPriority = defaultPriority;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public NotificationPriority getDefaultPriority() {
            return defaultPriority;
        }
    }
    
    public enum NotificationPriority {
        LOW(1, "Low"),
        MEDIUM(2, "Medium"),
        HIGH(3, "High"),
        CRITICAL(4, "Critical");
        
        private final int level;
        private final String displayName;
        
        NotificationPriority(int level, String displayName) {
            this.level = level;
            this.displayName = displayName;
        }
        
        public int getLevel() {
            return level;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public boolean isHigherThan(NotificationPriority other) {
            return this.level > other.level;
        }
    }
    
    private final String notificationId;
    private final String recipientUsername;
    private final NotificationType type;
    private final NotificationPriority priority;
    private final String title;
    private final String message;
    private final String details;
    private final LocalDateTime timestamp;
    private final String sourceSystem;
    private boolean isRead;
    private boolean isArchived;
    private LocalDateTime readAt;
    private String actionUrl;
    private boolean requiresAction;
    
    /**
     * Full constructor for Notification
     */
    public Notification(String recipientUsername, NotificationType type, 
                       NotificationPriority priority, String title, 
                       String message, String details, String sourceSystem) {
        this.notificationId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.recipientUsername = recipientUsername;
        this.type = type;
        this.priority = priority != null ? priority : type.getDefaultPriority();
        this.title = title;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
        this.sourceSystem = sourceSystem != null ? sourceSystem : "LOGIN_SYSTEM";
        this.isRead = false;
        this.isArchived = false;
        this.requiresAction = false;
    }
    
    /**
     * Simplified constructor with default priority
     */
    public Notification(String recipientUsername, NotificationType type, 
                       String title, String message) {
        this(recipientUsername, type, type.getDefaultPriority(), title, message, null, null);
    }
    
    /**
     * Create system-wide notification (broadcast)
     */
    public static Notification createSystemNotification(NotificationType type, 
                                                       String title, String message) {
        return new Notification("SYSTEM_BROADCAST", type, title, message);
    }
    
    /**
     * Create security alert notification
     */
    public static Notification createSecurityAlert(String recipientUsername, 
                                                  String title, String message, String details) {
        Notification notification = new Notification(recipientUsername, 
                                                    NotificationType.SECURITY_ALERT, 
                                                    NotificationPriority.CRITICAL, 
                                                    title, message, details, "SECURITY_SYSTEM");
        notification.setRequiresAction(true);
        return notification;
    }
    
    // Getters
    public String getNotificationId() {
        return notificationId;
    }
    
    public String getRecipientUsername() {
        return recipientUsername;
    }
    
    public NotificationType getType() {
        return type;
    }
    
    public NotificationPriority getPriority() {
        return priority;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public String getDetails() {
        return details;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public String getSourceSystem() {
        return sourceSystem;
    }
    
    public boolean isRead() {
        return isRead;
    }
    
    public boolean isArchived() {
        return isArchived;
    }
    
    public LocalDateTime getReadAt() {
        return readAt;
    }
    
    public String getActionUrl() {
        return actionUrl;
    }
    
    public boolean requiresAction() {
        return requiresAction;
    }
    
    // Setters
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
    
    public void markAsUnread() {
        this.isRead = false;
        this.readAt = null;
    }
    
    public void archive() {
        this.isArchived = true;
    }
    
    public void unarchive() {
        this.isArchived = false;
    }
    
    public void setActionUrl(String actionUrl) {
        this.actionUrl = actionUrl;
    }
    
    public void setRequiresAction(boolean requiresAction) {
        this.requiresAction = requiresAction;
    }
    
    /**
     * Check if notification is recent (within last 24 hours)
     */
    public boolean isRecent() {
        return timestamp.isAfter(LocalDateTime.now().minusDays(1));
    }
    
    /**
     * Check if notification is urgent (high or critical priority)
     */
    public boolean isUrgent() {
        return priority == NotificationPriority.HIGH || priority == NotificationPriority.CRITICAL;
    }
    
    /**
     * Get age of notification in hours
     */
    public long getAgeInHours() {
        return java.time.Duration.between(timestamp, LocalDateTime.now()).toHours();
    }
    
    /**
     * Get formatted timestamp
     */
    public String getFormattedTimestamp() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return timestamp.format(formatter);
    }
    
    /**
     * Get priority icon for display
     */
    public String getPriorityIcon() {
        switch (priority) {
            case CRITICAL: return "🔴";
            case HIGH: return "🟡";
            case MEDIUM: return "🟢";
            case LOW: return "⚪";
            default: return "❓";
        }
    }
    
    /**
     * Get notification summary for display
     */
    public String getSummary() {
        StringBuilder summary = new StringBuilder();
        summary.append("[").append(priority.getDisplayName()).append("] ");
        summary.append(title);
        if (!isRead) {
            summary.append(" (UNREAD)");
        }
        return summary.toString();
    }
    
    /**
     * Get full notification details for display
     */
    public String getFullDetails() {
        StringBuilder details = new StringBuilder();
        details.append("=".repeat(60)).append("\n");
        details.append("NOTIFICATION DETAILS\n");
        details.append("=".repeat(60)).append("\n");
        details.append("ID: ").append(notificationId).append("\n");
        details.append("Type: ").append(type.getDisplayName()).append("\n");
        details.append("Priority: ").append(priority.getDisplayName()).append(" ").append(getPriorityIcon()).append("\n");
        details.append("Title: ").append(title).append("\n");
        details.append("Message: ").append(message).append("\n");
        if (this.details != null) {
            details.append("Details: ").append(this.details).append("\n");
        }
        details.append("Timestamp: ").append(getFormattedTimestamp()).append("\n");
        details.append("Source: ").append(sourceSystem).append("\n");
        details.append("Status: ").append(isRead ? "READ" : "UNREAD").append("\n");
        if (requiresAction) {
            details.append("⚠️ ACTION REQUIRED\n");
        }
        details.append("=".repeat(60));
        return details.toString();
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Notification that = (Notification) obj;
        return Objects.equals(notificationId, that.notificationId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(notificationId);
    }
    
    @Override
    public String toString() {
        return String.format("Notification[%s] %s - %s (%s) [%s]", 
                           notificationId, title, priority.getDisplayName(), 
                           getFormattedTimestamp(), isRead ? "READ" : "UNREAD");
    }
}