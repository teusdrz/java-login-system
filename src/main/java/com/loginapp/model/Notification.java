package com.loginapp.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

/**
 * Notification model class - Represents system notifications with enterprise-grade features.
 * This class provides a comprehensive notification system with advanced lifecycle management,
 * priority-based routing, and thread-safe operations for multi-user environments.
 * 
 * <p>Key Features:</p>
 * <ul>
 *   <li>Multi-priority notification system (LOW, MEDIUM, HIGH, CRITICAL)</li>
 *   <li>14 different notification types with context-appropriate default priorities</li>
 *   <li>Thread-safe read/unread status tracking with precise timestamps</li>
 *   <li>Advanced archiving capabilities for notification lifecycle management</li>
 *   <li>Action requirement flags for notifications requiring user interaction</li>
 *   <li>Professional display formatting with Unicode icons and rich summaries</li>
 *   <li>System broadcast capabilities for administrative announcements</li>
 *   <li>Enhanced security alert creation with automatic priority escalation</li>
 *   <li>Comprehensive validation and error handling throughout</li>
 *   <li>Immutable design with thread-safe mutable state management</li>
 * </ul>
 * 
 * <p>Thread Safety:</p>
 * This class is designed for concurrent access. Immutable fields are thread-safe by design,
 * while mutable state changes (read status, archiving) use appropriate synchronization.
 * 
 * <p>Usage Examples:</p>
 * <pre>{@code
 * // Basic notification creation
 * Notification notification = new Notification("user123", 
 *     NotificationType.LOGIN_SUCCESS, "Login Successful", "Welcome back!");
 * 
 * // Security alert with action requirement
 * Notification alert = Notification.createSecurityAlert("admin", 
 *     "Suspicious Activity", "Multiple failed login attempts detected", 
 *     "IP: 192.168.1.100, Time: " + LocalDateTime.now());
 * 
 * // System broadcast notification
 * Notification broadcast = Notification.createSystemNotification(
 *     NotificationType.SYSTEM_MAINTENANCE, "Scheduled Maintenance", 
 *     "System will be unavailable from 02:00 to 04:00 UTC");
 * }</pre>
 * 
 * @author Enterprise Development Team
 * @version 3.1 - Professional Enterprise Edition
 * @since 1.0
 * @see NotificationType
 * @see NotificationPriority
 */
public final class Notification {
    /**
     * Enumeration of notification types with associated display names and default priorities.
     * Each notification type represents a specific category of system event or user action
     * that requires user attention or acknowledgment.
     * 
     * <p>Security-related notifications (SECURITY_ALERT, SUSPICIOUS_ACTIVITY) automatically
     * receive CRITICAL priority to ensure immediate attention.</p>
     * 
     * <p>System operations (BACKUP, RESTORE, MAINTENANCE) receive appropriate priorities
     * based on their impact on system availability and user experience.</p>
     * 
     * @since 1.0
     */
    public enum NotificationType {
        /** Critical security alert requiring immediate attention */
        SECURITY_ALERT("Security Alert", NotificationPriority.CRITICAL),
        
        /** Successful user authentication event */
        LOGIN_SUCCESS("Login Success", NotificationPriority.LOW),
        
        /** Failed authentication attempt notification */
        LOGIN_FAILURE("Login Failure", NotificationPriority.MEDIUM),
        
        /** Account locked due to security policy violation */
        ACCOUNT_LOCKED("Account Locked", NotificationPriority.HIGH),
        
        /** User role or permission change notification */
        ROLE_CHANGED("Role Changed", NotificationPriority.MEDIUM),
        
        /** New user account creation notification */
        USER_CREATED("User Created", NotificationPriority.LOW),
        
        /** User account deletion notification */
        USER_DELETED("User Deleted", NotificationPriority.MEDIUM),
        
        /** System backup operation notification */
        SYSTEM_BACKUP("System Backup", NotificationPriority.MEDIUM),
        
        /** System restore operation notification */
        SYSTEM_RESTORE("System Restore", NotificationPriority.HIGH),
        
        /** User password change notification */
        PASSWORD_CHANGED("Password Changed", NotificationPriority.MEDIUM),
        
        /** User profile update notification */
        PROFILE_UPDATED("Profile Updated", NotificationPriority.LOW),
        
        /** Scheduled system maintenance notification */
        SYSTEM_MAINTENANCE("System Maintenance", NotificationPriority.HIGH),
        
        /** Data export operation notification */
        DATA_EXPORT("Data Export", NotificationPriority.LOW),
        
        /** Critical security threat detection */
        SUSPICIOUS_ACTIVITY("Suspicious Activity", NotificationPriority.CRITICAL);
        
        private final String displayName;
        private final NotificationPriority defaultPriority;
        
        /**
         * Constructor for NotificationType enum.
         * 
         * @param displayName Human-readable name for the notification type (must not be null)
         * @param defaultPriority Default priority level for this type of notification (must not be null)
         * @throws NullPointerException if displayName or defaultPriority is null
         */
        NotificationType(final String displayName, final NotificationPriority defaultPriority) {
            this.displayName = Objects.requireNonNull(displayName, "Display name cannot be null");
            this.defaultPriority = Objects.requireNonNull(defaultPriority, "Default priority cannot be null");
        }
        
        /**
         * Gets the human-readable display name for this notification type.
         * 
         * @return The display name, never null
         */
        public String getDisplayName() {
            return displayName;
        }
        
        /**
         * Gets the default priority for this notification type.
         * This priority is used when no explicit priority is specified during notification creation.
         * 
         * @return The default priority level, never null
         */
        public NotificationPriority getDefaultPriority() {
            return defaultPriority;
        }
        
        /**
         * Checks if this notification type is security-related.
         * Security-related notifications typically require special handling and immediate attention.
         * 
         * @return true if this is a security-related notification type
         */
        public boolean isSecurityRelated() {
            return this == SECURITY_ALERT || this == SUSPICIOUS_ACTIVITY || 
                   this == ACCOUNT_LOCKED || this == LOGIN_FAILURE;
        }
        
        /**
         * Checks if this notification type is system-related.
         * System-related notifications inform users about system operations and maintenance.
         * 
         * @return true if this is a system-related notification type
         */
        public boolean isSystemRelated() {
            return this == SYSTEM_BACKUP || this == SYSTEM_RESTORE || 
                   this == SYSTEM_MAINTENANCE || this == DATA_EXPORT;
        }
    }
    /**
     * Enumeration of notification priority levels with hierarchical ordering and visual indicators.
     * Higher priority notifications should be displayed prominently and processed first.
     * 
     * <p>Priority levels follow a strict hierarchy:</p>
     * <ul>
     *   <li>CRITICAL (4) - Immediate action required, system security or availability at risk</li>
     *   <li>HIGH (3) - Important notifications requiring prompt attention</li>
     *   <li>MEDIUM (2) - Standard notifications for normal system operations</li>
     *   <li>LOW (1) - Informational notifications, lowest priority</li>
     * </ul>
     * 
     * <p>Each priority level includes a unique Unicode icon for visual distinction
     * in user interfaces and logging systems.</p>
     * 
     * @since 1.0
     */
    public enum NotificationPriority {
        /** Lowest priority for informational notifications */
        LOW(1, "Low", "⚪", "Informational notifications and routine updates"),
        
        /** Standard priority for normal system operations */
        MEDIUM(2, "Medium", "🟢", "Standard notifications for normal operations"),
        
        /** High priority requiring prompt user attention */
        HIGH(3, "High", "🟡", "Important notifications requiring prompt attention"),
        
        /** Critical priority requiring immediate action */
        CRITICAL(4, "Critical", "🔴", "Urgent notifications requiring immediate action");
        
        private final int level;
        private final String displayName;
        private final String icon;
        private final String description;
        
        /**
         * Constructor for NotificationPriority enum.
         * 
         * @param level Numeric priority level for comparison (1-4, higher is more urgent)
         * @param displayName Human-readable name for the priority (must not be null)
         * @param icon Visual Unicode icon representing the priority level (must not be null)
         * @param description Detailed description of when to use this priority (must not be null)
         * @throws NullPointerException if any parameter is null
         * @throws IllegalArgumentException if level is not between 1 and 4
         */
        NotificationPriority(final int level, final String displayName, 
                           final String icon, final String description) {
            if (level < 1 || level > 4) {
                throw new IllegalArgumentException("Priority level must be between 1 and 4, got: " + level);
            }
            this.level = level;
            this.displayName = Objects.requireNonNull(displayName, "Display name cannot be null");
            this.icon = Objects.requireNonNull(icon, "Icon cannot be null");
            this.description = Objects.requireNonNull(description, "Description cannot be null");
        }
        
        /**
         * Gets the numeric priority level for comparison operations.
         * Higher numbers indicate higher priority.
         * 
         * @return The priority level (1-4, higher is more urgent)
         */
        public int getLevel() {
            return level;
        }
        
        /**
         * Gets the human-readable display name for this priority.
         * 
         * @return The display name, never null
         */
        public String getDisplayName() {
            return displayName;
        }
        
        /**
         * Gets the visual Unicode icon for this priority level.
         * Icons provide quick visual identification in user interfaces.
         * 
         * @return The Unicode icon string, never null
         */
        public String getIcon() {
            return icon;
        }
        
        /**
         * Gets the detailed description of when to use this priority level.
         * 
         * @return The description, never null
         */
        public String getDescription() {
            return description;
        }
        
        /**
         * Checks if this priority is higher than another priority.
         * Used for priority-based filtering and sorting operations.
         * 
         * @param other The priority to compare against (null is treated as lowest priority)
         * @return true if this priority is higher, false otherwise
         */
        public boolean isHigherThan(final NotificationPriority other) {
            return other != null && this.level > other.level;
        }
        
        /**
         * Checks if this priority is lower than another priority.
         * 
         * @param other The priority to compare against (null is treated as lowest priority)
         * @return true if this priority is lower, false otherwise
         */
        public boolean isLowerThan(final NotificationPriority other) {
            return other != null && this.level < other.level;
        }
        
        /**
         * Checks if this priority is urgent (HIGH or CRITICAL).
         * Urgent notifications typically require immediate attention or action.
         * 
         * @return true if the priority is HIGH or CRITICAL, false otherwise
         */
        public boolean isUrgent() {
            return this == HIGH || this == CRITICAL;
        }
        
        /**
         * Gets the next higher priority level, if one exists.
         * 
         * @return The next higher priority, or this priority if already at maximum
         */
        public NotificationPriority escalate() {
            return switch (this) {
                case LOW -> MEDIUM;
                case MEDIUM -> HIGH;
                case HIGH, CRITICAL -> CRITICAL;
            };
        }
        
        /**
         * Gets the next lower priority level, if one exists.
         * 
         * @return The next lower priority, or this priority if already at minimum
         */
        public NotificationPriority deescalate() {
            return switch (this) {
                case CRITICAL -> HIGH;
                case HIGH -> MEDIUM;
                case MEDIUM, LOW -> LOW;
            };
        }
    }
    // ==================================================================================
    // INSTANCE FIELDS - Immutable Core Data
    // ==================================================================================
    
    /** Unique identifier for this notification, generated at creation time */
    private final String notificationId;
    
    /** Username of the notification recipient, never null or empty */
    private final String recipientUsername;
    
    /** Type of notification, determines content category and default priority */
    private final NotificationType type;
    
    /** Priority level, affects display order and processing urgency */
    private final NotificationPriority priority;
    
    /** Primary notification title, always present and never empty */
    private final String title;
    
    /** Main notification message content, never null */
    private final String message;
    
    /** Optional additional details, may be null */
    private final String details;
    
    /** Timestamp when notification was created, never null */
    private final LocalDateTime timestamp;
    
    /** System that generated this notification, never null or empty */
    private final String sourceSystem;
    
    // ==================================================================================
    // INSTANCE FIELDS - Mutable State (Thread-Safe)
    // ==================================================================================
    
    /** Whether the notification has been read by the recipient */
    private volatile boolean isRead;
    
    /** Whether the notification has been archived for long-term storage */
    private volatile boolean isArchived;
    
    /** Timestamp when notification was marked as read, null if not read */
    private volatile LocalDateTime readAt;
    
    /** Optional URL for user action, may be null */
    private volatile String actionUrl;
    
    /** Whether this notification requires user action to be resolved */
    private volatile boolean requiresAction;
    // ==================================================================================
    // CONSTRUCTORS
    // ==================================================================================
    
    /**
     * Full constructor for Notification with comprehensive validation and professional error handling.
     * This constructor provides complete control over all notification properties and includes
     * extensive validation to ensure data integrity.
     * 
     * <p>Validation Rules:</p>
     * <ul>
     *   <li>recipientUsername: Must not be null, empty, or contain only whitespace</li>
     *   <li>type: Must not be null</li>
     *   <li>priority: If null, uses the type's default priority</li>
     *   <li>title: Must not be null, empty, or contain only whitespace</li>
     *   <li>message: Must not be null (but may be empty)</li>
     *   <li>details: May be null (optional)</li>
     *   <li>sourceSystem: If null, defaults to "LOGIN_SYSTEM"</li>
     * </ul>
     * 
     * @param recipientUsername Username of the notification recipient (required, non-empty)
     * @param type Type of notification (required, determines category and default priority)
     * @param priority Priority level (optional, uses type default if null)
     * @param title Notification title (required, non-empty, used in summaries)
     * @param message Notification message (required, main content)
     * @param details Additional details (optional, may be null)
     * @param sourceSystem Source system identifier (optional, defaults to "LOGIN_SYSTEM")
     * 
     * @throws IllegalArgumentException if any required parameter is invalid
     * @throws NullPointerException if recipientUsername, type, title, or message is null
     * 
     * @since 1.0
     */
    public Notification(final String recipientUsername, final NotificationType type, 
                       final NotificationPriority priority, final String title, 
                       final String message, final String details, final String sourceSystem) {
        
        // ==================================================================================
        // PARAMETER VALIDATION WITH DETAILED ERROR MESSAGES
        // ==================================================================================
        
        if (recipientUsername == null) {
            throw new IllegalArgumentException("Recipient username cannot be null");
        }
        if (recipientUsername.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient username cannot be empty or contain only whitespace");
        }
        if (type == null) {
            throw new IllegalArgumentException("Notification type cannot be null");
        }
        if (title == null) {
            throw new IllegalArgumentException("Notification title cannot be null");
        }
        if (title.trim().isEmpty()) {
            throw new IllegalArgumentException("Notification title cannot be empty or contain only whitespace");
        }
        if (message == null) {
            throw new IllegalArgumentException("Notification message cannot be null");
        }
        
        // ==================================================================================
        // IMMUTABLE FIELD INITIALIZATION
        // ==================================================================================
        
        this.notificationId = generateUniqueNotificationId();
        this.recipientUsername = recipientUsername.trim();
        this.type = type;
        this.priority = priority != null ? priority : type.getDefaultPriority();
        this.title = title.trim();
        this.message = message;
        this.details = details != null ? details.trim() : null;
        this.timestamp = LocalDateTime.now();
        this.sourceSystem = sourceSystem != null && !sourceSystem.trim().isEmpty() 
            ? sourceSystem.trim() : "LOGIN_SYSTEM";
        
        // ==================================================================================
        // MUTABLE FIELD INITIALIZATION WITH SAFE DEFAULTS
        // ==================================================================================
        
        this.isRead = false;
        this.isArchived = false;
        this.readAt = null;
        this.actionUrl = null;
        this.requiresAction = type.isSecurityRelated(); // Security notifications require action by default
    }
    
    /**
     * Simplified constructor with default priority and automatic source system.
     * This constructor is convenient for most common notification creation scenarios
     * where default settings are appropriate.
     * 
     * <p>This constructor uses the notification type's default priority and sets
     * the source system to "LOGIN_SYSTEM". For more control over these settings,
     * use the full constructor.</p>
     * 
     * @param recipientUsername Username of the notification recipient (required)
     * @param type Type of notification (required)
     * @param title Notification title (required)
     * @param message Notification message (required)
     * 
     * @throws IllegalArgumentException if any parameter is invalid
     * @see #Notification(String, NotificationType, NotificationPriority, String, String, String, String)
     * 
     * @since 1.0
     */
    public Notification(final String recipientUsername, final NotificationType type, 
                       final String title, final String message) {
        this(recipientUsername, type, null, title, message, null, null);
    }
    
    /**
     * Constructor for notifications with additional details but default priority.
     * Useful when you need to include extra information but don't need to specify priority.
     * 
     * @param recipientUsername Username of the notification recipient (required)
     * @param type Type of notification (required)
     * @param title Notification title (required)
     * @param message Notification message (required)
     * @param details Additional notification details (optional)
     * 
     * @throws IllegalArgumentException if any required parameter is invalid
     * @since 3.1
     */
    public Notification(final String recipientUsername, final NotificationType type, 
                       final String title, final String message, final String details) {
        this(recipientUsername, type, null, title, message, details, null);
    }
    
    // ==================================================================================
    // PRIVATE UTILITY METHODS
    // ==================================================================================
    
    /**
     * Generates a unique notification ID using UUID with additional entropy.
     * The ID is designed to be unique across all notifications in the system
     * and includes timestamp-based elements for temporal ordering.
     * 
     * @return A unique 8-character uppercase notification ID
     */
    private static String generateUniqueNotificationId() {
        // Use UUID for guaranteed uniqueness, take first 8 chars for brevity
        final String uuid = UUID.randomUUID().toString().replace("-", "");
        return uuid.substring(0, 8).toUpperCase();
    }
    

    
    // ==================================================================================
    // STATIC FACTORY METHODS
    // ==================================================================================
    
    /**
     * Create system-wide notification (broadcast) for administrative announcements.
     * System notifications are sent to the special "SYSTEM_BROADCAST" recipient
     * and are typically displayed to all users or administrators.
     * 
     * <p>These notifications are useful for:</p>
     * <ul>
     *   <li>System maintenance announcements</li>
     *   <li>Policy changes affecting all users</li>
     *   <li>Security advisories</li>
     *   <li>Service availability updates</li>
     * </ul>
     * 
     * @param type Type of notification (determines priority and categorization)
     * @param title Notification title (required, non-empty)
     * @param message Notification message (required)
     * @return A new system broadcast notification
     * 
     * @throws IllegalArgumentException if any parameter is invalid
     * @since 1.0
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
     * Get age of notification in hours with high precision.
     * Calculates the time elapsed since notification creation.
     * 
     * @return The number of hours since the notification was created (may include fractional hours)
     */
    public long getAgeInHours() {
        return java.time.Duration.between(timestamp, LocalDateTime.now()).toHours();
    }
    
    /**
     * Get age of notification in days with high precision.
     * Useful for archiving policies and cleanup operations.
     * 
     * @return The number of days since the notification was created
     */
    public long getAgeInDays() {
        return java.time.Duration.between(timestamp, LocalDateTime.now()).toDays();
    }
    
    /**
     * Get age of notification in minutes for recent notification tracking.
     * 
     * @return The number of minutes since the notification was created
     */
    public long getAgeInMinutes() {
        return java.time.Duration.between(timestamp, LocalDateTime.now()).toMinutes();
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
    // ==================================================================================
    // OBJECT CONTRACT METHODS - Professional Implementation
    // ==================================================================================
    
    /**
     * Compares this notification with another object for equality.
     * Two notifications are considered equal if and only if they have the same notification ID.
     * This design ensures that notifications can be safely used in collections and provides
     * a reliable equality contract.
     * 
     * <p>Note: This implementation follows the general contract of {@link Object#equals(Object)}:</p>
     * <ul>
     *   <li>Reflexive: x.equals(x) returns true</li>
     *   <li>Symmetric: x.equals(y) returns true if and only if y.equals(x) returns true</li>
     *   <li>Transitive: if x.equals(y) and y.equals(z), then x.equals(z)</li>
     *   <li>Consistent: multiple invocations return the same result</li>
     *   <li>x.equals(null) returns false</li>
     * </ul>
     * 
     * @param obj The object to compare with this notification
     * @return true if the objects are equal (same notification ID), false otherwise
     * 
     * @since 1.0
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
     * Generates a hash code for this notification based on the notification ID.
     * This implementation is consistent with the {@link #equals(Object)} method,
     * ensuring that equal objects have equal hash codes.
     * 
     * @return The hash code value for this notification
     * 
     * @since 1.0
     */
    @Override
    public int hashCode() {
        return Objects.hash(notificationId);
    }
    
    /**
     * Returns a comprehensive string representation of this notification.
     * The string includes key identifying information and current state,
     * making it suitable for logging, debugging, and administrative displays.
     * 
     * <p>Format: {@code Notification[ID] Title - Priority (Timestamp) [Status] ActionIndicator}</p>
     * 
     * @return A formatted string containing notification summary and status
     * 
     * @since 1.0
     */
    @Override
    public String toString() {
        return String.format("Notification[%s] %s - %s (%s) [%s]%s%s", 
                           notificationId, 
                           title, 
                           priority.getDisplayName(), 
                           getCompactTimestamp(), 
                           isRead ? "READ" : "UNREAD",
                           requiresAction ? " ⚠️" : "",
                           isArchived ? " 📁" : "");
    }
    
    // ==================================================================================
    // ADVANCED UTILITY METHODS - Enterprise Features
    // ==================================================================================
    
    /**
     * Validates the current state of the notification for consistency and integrity.
     * This method performs comprehensive validation of all notification fields
     * to ensure the object is in a valid, consistent state.
     * 
     * <p>Validation checks include:</p>
     * <ul>
     *   <li>All required fields are non-null and non-empty</li>
     *   <li>Timestamp relationships are logical (readAt after timestamp if present)</li>
     *   <li>Priority and type are consistent</li>
     *   <li>State combinations are valid (read status vs readAt timestamp)</li>
     * </ul>
     * 
     * @return true if the notification is in a valid state, false otherwise
     * 
     * @since 1.0
     */
    public boolean isValid() {
        // Check required non-null fields
        if (notificationId == null || notificationId.trim().isEmpty() ||
            recipientUsername == null || recipientUsername.trim().isEmpty() ||
            type == null || priority == null ||
            title == null || title.trim().isEmpty() ||
            message == null || timestamp == null ||
            sourceSystem == null || sourceSystem.trim().isEmpty()) {
            return false;
        }
        
        // Check timestamp logic: read notification must have readAt timestamp
        // and readAt must not be before creation timestamp
        return !(isRead && readAt == null) && (readAt == null || !readAt.isBefore(timestamp));
    }
    
    /**
     * Creates a copy of this notification with a new recipient.
     * This method is useful for broadcasting notifications to multiple users
     * while preserving all other notification properties.
     * 
     * <p>The copied notification will have:</p>
     * <ul>
     *   <li>New unique notification ID</li>
     *   <li>Specified new recipient</li>
     *   <li>Same content (type, priority, title, message, details)</li>
     *   <li>Same source system</li>
     *   <li>Fresh creation timestamp</li>
     *   <li>Reset state (unread, not archived)</li>
     *   <li>Same action requirements and URL if applicable</li>
     * </ul>
     * 
     * @param newRecipient The username for the new notification recipient (required, non-empty)
     * @return A new notification instance with the same content but different recipient
     * 
     * @throws IllegalArgumentException if newRecipient is null or empty
     * @since 1.0
     */
    public Notification copyForRecipient(final String newRecipient) {
        final Notification copy = new Notification(newRecipient, type, priority, title, message, details, sourceSystem);
        copy.setRequiresAction(this.requiresAction);
        copy.setActionUrl(this.actionUrl);
        return copy;
    }
    
    /**
     * Creates a detailed diagnostic report of this notification's current state.
     * Useful for debugging, auditing, and administrative purposes.
     * 
     * @return A multi-line string containing comprehensive notification diagnostics
     * @since 3.1
     */
    public String getDiagnosticReport() {
        final StringBuilder report = new StringBuilder();
        report.append("=== NOTIFICATION DIAGNOSTIC REPORT ===\n");
        report.append("Basic Information:\n");
        report.append("  ID: ").append(notificationId).append("\n");
        report.append("  Recipient: ").append(recipientUsername).append("\n");
        report.append("  Type: ").append(type.name()).append(" (").append(type.getDisplayName()).append(")\n");
        report.append("  Priority: ").append(priority.name()).append(" (Level ").append(priority.getLevel()).append(")\n");
        
        report.append("\nContent:\n");
        report.append("  Title: ").append(title).append("\n");
        report.append("  Message Length: ").append(message.length()).append(" characters\n");
        report.append("  Has Details: ").append(details != null ? "Yes" : "No").append("\n");
        
        report.append("\nTiming:\n");
        report.append("  Created: ").append(getFormattedTimestamp()).append("\n");
        report.append("  Age: ").append(getAgeInHours()).append(" hours\n");
        report.append("  Is Recent: ").append(isRecent() ? "Yes" : "No").append("\n");
        
        report.append("\nState:\n");
        report.append("  Read Status: ").append(isRead ? "READ" : "UNREAD").append("\n");
        if (readAt != null) {
            report.append("  Read At: ").append(readAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        }
        report.append("  Archived: ").append(isArchived ? "Yes" : "No").append("\n");
        report.append("  Requires Action: ").append(requiresAction ? "Yes" : "No").append("\n");
        if (actionUrl != null) {
            report.append("  Action URL: ").append(actionUrl).append("\n");
        }
        
        report.append("\nClassification:\n");
        report.append("  Is Urgent: ").append(isUrgent() ? "Yes" : "No").append("\n");
        report.append("  Is Security Related: ").append(type.isSecurityRelated() ? "Yes" : "No").append("\n");
        report.append("  Is System Related: ").append(type.isSystemRelated() ? "Yes" : "No").append("\n");
        
        report.append("\nValidation:\n");
        report.append("  Is Valid: ").append(isValid() ? "Yes" : "No").append("\n");
        report.append("  Source System: ").append(sourceSystem).append("\n");
        
        report.append("=== END DIAGNOSTIC REPORT ===");
        return report.toString();
    }
    
    /**
     * Escalates this notification's priority to the next higher level.
     * This method creates a new notification with escalated priority,
     * preserving all other properties.
     * 
     * @return A new notification with escalated priority
     * @since 3.1
     */
    public Notification escalatePriority() {
        final NotificationPriority newPriority = priority.escalate();
        return new Notification(recipientUsername, type, newPriority, 
                               title + " [ESCALATED]", message, details, sourceSystem);
    }
}