package com.loginapp.services;

import com.loginapp.model.Notification;
import com.loginapp.model.Notification.NotificationType;
import com.loginapp.model.Notification.NotificationPriority;
import com.loginapp.model.User;
import com.loginapp.model.Role;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * NotificationService - Advanced notification system with Observer pattern
 * Handles real-time notifications, filtering, and observer management
 */
public class NotificationService {
    
    private static NotificationService instance;
    private final Map<String, List<Notification>> userNotifications;
    private final List<Notification> systemNotifications;
    private final List<NotificationObserver> observers;
    private final Map<String, NotificationPreferences> userPreferences;
    private final NotificationStatistics statistics;
    
    // Singleton pattern with thread safety
    private NotificationService() {
        this.userNotifications = new ConcurrentHashMap<>();
        this.systemNotifications = new CopyOnWriteArrayList<>();
        this.observers = new CopyOnWriteArrayList<>();
        this.userPreferences = new ConcurrentHashMap<>();
        this.statistics = new NotificationStatistics();
    }
    
    public static synchronized NotificationService getInstance() {
        if (instance == null) {
            instance = new NotificationService();
        }
        return instance;
    }
    
    /**
     * Observer interface for notification events
     */
    public interface NotificationObserver {
        void onNotificationReceived(Notification notification);
        void onNotificationRead(Notification notification);
        void onNotificationArchived(Notification notification);
        String getObserverId();
        Set<NotificationType> getSubscribedTypes();
    }
    
    /**
     * User notification preferences
     */
    public static class NotificationPreferences {
        private final String username;
        private final Set<NotificationType> enabledTypes;
        private final Set<NotificationPriority> enabledPriorities;
        private final boolean realTimeEnabled;
        private final boolean emailEnabled;
        private final int maxNotifications;
        
        public NotificationPreferences(String username) {
            this.username = username;
            this.enabledTypes = EnumSet.allOf(NotificationType.class);
            this.enabledPriorities = EnumSet.allOf(NotificationPriority.class);
            this.realTimeEnabled = true;
            this.emailEnabled = false;
            this.maxNotifications = 100;
        }
        
        public NotificationPreferences(String username, Set<NotificationType> types, 
                                     Set<NotificationPriority> priorities, 
                                     boolean realTime, boolean email, int maxNotifications) {
            this.username = username;
            this.enabledTypes = new HashSet<>(types);
            this.enabledPriorities = new HashSet<>(priorities);
            this.realTimeEnabled = realTime;
            this.emailEnabled = email;
            this.maxNotifications = maxNotifications;
        }
        
        public String getUsername() { return username; }
        public Set<NotificationType> getEnabledTypes() { return new HashSet<>(enabledTypes); }
        public Set<NotificationPriority> getEnabledPriorities() { return new HashSet<>(enabledPriorities); }
        public boolean isRealTimeEnabled() { return realTimeEnabled; }
        public boolean isEmailEnabled() { return emailEnabled; }
        public int getMaxNotifications() { return maxNotifications; }
        
        public boolean shouldReceive(Notification notification) {
            return enabledTypes.contains(notification.getType()) &&
                   enabledPriorities.contains(notification.getPriority());
        }
    }
    
    /**
     * Notification statistics tracking
     */
    public static class NotificationStatistics {
        private long totalSent = 0;
        private long totalRead = 0;
        private long totalArchived = 0;
        private final Map<NotificationType, Long> typeCount = new ConcurrentHashMap<>();
        private final Map<NotificationPriority, Long> priorityCount = new ConcurrentHashMap<>();
        
        public synchronized void incrementSent(NotificationType type, NotificationPriority priority) {
            totalSent++;
            typeCount.put(type, typeCount.getOrDefault(type, 0L) + 1);
            priorityCount.put(priority, priorityCount.getOrDefault(priority, 0L) + 1);
        }
        
        public synchronized void incrementRead() { totalRead++; }
        public synchronized void incrementArchived() { totalArchived++; }
        
        public long getTotalSent() { return totalSent; }
        public long getTotalRead() { return totalRead; }
        public long getTotalArchived() { return totalArchived; }
        public long getUnreadCount() { return totalSent - totalRead; }
        public Map<NotificationType, Long> getTypeDistribution() { return new HashMap<>(typeCount); }
        public Map<NotificationPriority, Long> getPriorityDistribution() { return new HashMap<>(priorityCount); }
        
        public double getReadRate() {
            return totalSent > 0 ? (double) totalRead / totalSent * 100 : 0.0;
        }
    }
    
    /**
     * Register notification observer
     */
    public void registerObserver(NotificationObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }
    
    /**
     * Unregister notification observer
     */
    public void unregisterObserver(NotificationObserver observer) {
        observers.remove(observer);
    }
    
    /**
     * Send notification to specific user
     */
    public boolean sendNotification(String username, NotificationType type, 
                                   String title, String message) {
        return sendNotification(username, type, type.getDefaultPriority(), title, message, null);
    }
    
    /**
     * Send notification with custom priority
     */
    public boolean sendNotification(String username, NotificationType type, 
                                   NotificationPriority priority, String title, 
                                   String message, String details) {
        if (username == null || type == null || title == null || message == null) {
            return false;
        }
        
        Notification notification = new Notification(username, type, priority, 
                                                     title, message, details, "NOTIFICATION_SERVICE");
        
        // Check user preferences
        NotificationPreferences preferences = getUserPreferences(username);
        if (!preferences.shouldReceive(notification)) {
            return false; // User has disabled this type of notification
        }
        
        // Add to user notifications
        userNotifications.computeIfAbsent(username, k -> new CopyOnWriteArrayList<>()).add(notification);
        
        // Maintain notification limits
        enforceNotificationLimits(username, preferences.getMaxNotifications());
        
        // Update statistics
        statistics.incrementSent(type, priority);
        
        // Notify observers
        notifyObservers(notification);
        
        return true;
    }
    
    /**
     * Send system-wide broadcast notification
     */
    public void sendSystemBroadcast(NotificationType type, String title, 
                                   String message, Set<Role> targetRoles) {
        Notification systemNotification = Notification.createSystemNotification(type, title, message);
        systemNotifications.add(systemNotification);
        
        // If no specific roles targeted, send to all users
        if (targetRoles == null || targetRoles.isEmpty()) {
            for (String username : userNotifications.keySet()) {
                sendNotification(username, type, title, message);
            }
        } else {
            // Send only to users with specific roles (would need user role lookup)
            // This would require integration with UserDatabase
        }
    }
    
    /**
     * Send security alert with high priority
     */
    public void sendSecurityAlert(String username, String title, String message, String details) {
        Notification securityAlert = Notification.createSecurityAlert(username, title, message, details);
        
        userNotifications.computeIfAbsent(username, k -> new CopyOnWriteArrayList<>()).add(securityAlert);
        statistics.incrementSent(NotificationType.SECURITY_ALERT, NotificationPriority.CRITICAL);
        notifyObservers(securityAlert);
    }
    
    /**
     * Get notifications for user with filtering
     */
    public List<Notification> getNotifications(String username, boolean unreadOnly, 
                                             NotificationPriority minPriority, int limit) {
        List<Notification> userNots = userNotifications.getOrDefault(username, new ArrayList<>());
        
        return userNots.stream()
            .filter(n -> !unreadOnly || !n.isRead())
            .filter(n -> minPriority == null || n.getPriority().getLevel() >= minPriority.getLevel())
            .filter(n -> !n.isArchived())
            .sorted((n1, n2) -> n2.getTimestamp().compareTo(n1.getTimestamp()))
            .limit(limit > 0 ? limit : Integer.MAX_VALUE)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all notifications for user
     */
    public List<Notification> getAllNotifications(String username) {
        return getNotifications(username, false, null, 0);
    }
    
    /**
     * Get unread notifications for user
     */
    public List<Notification> getUnreadNotifications(String username) {
        return getNotifications(username, true, null, 0);
    }
    
    /**
     * Get urgent notifications (high/critical priority)
     */
    public List<Notification> getUrgentNotifications(String username) {
        return getNotifications(username, true, NotificationPriority.HIGH, 0);
    }
    
    /**
     * Mark notification as read
     */
    public boolean markAsRead(String username, String notificationId) {
        List<Notification> userNots = userNotifications.get(username);
        if (userNots != null) {
            for (Notification notification : userNots) {
                if (notification.getNotificationId().equals(notificationId)) {
                    if (!notification.isRead()) {
                        notification.markAsRead();
                        statistics.incrementRead();
                        
                        // Notify observers
                        for (NotificationObserver observer : observers) {
                            observer.onNotificationRead(notification);
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Mark all notifications as read for user
     */
    public int markAllAsRead(String username) {
        List<Notification> userNots = userNotifications.get(username);
        int markedCount = 0;
        
        if (userNots != null) {
            for (Notification notification : userNots) {
                if (!notification.isRead()) {
                    notification.markAsRead();
                    statistics.incrementRead();
                    markedCount++;
                }
            }
        }
        
        return markedCount;
    }
    
    /**
     * Archive notification
     */
    public boolean archiveNotification(String username, String notificationId) {
        List<Notification> userNots = userNotifications.get(username);
        if (userNots != null) {
            for (Notification notification : userNots) {
                if (notification.getNotificationId().equals(notificationId)) {
                    notification.archive();
                    statistics.incrementArchived();
                    
                    // Notify observers
                    for (NotificationObserver observer : observers) {
                        observer.onNotificationArchived(notification);
                    }
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Get notification count for user
     */
    public NotificationCount getNotificationCount(String username) {
        List<Notification> userNots = userNotifications.getOrDefault(username, new ArrayList<>());
        
        int total = userNots.size();
        int unread = (int) userNots.stream().filter(n -> !n.isRead() && !n.isArchived()).count();
        int urgent = (int) userNots.stream().filter(n -> !n.isRead() && n.isUrgent() && !n.isArchived()).count();
        int archived = (int) userNots.stream().filter(Notification::isArchived).count();
        
        return new NotificationCount(total, unread, urgent, archived);
    }
    
    /**
     * Get or create user preferences
     */
    public NotificationPreferences getUserPreferences(String username) {
        return userPreferences.computeIfAbsent(username, NotificationPreferences::new);
    }
    
    /**
     * Update user preferences
     */
    public void updateUserPreferences(String username, NotificationPreferences preferences) {
        userPreferences.put(username, preferences);
    }
    
    /**
     * Clean old notifications based on retention policy
     */
    public void cleanOldNotifications(int retentionDays) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);
        
        for (List<Notification> notifications : userNotifications.values()) {
            notifications.removeIf(n -> n.getTimestamp().isBefore(cutoffDate) && n.isArchived());
        }
        
        systemNotifications.removeIf(n -> n.getTimestamp().isBefore(cutoffDate));
    }
    
    /**
     * Get system statistics
     */
    public NotificationStatistics getStatistics() {
        return statistics;
    }
    
    /**
     * Get system notifications
     */
    public List<Notification> getSystemNotifications(int limit) {
        return systemNotifications.stream()
            .sorted((n1, n2) -> n2.getTimestamp().compareTo(n1.getTimestamp()))
            .limit(limit > 0 ? limit : systemNotifications.size())
            .collect(Collectors.toList());
    }
    
    /**
     * Search notifications by keyword
     */
    public List<Notification> searchNotifications(String username, String keyword, 
                                                 NotificationType type, 
                                                 LocalDateTime fromDate, 
                                                 LocalDateTime toDate) {
        List<Notification> userNots = userNotifications.getOrDefault(username, new ArrayList<>());
        
        return userNots.stream()
            .filter(n -> keyword == null || 
                        n.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                        n.getMessage().toLowerCase().contains(keyword.toLowerCase()))
            .filter(n -> type == null || n.getType() == type)
            .filter(n -> fromDate == null || n.getTimestamp().isAfter(fromDate))
            .filter(n -> toDate == null || n.getTimestamp().isBefore(toDate))
            .sorted((n1, n2) -> n2.getTimestamp().compareTo(n1.getTimestamp()))
            .collect(Collectors.toList());
    }
    
    /**
     * Helper methods
     */
    private void notifyObservers(Notification notification) {
        for (NotificationObserver observer : observers) {
            if (observer.getSubscribedTypes().contains(notification.getType())) {
                try {
                    observer.onNotificationReceived(notification);
                } catch (Exception e) {
                    // Log error but don't break notification flow
                    System.err.println("Error notifying observer " + observer.getObserverId() + ": " + e.getMessage());
                }
            }
        }
    }
    
    /**
     * Enforce notification limits per user
     */
    private void enforceNotificationLimits(String username, int maxNotifications) {
        List<Notification> userNots = userNotifications.get(username);
        if (userNots != null && userNots.size() > maxNotifications) {
            // Remove oldest archived notifications first
            userNots.removeIf(n -> n.isArchived() && 
                            n.getTimestamp().isBefore(LocalDateTime.now().minusDays(30)));
            
            // If still over limit, remove oldest read notifications
            if (userNots.size() > maxNotifications) {
                userNots.sort((n1, n2) -> n1.getTimestamp().compareTo(n2.getTimestamp()));
                while (userNots.size() > maxNotifications && !userNots.isEmpty()) {
                    Notification oldest = userNots.get(0);
                    if (oldest.isRead()) {
                        userNots.remove(0);
                    } else {
                        break; // Don't remove unread notifications
                    }
                }
            }
        }
    }
    
    /**
     * Notification count helper class
     */
    public static class NotificationCount {
        private final int total;
        private final int unread;
        private final int urgent;
        private final int archived;
        
        public NotificationCount(int total, int unread, int urgent, int archived) {
            this.total = total;
            this.unread = unread;
            this.urgent = urgent;
            this.archived = archived;
        }
        
        public int getTotal() { return total; }
        public int getUnread() { return unread; }
        public int getUrgent() { return urgent; }
        public int getArchived() { return archived; }
        public int getRead() { return total - unread - archived; }
        
        @Override
        public String toString() {
            return String.format("Total: %d, Unread: %d, Urgent: %d, Archived: %d", 
                               total, unread, urgent, archived);
        }
    }