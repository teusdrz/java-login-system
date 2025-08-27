package com.loginapp.services;

import com.loginapp.model.Notification;
import com.loginapp.model.Notification.NotificationType;
import com.loginapp.model.Notification.NotificationPriority;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * NotificationService - Professional notification management system
 * Handles notification creation, delivery, and user notification management
 */
public class NotificationService {
    
    private static NotificationService instance;
    private final Map<String, List<Notification>> userNotifications;
    private final List<Notification> systemNotifications;
    
    private NotificationService() {
        this.userNotifications = new ConcurrentHashMap<>();
        this.systemNotifications = new CopyOnWriteArrayList<>();
    }
    
    public static synchronized NotificationService getInstance() {
        if (instance == null) {
            instance = new NotificationService();
        }
        return instance;
    }
    
    /**
     * Send notification to specific user
     */
    public void sendNotification(String recipientUsername, NotificationType type, 
                                String title, String message, String senderUsername) {
        try {
            Notification notification = new Notification(recipientUsername, type, title, message);
            
            userNotifications.computeIfAbsent(recipientUsername, k -> new CopyOnWriteArrayList<>())
                            .add(notification);
            
            System.out.println("📧 Notification sent to " + recipientUsername + ": " + title);
            
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
    
    /**
     * Send notification with custom priority
     */
    public void sendNotification(String recipientUsername, NotificationType type, 
                                NotificationPriority priority, String title, 
                                String message, String details, String senderUsername) {
        try {
            Notification notification = new Notification(recipientUsername, type, priority, 
                                                        title, message, details, "NOTIFICATION_SYSTEM");
            
            userNotifications.computeIfAbsent(recipientUsername, k -> new CopyOnWriteArrayList<>())
                            .add(notification);
            
            System.out.println("📧 " + priority.getDisplayName() + " notification sent to " + 
                             recipientUsername + ": " + title);
            
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
    
    /**
     * Send broadcast notification to all users
     */
    public void sendBroadcastNotification(Notification notification, String senderUsername) {
        try {
            systemNotifications.add(notification);
            
            // Add to all existing user lists
            for (String username : userNotifications.keySet()) {
                Notification userNotification = new Notification(username, notification.getType(), 
                                                                notification.getTitle(), notification.getMessage());
                userNotifications.get(username).add(userNotification);
            }
            
            System.out.println("📢 Broadcast notification sent: " + notification.getTitle());
            
        } catch (Exception e) {
            System.err.println("Failed to send broadcast notification: " + e.getMessage());
        }
    }
    
    /**
     * Get all notifications for a user
     */
    public List<Notification> getNotificationsForUser(String username) {
        List<Notification> notifications = userNotifications.getOrDefault(username, new ArrayList<>());
        return new ArrayList<>(notifications);
    }
    
    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(String username) {
        return getNotificationsForUser(username).stream()
                .filter(notification -> !notification.isRead())
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }
    
    /**
     * Get urgent notifications for a user
     */
    public List<Notification> getUrgentNotifications(String username) {
        return getNotificationsForUser(username).stream()
                .filter(notification -> !notification.isRead() && notification.isUrgent())
                .sorted((a, b) -> b.getPriority().getLevel() - a.getPriority().getLevel())
                .collect(Collectors.toList());
    }
    
    /**
     * Get old notifications (older than specified days)
     */
    public List<Notification> getOldNotifications(String username, int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        return getNotificationsForUser(username).stream()
                .filter(notification -> notification.getTimestamp().isBefore(cutoffDate))
                .filter(notification -> !notification.isArchived())
                .collect(Collectors.toList());
    }
    
    /**
     * Mark notification as read
     */
    public void markAsRead(String notificationId, String username) {
        List<Notification> notifications = userNotifications.get(username);
        if (notifications != null) {
            notifications.stream()
                        .filter(n -> n.getNotificationId().equals(notificationId))
                        .findFirst()
                        .ifPresent(Notification::markAsRead);
        }
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsReadForUser(String username) {
        List<Notification> notifications = userNotifications.get(username);
        if (notifications != null) {
            notifications.forEach(Notification::markAsRead);
        }
    }
    
    /**
     * Archive notification
     */
    public void archiveNotification(String notificationId, String username) {
        List<Notification> notifications = userNotifications.get(username);
        if (notifications != null) {
            notifications.stream()
                        .filter(n -> n.getNotificationId().equals(notificationId))
                        .findFirst()
                        .ifPresent(Notification::archive);
        }
    }
    
    /**
     * Delete notification
     */
    public boolean deleteNotification(String notificationId, String username) {
        List<Notification> notifications = userNotifications.get(username);
        if (notifications != null) {
            return notifications.removeIf(n -> n.getNotificationId().equals(notificationId));
        }
        return false;
    }
    
    /**
     * Create security alert notification
     */
    public void createSecurityAlert(String username, String title, String message, String details) {
        Notification securityAlert = Notification.createSecurityAlert(username, title, message, details);
        userNotifications.computeIfAbsent(username, k -> new CopyOnWriteArrayList<>())
                        .add(securityAlert);
        
        System.out.println("🚨 Security alert created for " + username + ": " + title);
    }
    
    /**
     * Create login success notification
     */
    public void createLoginNotification(String username, String loginDetails) {
        sendNotification(username, NotificationType.LOGIN_SUCCESS, 
                        "Login Successful", 
                        "You have successfully logged into the system.", 
                        "SYSTEM");
    }
    
    /**
     * Create login failure notification
     */
    public void createLoginFailureNotification(String username, String reason) {
        sendNotification(username, NotificationType.LOGIN_FAILURE, 
                        NotificationPriority.MEDIUM,
                        "Login Attempt Failed", 
                        "Failed login attempt detected for your account.",
                        "Reason: " + reason + ". If this wasn't you, please contact support.",
                        "SECURITY_SYSTEM");
    }
    
    /**
     * Create user account notification
     */
    public void createUserAccountNotification(String username, String action, String details) {
        NotificationType type = switch (action.toLowerCase()) {
            case "created" -> NotificationType.USER_CREATED;
            case "deleted" -> NotificationType.USER_DELETED;
            case "role_changed" -> NotificationType.ROLE_CHANGED;
            case "password_changed" -> NotificationType.PASSWORD_CHANGED;
            default -> NotificationType.PROFILE_UPDATED;
        };
        
        sendNotification(username, type, 
                        "Account " + action, 
                        "Your account has been " + action.toLowerCase() + ".",
                        "SYSTEM");
    }
    
    /**
     * Create system maintenance notification
     */
    public void createMaintenanceNotification(String title, String message, LocalDateTime scheduledTime) {
        Notification maintenanceNotification = new Notification("SYSTEM_BROADCAST", 
                                                               NotificationType.SYSTEM_MAINTENANCE,
                                                               NotificationPriority.HIGH,
                                                               title, message, 
                                                               "Scheduled for: " + scheduledTime,
                                                               "MAINTENANCE_SYSTEM");
        
        sendBroadcastNotification(maintenanceNotification, "SYSTEM");
    }
    
    /**
     * Get notification statistics for a user
     */
    public Map<String, Integer> getNotificationStats(String username) {
        List<Notification> notifications = getNotificationsForUser(username);
        Map<String, Integer> stats = new HashMap<>();
        
        stats.put("total", notifications.size());
        stats.put("unread", (int) notifications.stream().filter(n -> !n.isRead()).count());
        stats.put("urgent", (int) notifications.stream().filter(n -> n.isUrgent() && !n.isRead()).count());
        stats.put("archived", (int) notifications.stream().filter(Notification::isArchived).count());
        
        return stats;
    }
    
    /**
     * Clean old archived notifications
     */
    public int cleanOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        int cleanedCount = 0;
        
        for (List<Notification> notifications : userNotifications.values()) {
            cleanedCount += notifications.removeIf(n -> 
                n.isArchived() && n.getTimestamp().isBefore(cutoffDate)
            ) ? 1 : 0;
        }
        
        return cleanedCount;
    }
    
    /**
     * Get system notification summary
     */
    public String getSystemNotificationSummary() {
        int totalUsers = userNotifications.size();
        int totalNotifications = userNotifications.values().stream()
                                                 .mapToInt(List::size)
                                                 .sum();
        int totalUnread = userNotifications.values().stream()
                                          .flatMap(List::stream)
                                          .mapToInt(n -> n.isRead() ? 0 : 1)
                                          .sum();
        
        return String.format("Notification System: %d users, %d total notifications, %d unread", 
                           totalUsers, totalNotifications, totalUnread);
    }
    
    /**
     * Initialize user notification list
     */
    public void initializeUserNotifications(String username) {
        userNotifications.computeIfAbsent(username, k -> new CopyOnWriteArrayList<>());
        
        // Send welcome notification
        sendNotification(username, NotificationType.PROFILE_UPDATED,
                        "Welcome to the System",
                        "Your account has been created successfully. Welcome!",
                        "SYSTEM");
    }
    
    /**
     * Remove all notifications for a user (when user is deleted)
     */
    public void removeUserNotifications(String username) {
        userNotifications.remove(username);
    }
}