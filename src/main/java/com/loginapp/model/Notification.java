package com.loginapp.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

/**
 * Notification model class - Represents system notifications with enterprise-grade features
 * Enhanced with priority levels, categories, read status tracking, and comprehensive lifecycle management
 * 
 * Features:
 * - Multi-priority notification system (LOW, MEDIUM, HIGH, CRITICAL)
 * - 14 different notification types with default priorities
 * - Read/unread status tracking with timestamps
 * - Archiving capabilities for notification management
 * - Action requirement flags for notifications needing user interaction
 * - Professional display formatting with icons and summaries
 * - System broadcast capabilities for administrative notifications
 * - Security alert creation with enhanced priority handling
 * 
 * @author Enterprise Development Team
 * @version 3.0 - Enterprise Edition
 * @since 1.0
 */
public final class Notification {
    /**
     * Enumeration of notification types with associated display names and default priorities
     * Each type has a specific purpose and appropriate default priority level
     */
    public enum NotificationType {
        SECURITY_ALERT("Security Alert", NotificationPriority.CRITICAL),
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
        
        /**
         * Constructor for NotificationType enum
         * @param displayName Human-readable name for the notification type
         * @param defaultPriority Default priority level for this type of notification
         */
        NotificationType(final String displayName, final NotificationPriority defaultPriority) {
            this.displayName = Objects.requireNonNull(displayName, "Display name cannot be null");
            this.defaultPriority = Objects.requireNonNull(defaultPriority, "Default priority cannot be null");
        }
        
        /**
         * Gets the human-readable display name for this notification type
         * @return The display name
         */
        public String getDisplayName() {
            return displayName;
        }
        
        /**
         * Gets the default priority for this notification type
         * @return The default priority level
         */
        public NotificationPriority getDefaultPriority() {
            return defaultPriority;
        }
    }
    /**
     * Enumeration of notification priority levels with hierarchical ordering
     * Higher priority notifications should be displayed and processed first
     */
    public enum NotificationPriority {
        LOW(1, "Low", "⚪"),
        MEDIUM(2, "Medium", "🟢"),
        HIGH(3, "High", "🟡"),
        CRITICAL(4, "Critical", "🔴");
        
        private final int level;
        private final String displayName;
        private final String icon;
        
        /**
         * Constructor for NotificationPriority enum
         * @param level Numeric priority level for comparison
         * @param displayName Human-readable name for the priority
         * @param icon Visual icon representing the priority level
         */
        NotificationPriority(final int level, final String displayName, final String icon) {
            this.level = level;
            this.displayName = Objects.requireNonNull(displayName, "Display name cannot be null");
            this.icon = Objects.requireNonNull(icon, "Icon cannot be null");
        }
        
        /**
         * Gets the numeric priority level
         * @return The priority level (1-4, higher is more urgent)
         */
        public int getLevel() {
            return level;
        }
        
        /**
         * Gets the human-readable display name
         * @return The display name
         */
        public String getDisplayName() {
            return displayName;
        }
        
        /**
         * Gets the visual icon for this priority level
         * @return The icon string
         */
        public String getIcon() {
            return icon;
        }
        
        /**
         * Checks if this priority is higher than another priority
         * @param other The priority to compare against
         * @return true if this priority is higher, false otherwise
         */
        public boolean isHigherThan(final NotificationPriority other) {
            return other != null && this.level > other.level;
        }
        
        /**
         * Checks if this priority is urgent (HIGH or CRITICAL)
         * @return true if the priority is HIGH or CRITICAL, false otherwise
         */
        public boolean isUrgent() {
            return this == HIGH || this == CRITICAL;
        }
    }
    
    // Immutable fields for notification identification and content
    private final String notificationId;
    private final String recipientUsername;
    private final NotificationType type;
    private final NotificationPriority priority;
    private final String title;
    private final String message;
    private final String details;
    private final LocalDateTime timestamp;
    private final String sourceSystem;
    
    // Mutable fields for notification state management
    private volatile boolean isRead;
    private volatile boolean isArchived;
    private volatile LocalDateTime readAt;
    private volatile String actionUrl;
    private volatile boolean requiresAction;
    
    /**
     * Full constructor for Notification with comprehensive validation
     * 
     * @param recipientUsername Username of the notification recipient (cannot be null or empty)
     * @param type Type of notification (cannot be null)
     * @param priority Priority level (null will use type's default priority)
     * @param title Notification title (cannot be null or empty)
     * @param message Notification message (cannot be null)
     * @param details Additional details (can be null)
     * @param sourceSystem Source system identifier (null will default to "LOGIN_SYSTEM")
     * @throws IllegalArgumentException if required parameters are invalid
     */
    public Notification(final String recipientUsername, final NotificationType type, 
                       final NotificationPriority priority, final String title, 
                       final String message, final String details, final String sourceSystem) {
        // Validate required parameters
        if (recipientUsername == null || recipientUsername.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient username cannot be null or empty");
        }
        if (type == null) {
            throw new IllegalArgumentException("Notification type cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Notification title cannot be null or empty");
        }
        if (message == null) {
            throw new IllegalArgumentException("Notification message cannot be null");
        }
        
        // Initialize immutable fields
        this.notificationId = generateNotificationId();
        this.recipientUsername = recipientUsername.trim();
        this.type = type;
        this.priority = priority != null ? priority : type.getDefaultPriority();
        this.title = title.trim();
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
        this.sourceSystem = sourceSystem != null ? sourceSystem : "LOGIN_SYSTEM";
        
        // Initialize mutable fields with default values
        this.isRead = false;
        this.isArchived = false;
        this.readAt = null;
        this.actionUrl = null;
        this.requiresAction = false;
    }
    
    /**
     * Simplified constructor with default priority
     * 
     * @param recipientUsername Username of the notification recipient
     * @param type Type of notification
     * @param title Notification title
     * @param message Notification message
     */
    public Notification(final String recipientUsername, final NotificationType type, 
                       final String title, final String message) {
        this(recipientUsername, type, type.getDefaultPriority(), title, message, null, null);
    }
    
    /**
     * Generates a unique notification ID
     * @return A unique 8-character uppercase notification ID
     */
    private static String generateNotificationId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }
    
    /**
     * Create system-wide notification (broadcast) for administrative announcements
     * 
     * @param type Type of notification
     * @param title Notification title
     * @param message Notification message
     * @return A new system broadcast notification
     */
    public static Notification createSystemNotification(final NotificationType type, 
                                                       final String title, final String message) {
        return new Notification("SYSTEM_BROADCAST", type, title, message);
    }
    
    /**
     * Create security alert notification with enhanced priority and action requirements
     * 
     * @param recipientUsername Username of the recipient
     * @param title Alert title
     * @param message Alert message
     * @param alertDetails Additional security details
     * @return A new security alert notification requiring action
     */
    public static Notification createSecurityAlert(final String recipientUsername, 
                                                  final String title, final String message, 
                                                  final String alertDetails) {
        final Notification notification = new Notification(recipientUsername, 
                                                    NotificationType.SECURITY_ALERT, 
                                                    NotificationPriority.CRITICAL, 
                                                    title, message, alertDetails, "SECURITY_SYSTEM");
        notification.setRequiresAction(true);
        return notification;
    }
    
    // Comprehensive getter methods with full documentation
    
    /**
     * Gets the unique notification identifier
     * @return The notification ID
     */
    public String getNotificationId() {
        return notificationId;
    }
    
    /**
     * Gets the username of the notification recipient
     * @return The recipient username
     */
    public String getRecipientUsername() {
        return recipientUsername;
    }
    
    /**
     * Gets the notification type
     * @return The notification type
     */
    public NotificationType getType() {
        return type;
    }
    
    /**
     * Gets the notification priority level
     * @return The priority level
     */
    public NotificationPriority getPriority() {
        return priority;
    }
    
    /**
     * Gets the notification title
     * @return The notification title
     */
    public String getTitle() {
        return title;
    }
    
    /**
     * Gets the notification message
     * @return The notification message
     */
    public String getMessage() {
        return message;
    }
    
    /**
     * Gets the additional notification details
     * @return The notification details, or null if not provided
     */
    public String getDetails() {
        return details;
    }
    
    /**
     * Gets the notification creation timestamp
     * @return The timestamp when the notification was created
     */
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    /**
     * Gets the source system that generated this notification
     * @return The source system identifier
     */
    public String getSourceSystem() {
        return sourceSystem;
    }
    
    /**
     * Checks if the notification has been read
     * @return true if the notification has been read, false otherwise
     */
    public boolean isRead() {
        return isRead;
    }
    
    /**
     * Checks if the notification has been archived
     * @return true if the notification has been archived, false otherwise
     */
    public boolean isArchived() {
        return isArchived;
    }
    
    /**
     * Gets the timestamp when the notification was read
     * @return The read timestamp, or null if not read yet
     */
    public LocalDateTime getReadAt() {
        return readAt;
    }
    
    /**
     * Gets the action URL associated with this notification
     * @return The action URL, or null if not provided
     */
    public String getActionUrl() {
        return actionUrl;
    }
    
    /**
     * Checks if this notification requires user action
     * @return true if action is required, false otherwise
     */
    public boolean requiresAction() {
        return requiresAction;
    }
    
    // Notification state management methods with thread safety
    
    /**
     * Marks the notification as read and records the read timestamp
     * Thread-safe operation using synchronized access
     */
    public synchronized void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
    
    /**
     * Marks the notification as unread and clears the read timestamp
     * Thread-safe operation using synchronized access
     */
    public synchronized void markAsUnread() {
        this.isRead = false;
        this.readAt = null;
    }
    
    /**
     * Archives the notification for long-term storage
     * Archived notifications are typically hidden from main views
     */
    public void archive() {
        this.isArchived = true;
    }
    
    /**
     * Unarchives the notification, making it visible in main views again
     */
    public void unarchive() {
        this.isArchived = false;
    }
    
    /**
     * Sets the action URL for notifications requiring user interaction
     * @param actionUrl The URL where users can take action (can be null)
     */
    public void setActionUrl(final String actionUrl) {
        this.actionUrl = actionUrl;
    }
    
    /**
     * Sets whether this notification requires user action
     * @param requiresAction true if action is required, false otherwise
     */
    public void setRequiresAction(final boolean requiresAction) {
        this.requiresAction = requiresAction;
    }
    
    // Utility methods for notification analysis and display
    
    /**
     * Check if notification is recent (within last 24 hours)
     * @return true if the notification was created within the last 24 hours
     */
    public boolean isRecent() {
        return timestamp.isAfter(LocalDateTime.now().minusDays(1));
    }
    
    /**
     * Check if notification is urgent (high or critical priority)
     * @return true if the priority is HIGH or CRITICAL
     */
    public boolean isUrgent() {
        return priority.isUrgent();
    }
    
    /**
     * Get age of notification in hours
     * @return The number of hours since the notification was created
     */
    public long getAgeInHours() {
        return java.time.Duration.between(timestamp, LocalDateTime.now()).toHours();
    }
    
    /**
     * Get age of notification in days
     * @return The number of days since the notification was created
     */
    public long getAgeInDays() {
        return java.time.Duration.between(timestamp, LocalDateTime.now()).toDays();
    }
    
    /**
     * Get formatted timestamp for display
     * @return Formatted timestamp string in yyyy-MM-dd HH:mm:ss format
     */
    public String getFormattedTimestamp() {
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return timestamp.format(formatter);
    }
    
    /**
     * Get formatted timestamp for display in a compact format
     * @return Formatted timestamp string in MM-dd HH:mm format
     */
    public String getCompactTimestamp() {
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd HH:mm");
        return timestamp.format(formatter);
    }
    
    /**
     * Get priority icon for display using modern switch expression
     * @return Icon string representing the priority level
     */
    public String getPriorityIcon() {
        return priority.getIcon();
    }
    
    /**
     * Get notification summary for display in lists and dashboards
     * @return A formatted summary string with priority and read status
     */
    public String getSummary() {
        final StringBuilder summary = new StringBuilder();
        summary.append("[").append(priority.getDisplayName()).append("] ");
        summary.append(title);
        if (!isRead) {
            summary.append(" (UNREAD)");
        }
        if (requiresAction) {
            summary.append(" ⚠️");
        }
        return summary.toString();
    }
    
    /**
     * Get compact notification summary for dashboard display
     * @return A short formatted summary with icons
     */
    public String getCompactSummary() {
        final StringBuilder summary = new StringBuilder();
        summary.append(getPriorityIcon()).append(" ");
        summary.append(title);
        if (!isRead) {
            summary.append(" 🔵");
        }
        return summary.toString();
    }
    
    /**
     * Get full notification details for display with comprehensive information
     * @return A detailed formatted string with all notification information
     */
    public String getFullDetails() {
        final StringBuilder formattedDetails = new StringBuilder();
        formattedDetails.append("=".repeat(60)).append("\n");
        formattedDetails.append("NOTIFICATION DETAILS\n");
        formattedDetails.append("=".repeat(60)).append("\n");
        formattedDetails.append("ID: ").append(notificationId).append("\n");
        formattedDetails.append("Type: ").append(type.getDisplayName()).append("\n");
        formattedDetails.append("Priority: ").append(priority.getDisplayName()).append(" ").append(getPriorityIcon()).append("\n");
        formattedDetails.append("Title: ").append(title).append("\n");
        formattedDetails.append("Message: ").append(message).append("\n");
        if (this.details != null && !this.details.trim().isEmpty()) {
            formattedDetails.append("Details: ").append(this.details).append("\n");
        }
        formattedDetails.append("Timestamp: ").append(getFormattedTimestamp()).append("\n");
        formattedDetails.append("Source: ").append(sourceSystem).append("\n");
        formattedDetails.append("Status: ").append(isRead ? "READ" : "UNREAD").append("\n");
        if (readAt != null) {
            formattedDetails.append("Read At: ").append(readAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        }
        if (requiresAction) {
            formattedDetails.append("⚠️ ACTION REQUIRED\n");
        }
        if (actionUrl != null) {
            formattedDetails.append("Action URL: ").append(actionUrl).append("\n");
        }
        formattedDetails.append("Age: ").append(getAgeInHours()).append(" hours\n");
        formattedDetails.append("=".repeat(60));
        return formattedDetails.toString();
    }
    // Object contract methods with professional implementation
    
    /**
     * Compares this notification with another object for equality
     * Two notifications are considered equal if they have the same notification ID
     * 
     * @param obj The object to compare with
     * @return true if the objects are equal, false otherwise
     */
    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        final Notification that = (Notification) obj;
        return Objects.equals(notificationId, that.notificationId);
    }
    
    /**
     * Generates a hash code for this notification based on the notification ID
     * 
     * @return The hash code
     */
    @Override
    public int hashCode() {
        return Objects.hash(notificationId);
    }
    
    /**
     * Returns a string representation of this notification with key information
     * 
     * @return A formatted string containing notification summary
     */
    @Override
    public String toString() {
        return String.format("Notification[%s] %s - %s (%s) [%s]%s", 
                           notificationId, 
                           title, 
                           priority.getDisplayName(), 
                           getCompactTimestamp(), 
                           isRead ? "READ" : "UNREAD",
                           requiresAction ? " ⚠️" : "");
    }
    
    /**
     * Validates the current state of the notification
     * @return true if the notification is in a valid state, false otherwise
     */
    public boolean isValid() {
        return notificationId != null && !notificationId.trim().isEmpty()
            && recipientUsername != null && !recipientUsername.trim().isEmpty()
            && type != null
            && priority != null
            && title != null && !title.trim().isEmpty()
            && message != null
            && timestamp != null
            && sourceSystem != null && !sourceSystem.trim().isEmpty();
    }
    
    /**
     * Creates a copy of this notification with a new recipient
     * Useful for broadcasting notifications to multiple users
     * 
     * @param newRecipient The new recipient username
     * @return A new notification instance with the same content but different recipient
     */
    public Notification copyForRecipient(final String newRecipient) {
        final Notification copy = new Notification(newRecipient, type, priority, title, message, details, sourceSystem);
        copy.setRequiresAction(this.requiresAction);
        copy.setActionUrl(this.actionUrl);
        return copy;
    }
}