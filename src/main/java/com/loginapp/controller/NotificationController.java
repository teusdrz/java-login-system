package com.loginapp.controller;

import com.loginapp.model.Notification;
import com.loginapp.model.User;
import com.loginapp.services.NotificationService;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

import java.util.List;

/**
 * NotificationController - Professional notification management system
 * Handles user notifications, alerts, and system messaging
 */
public class NotificationController {
    private final ConsoleView consoleView;
    private final NotificationService notificationService;
    private final PermissionService permissionService;
    
    public NotificationController(ConsoleView consoleView) {
        this.consoleView = consoleView;
        this.notificationService = NotificationService.getInstance();
        this.permissionService = PermissionService.getInstance();
    }
    
    /**
     * Handle notification management menu with comprehensive options
     */
    public void handleNotificationManagement(User currentUser) {
        if (currentUser == null) {
            consoleView.displayErrorMessage("Invalid user session. Cannot access notifications.");
            return;
        }
        
        boolean managing = true;
        
        while (managing) {
            try {
                displayNotificationMenu(currentUser);
                int choice = consoleView.getMenuChoice();
                
                switch (choice) {
                    case 1 -> handleViewNotifications(currentUser);
                    case 2 -> handleViewUnreadNotifications(currentUser);
                    case 3 -> handleMarkAllAsRead(currentUser);
                    case 4 -> handleArchiveNotifications(currentUser);
                    case 5 -> handleCreateNotification(currentUser);
                    case 6 -> handleNotificationSettings(currentUser);
                    case 0 -> managing = false;
                    default -> consoleView.displayErrorMessage("Invalid option. Please select 0-6.");
                }
            } catch (Exception e) {
                consoleView.displayErrorMessage("An error occurred in notification management: " + e.getMessage());
                System.err.println("NotificationController error: " + e.getMessage());
            }
        }
    }
    
    private void displayNotificationMenu(User user) {
        int unreadCount = getUnreadNotificationCount(user);
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("           NOTIFICATION MANAGEMENT CENTER");
        System.out.println("=".repeat(60));
        System.out.println("Welcome, " + user.getUsername() + " (" + user.getRole() + ")");
        if (unreadCount > 0) {
            System.out.println("🔔 You have " + unreadCount + " unread notification(s)");
        }
        System.out.println("-".repeat(60));
        System.out.println("1. View All Notifications   - See complete notification history");
        System.out.println("2. View Unread Only         - Show only unread notifications");
        System.out.println("3. Mark All as Read         - Clear unread status for all");
        System.out.println("4. Archive Notifications    - Move old notifications to archive");
        if (hasNotificationPermissions(user)) {
            System.out.println("5. Create Notification      - Send notification to users");
        }
        System.out.println("6. Notification Settings    - Configure notification preferences");
        System.out.println("0. Back to Main Menu        - Return to previous menu");
        System.out.println("=".repeat(60));
        System.out.print("Choose an option (0-6): ");
    }
    
    /**
     * View all notifications with detailed display
     */
    private void handleViewNotifications(User user) {
        System.out.println("\n=== ALL NOTIFICATIONS ===");
        
        try {
            List<Notification> notifications = notificationService.getNotificationsForUser(user.getUsername());
            
            if (notifications.isEmpty()) {
                consoleView.displayInfoMessage("📭 No notifications found.");
                consoleView.waitForEnter();
                return;
            }
            
            System.out.println("📋 Total notifications: " + notifications.size());
            System.out.println("-".repeat(80));
            
            for (int i = 0; i < notifications.size(); i++) {
                Notification notification = notifications.get(i);
                displayNotificationSummary(notification, i + 1);
            }
            
            System.out.println("\nSelect a notification to view details (0 to return): ");
            int choice = consoleView.getMenuChoice();
            
            if (choice > 0 && choice <= notifications.size()) {
                Notification selected = notifications.get(choice - 1);
                displayNotificationDetails(selected);
                
                if (!selected.isRead()) {
                    notificationService.markAsRead(selected.getNotificationId(), user.getUsername());
                    consoleView.displayInfoMessage("✅ Notification marked as read.");
                }
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error retrieving notifications: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * View only unread notifications
     */
    private void handleViewUnreadNotifications(User user) {
        System.out.println("\n=== UNREAD NOTIFICATIONS ===");
        
        try {
            List<Notification> unreadNotifications = notificationService.getUnreadNotifications(user.getUsername());
            
            if (unreadNotifications.isEmpty()) {
                consoleView.displayInfoMessage("✅ No unread notifications. You're all caught up!");
                consoleView.waitForEnter();
                return;
            }
            
            System.out.println("🔔 Unread notifications: " + unreadNotifications.size());
            System.out.println("-".repeat(80));
            
            for (int i = 0; i < unreadNotifications.size(); i++) {
                Notification notification = unreadNotifications.get(i);
                displayNotificationSummary(notification, i + 1);
                
                // Mark urgent notifications with special indicator
                if (notification.isUrgent()) {
                    System.out.println("   ⚠️  URGENT - Requires immediate attention!");
                }
            }
            
            if (consoleView.getConfirmation("\nMark all unread notifications as read?")) {
                for (Notification notification : unreadNotifications) {
                    notificationService.markAsRead(notification.getNotificationId(), user.getUsername());
                }
                consoleView.displaySuccessMessage("✅ All notifications marked as read.");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error retrieving unread notifications: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Mark all notifications as read
     */
    private void handleMarkAllAsRead(User user) {
        System.out.println("\n=== MARK ALL AS READ ===");
        
        try {
            int unreadCount = getUnreadNotificationCount(user);
            
            if (unreadCount == 0) {
                consoleView.displayInfoMessage("✅ No unread notifications to mark.");
                consoleView.waitForEnter();
                return;
            }
            
            System.out.println("📊 Found " + unreadCount + " unread notification(s)");
            
            if (consoleView.getConfirmation("Mark all " + unreadCount + " notification(s) as read?")) {
                notificationService.markAllAsReadForUser(user.getUsername());
                consoleView.displaySuccessMessage("✅ All notifications marked as read successfully!");
            } else {
                System.out.println("Operation cancelled by user.");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error marking notifications as read: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Archive old notifications
     */
    private void handleArchiveNotifications(User user) {
        System.out.println("\n=== ARCHIVE NOTIFICATIONS ===");
        
        try {
            List<Notification> oldNotifications = notificationService.getOldNotifications(user.getUsername(), 30); // 30 days old
            
            if (oldNotifications.isEmpty()) {
                consoleView.displayInfoMessage("📭 No old notifications to archive.");
                consoleView.waitForEnter();
                return;
            }
            
            System.out.println("📦 Found " + oldNotifications.size() + " notification(s) older than 30 days");
            
            if (consoleView.getConfirmation("Archive these old notifications?")) {
                int archived = 0;
                for (Notification notification : oldNotifications) {
                    notificationService.archiveNotification(notification.getNotificationId(), user.getUsername());
                    archived++;
                }
                consoleView.displaySuccessMessage("📦 Archived " + archived + " notification(s) successfully!");
            } else {
                System.out.println("Archive operation cancelled by user.");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error archiving notifications: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Create and send new notification (admin/moderator feature)
     */
    private void handleCreateNotification(User user) {
        if (!hasNotificationPermissions(user)) {
            consoleView.displayErrorMessage("Access denied. You need notification management permissions.");
            return;
        }
        
        System.out.println("\n=== CREATE NOTIFICATION ===");
        
        try {
            // Select notification type
            System.out.println("Select notification type:");
            System.out.println("1. General Information");
            System.out.println("2. System Maintenance");
            System.out.println("3. Security Alert");
            System.out.println("4. User Account Notice");
            System.out.println("0. Cancel");
            
            int typeChoice = consoleView.getMenuChoice();
            Notification.NotificationType selectedType = switch (typeChoice) {
                case 1 -> Notification.NotificationType.PROFILE_UPDATED;
                case 2 -> Notification.NotificationType.SYSTEM_MAINTENANCE;
                case 3 -> Notification.NotificationType.SECURITY_ALERT;
                case 4 -> Notification.NotificationType.ROLE_CHANGED;
                case 0 -> null;
                default -> null;
            };
            
            if (selectedType == null) {
                return;
            }
            
            System.out.print("Enter notification title: ");
            String title = consoleView.getStringInput();
            
            System.out.print("Enter notification message: ");
            String message = consoleView.getStringInput();
            
            System.out.print("Enter recipient username (or 'ALL' for broadcast): ");
            String recipient = consoleView.getStringInput();
            
            // Create and send notification
            if ("ALL".equalsIgnoreCase(recipient)) {
                Notification notification = Notification.createSystemNotification(selectedType, title, message);
                notificationService.sendBroadcastNotification(notification, user.getUsername());
                consoleView.displaySuccessMessage("📢 Broadcast notification sent to all users!");
            } else {
                notificationService.sendNotification(recipient, selectedType, title, message, user.getUsername());
                consoleView.displaySuccessMessage("📧 Notification sent to " + recipient + " successfully!");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error creating notification: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Configure notification settings
     */
    private void handleNotificationSettings(User user) {
        System.out.println("\n=== NOTIFICATION SETTINGS ===");
        
        System.out.println("Current notification preferences for " + user.getUsername() + ":");
        System.out.println("✅ Login alerts: Enabled");
        System.out.println("✅ Security notifications: Enabled");
        System.out.println("✅ System maintenance alerts: Enabled");
        System.out.println("✅ Account changes: Enabled");
        
        System.out.println("\nSettings are managed by system administrators.");
        System.out.println("Contact your administrator to modify notification preferences.");
        
        consoleView.waitForEnter();
    }
    
    /**
     * Display notification summary in list format
     */
    private void displayNotificationSummary(Notification notification, int index) {
        String status = notification.isRead() ? "📖" : "🔔";
        String priority = notification.getPriorityIcon();
        String ageInfo = getNotificationAge(notification);
        
        System.out.printf("%d. %s %s [%s] %s - %s (%s)\n", 
            index, 
            status, 
            priority,
            notification.getType().getDisplayName(),
            notification.getTitle(), 
            notification.getMessage(),
            ageInfo);
    }
    
    /**
     * Display detailed notification information
     */
    private void displayNotificationDetails(Notification notification) {
        System.out.println("\n" + notification.getFullDetails());
    }
    
    /**
     * Get unread notification count for user
     */
    private int getUnreadNotificationCount(User user) {
        try {
            return notificationService.getUnreadNotifications(user.getUsername()).size();
        } catch (Exception e) {
            return 0;
        }
    }
    
    /**
     * Check if user has permissions to create notifications
     */
    private boolean hasNotificationPermissions(User user) {
        return permissionService.hasPermission(user, "SEND_NOTIFICATIONS") ||
               permissionService.hasPermission(user, "SYSTEM_ADMIN");
    }
    
    /**
     * Get human-readable notification age
     */
    private String getNotificationAge(Notification notification) {
        long hours = notification.getAgeInHours();
        if (hours < 1) {
            return "Just now";
        } else if (hours < 24) {
            return hours + "h ago";
        } else {
            long days = hours / 24;
            return days + "d ago";
        }
    }
    
    /**
     * Check for pending notifications and display alert
     */
    public void checkPendingNotifications(User user) {
        try {
            List<Notification> urgentNotifications = notificationService.getUrgentNotifications(user.getUsername());
            
            if (!urgentNotifications.isEmpty()) {
                System.out.println("\n🚨 URGENT NOTIFICATIONS:");
                System.out.println("-".repeat(50));
                
                for (Notification notification : urgentNotifications) {
                    System.out.println("⚠️  " + notification.getTitle() + " - " + notification.getMessage());
                }
                
                System.out.println("-".repeat(50));
                System.out.println("Please check your notifications for details.");
            }
            
        } catch (Exception e) {
            // Silent failure - don't disrupt main flow
            System.err.println("Error checking pending notifications: " + e.getMessage());
        }
    }
    
    /**
     * Get notification summary for dashboard display
     */
    public String getNotificationSummary(User user) {
        try {
            int unreadCount = getUnreadNotificationCount(user);
            int urgentCount = notificationService.getUrgentNotifications(user.getUsername()).size();
            
            if (urgentCount > 0) {
                return String.format("🚨 %d urgent, %d unread notifications", urgentCount, unreadCount);
            } else if (unreadCount > 0) {
                return String.format("🔔 %d unread notifications", unreadCount);
            } else {
                return "✅ No new notifications";
            }
        } catch (Exception e) {
            return "Notifications unavailable";
        }
    }
}
