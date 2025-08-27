package com.loginapp.controller;

import com.loginapp.model.*;
import com.loginapp.model.Notification.*;
import com.loginapp.services.*;
import com.loginapp.view.ConsoleView;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * NotificationController - Advanced notification management controller
 * Handles notification operations, real-time updates, and user preferences
 */
public class NotificationController implements NotificationService.NotificationObserver {
    
    private final NotificationService notificationService;
    private final ConsoleView consoleView;
    private final PermissionService permissionService;
    private final Set<NotificationType> subscribedTypes;
    private final String observerId;
    
    // Real-time notification buffer for active users
    private final Map<String, Queue<Notification>> realtimeBuffer;
    private final Map<String, LocalDateTime> lastNotificationCheck;
    
    public NotificationController(ConsoleView consoleView) {
        this.notificationService = NotificationService.getInstance();
        this.consoleView = consoleView;
        this.permissionService = PermissionService.getInstance();
        this.subscribedTypes = EnumSet.allOf(NotificationType.class);
        this.observerId = "NOTIFICATION_CONTROLLER_" + UUID.randomUUID().toString().substring(0, 8);
        this.realtimeBuffer = new HashMap<>();
        this.lastNotificationCheck = new HashMap<>();
        
        // Register as observer for real-time notifications
        notificationService.registerObserver(this);
    }
    
    @Override
    public void onNotificationReceived(Notification notification) {
        // Add to real-time buffer for active users
        String recipient = notification.getRecipientUsername();
        if (recipient != null && !recipient.equals("SYSTEM_BROADCAST")) {
            realtimeBuffer.computeIfAbsent(recipient, k -> new LinkedList<>()).offer(notification);
            
            // Keep buffer size manageable
            Queue<Notification> buffer = realtimeBuffer.get(recipient);
            while (buffer.size() > 10) {
                buffer.poll();
            }
        }
        
        // Show real-time notification for urgent items
        if (notification.isUrgent()) {
            displayRealTimeNotification(notification);
        }
    }
    
    @Override
    public void onNotificationRead(Notification notification) {
        // Could implement read receipts or analytics here
    }
    
    @Override
    public void onNotificationArchived(Notification notification) {
        // Could implement archival analytics here
    }
    
    @Override
    public String getObserverId() {
        return observerId;
    }
    
    @Override
    public Set<NotificationType> getSubscribedTypes() {
        return new HashSet<>(subscribedTypes);
    }
    
    /**
     * Handle view all notifications
     */
    private void handleViewNotifications(User user) {
        List<Notification> notifications = notificationService.getAllNotifications(user.getUsername());
        displayNotificationList(notifications, "ALL NOTIFICATIONS", user);
    }
    
    /**
     * Handle view unread notifications
     */
    private void handleViewUnreadNotifications(User user) {
        List<Notification> notifications = notificationService.getUnreadNotifications(user.getUsername());
        displayNotificationList(notifications, "UNREAD NOTIFICATIONS", user);
    }
    
    /**
     * Handle view urgent notifications
     */
    private void handleViewUrgentNotifications(User user) {
        List<Notification> notifications = notificationService.getUrgentNotifications(user.getUsername());
        displayNotificationList(notifications, "URGENT NOTIFICATIONS", user);
    }
    
    /**
     * Handle search notifications
     */
    private void handleSearchNotifications(User user) {
        System.out.println("\n=== SEARCH NOTIFICATIONS ===");
        
        System.out.print("Enter search keyword (or press Enter to skip): ");
        String keyword = consoleView.getStringInput().trim();
        if (keyword.isEmpty()) keyword = null;
        
        // Select notification type
        NotificationType selectedType = selectNotificationType();
        
        // Date range selection
        LocalDateTime fromDate = null, toDate = null;
        System.out.print("Filter from date (yyyy-MM-dd HH:mm:ss) or press Enter to skip: ");
        String fromDateStr = consoleView.getStringInput().trim();
        if (!fromDateStr.isEmpty()) {
            try {
                fromDate = LocalDateTime.parse(fromDateStr.replace(" ", "T"));
            } catch (DateTimeParseException e) {
                consoleView.displayErrorMessage("Invalid date format. Skipping date filter.");
            }
        }
        
        if (fromDate != null) {
            System.out.print("Filter to date (yyyy-MM-dd HH:mm:ss) or press Enter to skip: ");
            String toDateStr = consoleView.getStringInput().trim();
            if (!toDateStr.isEmpty()) {
                try {
                    toDate = LocalDateTime.parse(toDateStr.replace(" ", "T"));
                } catch (DateTimeParseException e) {
                    consoleView.displayErrorMessage("Invalid date format. Using current time.");
                    toDate = LocalDateTime.now();
                }
            }
        }
        
        List<Notification> results = notificationService.searchNotifications(
            user.getUsername(), keyword, selectedType, fromDate, toDate);
        
        String searchCriteria = buildSearchCriteriaString(keyword, selectedType, fromDate, toDate);
        displayNotificationList(results, "SEARCH RESULTS - " + searchCriteria, user);
    }
    
    /**
     * Handle mark all as read
     */
    private void handleMarkAllAsRead(User user) {
        int markedCount = notificationService.markAllAsRead(user.getUsername());
        if (markedCount > 0) {
            consoleView.displaySuccessMessage("Marked " + markedCount + " notifications as read.");
        } else {
            consoleView.displayInfoMessage("No unread notifications found.");
        }
        consoleView.waitForEnter();
    }
    
    /**
     * Handle notification preferences
     */
    private void handleNotificationPreferences(User user) {
        System.out.println("\n=== NOTIFICATION PREFERENCES ===");
        
        NotificationService.NotificationPreferences prefs = notificationService.getUserPreferences(user.getUsername());
        
        System.out.println("Current Preferences:");
        System.out.println("Real-time notifications: " + (prefs.isRealTimeEnabled() ? "ENABLED" : "DISABLED"));
        System.out.println("Email notifications: " + (prefs.isEmailEnabled() ? "ENABLED" : "DISABLED"));
        System.out.println("Maximum notifications: " + prefs.getMaxNotifications());
        
        System.out.println("\nEnabled notification types:");
        for (NotificationType type : prefs.getEnabledTypes()) {
            System.out.println("  - " + type.getDisplayName());
        }
        
        System.out.println("\nEnabled priority levels:");
        for (NotificationPriority priority : prefs.getEnabledPriorities()) {
            System.out.println("  - " + priority.getDisplayName());
        }
        
        System.out.println("\n1. Toggle Real-time Notifications");
        System.out.println("2. Configure Notification Types");
        System.out.println("3. Configure Priority Levels");
        System.out.println("4. Set Maximum Notifications");
        System.out.println("0. Back");
        
        System.out.print("Choose option: ");
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                toggleRealtimeNotifications(user, prefs);
                break;
            case 2:
                configureNotificationTypes(user, prefs);
                break;
            case 3:
                configurePriorityLevels(user, prefs);
                break;
            case 4:
                setMaxNotifications(user, prefs);
                break;
        }
    }
    
    /**
     * Handle send notification (admin)
     */
    private void handleSendNotification(User user) {
        System.out.println("\n=== SEND NOTIFICATION ===");
        
        System.out.print("Recipient username: ");
        String recipient = consoleView.getStringInput().trim();
        
        NotificationType type = selectNotificationType();
        if (type == null) {
            consoleView.displayErrorMessage("Invalid notification type selected.");
            return;
        }
        
        NotificationPriority priority = selectNotificationPriority();
        if (priority == null) {
            priority = type.getDefaultPriority();
        }
        
        System.out.print("Title: ");
        String title = consoleView.getStringInput().trim();
        
        System.out.print("Message: ");
        String message = consoleView.getStringInput().trim();
        
        System.out.print("Details (optional): ");
        String details = consoleView.getStringInput().trim();
        if (details.isEmpty()) details = null;
        
        if (title.isEmpty() || message.isEmpty()) {
            consoleView.displayErrorMessage("Title and message are required.");
            return;
        }
        
        boolean success = notificationService.sendNotification(recipient, type, priority, title, message, details);
        if (success) {
            consoleView.displaySuccessMessage("Notification sent successfully to " + recipient);
        } else {
            consoleView.displayErrorMessage("Failed to send notification. Check recipient preferences.");
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handle system broadcast (admin)
     */
    private void handleSystemBroadcast(User user) {
        System.out.println("\n=== SYSTEM BROADCAST ===");
        
        NotificationType type = selectNotificationType();
        if (type == null) {
            consoleView.displayErrorMessage("Invalid notification type selected.");
            return;
        }
        
        System.out.print("Broadcast title: ");
        String title = consoleView.getStringInput().trim();
        
        System.out.print("Broadcast message: ");
        String message = consoleView.getStringInput().trim();
        
        if (title.isEmpty() || message.isEmpty()) {
            consoleView.displayErrorMessage("Title and message are required.");
            return;
        }
        
        System.out.println("\nTarget roles (press Enter to broadcast to all users):");
        Set<Role> targetRoles = selectTargetRoles();
        
        if (!consoleView.getConfirmation("Send broadcast to " + 
                                       (targetRoles.isEmpty() ? "all users" : targetRoles.size() + " role(s)") + "?")) {
            consoleView.displayInfoMessage("Broadcast cancelled.");
            return;
        }
        
        notificationService.sendSystemBroadcast(type, title, message, targetRoles.isEmpty() ? null : targetRoles);
        consoleView.displaySuccessMessage("System broadcast sent successfully.");
        consoleView.waitForEnter();
    }
    
    /**
     * Handle notification statistics (admin)
     */
    private void handleNotificationStatistics(User user) {
        System.out.println("\n=== NOTIFICATION STATISTICS ===");
        
        NotificationService.NotificationStatistics stats = notificationService.getStatistics();
        
        System.out.println("Total Sent: " + stats.getTotalSent());
        System.out.println("Total Read: " + stats.getTotalRead());
        System.out.println("Total Archived: " + stats.getTotalArchived());
        System.out.println("Unread Count: " + stats.getUnreadCount());
        System.out.println("Read Rate: " + String.format("%.1f%%", stats.getReadRate()));
        
        System.out.println("\nNotification Types:");
        Map<NotificationType, Long> typeDistribution = stats.getTypeDistribution();
        for (Map.Entry<NotificationType, Long> entry : typeDistribution.entrySet()) {
            System.out.println("  " + entry.getKey().getDisplayName() + ": " + entry.getValue());
        }
        
        System.out.println("\nPriority Levels:");
        Map<NotificationPriority, Long> priorityDistribution = stats.getPriorityDistribution();
        for (Map.Entry<NotificationPriority, Long> entry : priorityDistribution.entrySet()) {
            System.out.println("  " + entry.getKey().getDisplayName() + ": " + entry.getValue());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Display notification list with interaction
     */
    private void displayNotificationList(List<Notification> notifications, String title, User user) {
        if (notifications.isEmpty()) {
            System.out.println("\n=== " + title + " ===");
            consoleView.displayInfoMessage("No notifications found.");
            consoleView.waitForEnter();
            return;
        }
        
        int currentPage = 0;
        int pageSize = 10;
        boolean viewingList = true;
        
        while (viewingList) {
            displayNotificationPage(notifications, title, currentPage, pageSize);
            
            System.out.println("\nOptions:");
            System.out.println("[1-" + Math.min(pageSize, notifications.size() - currentPage * pageSize) + "] View notification details");
            if (currentPage > 0) System.out.println("[P] Previous page");
            if ((currentPage + 1) * pageSize < notifications.size()) System.out.println("[N] Next page");
            System.out.println("[R] Refresh | [Q] Back to menu");
            
            System.out.print("Choose option: ");
            String input = consoleView.getStringInput().trim().toUpperCase();
            
            try {
                int choice = Integer.parseInt(input);
                int index = currentPage * pageSize + choice - 1;
                if (index >= 0 && index < notifications.size()) {
                    handleNotificationDetail(notifications.get(index), user);
                }
            } catch (NumberFormatException e) {
                switch (input) {
                    case "P":
                        if (currentPage > 0) currentPage--;
                        break;
                    case "N":
                        if ((currentPage + 1) * pageSize < notifications.size()) currentPage++;
                        break;
                    case "R":
                        // Refresh notifications list
                        break;
                    case "Q":
                        viewingList = false;
                        break;
                    default:
                        consoleView.displayErrorMessage("Invalid option.");
                }
            }
        }
    }
    
    /**
     * Display notification page
     */
    private void displayNotificationPage(List<Notification> notifications, String title, int page, int pageSize) {
        System.out.println("\n=== " + title + " ===");
        System.out.println("Page " + (page + 1) + " of " + ((notifications.size() - 1) / pageSize + 1));
        System.out.println("=".repeat(70));
        
        int startIndex = page * pageSize;
        int endIndex = Math.min(startIndex + pageSize, notifications.size());
        
        for (int i = startIndex; i < endIndex; i++) {
            Notification notification = notifications.get(i);
            System.out.printf("[%d] %s %s - %s%n", 
                            i - startIndex + 1,
                            notification.getPriorityIcon(),
                            notification.getFormattedTimestamp(),
                            notification.getSummary());
        }
        
        System.out.println("=".repeat(70));
    }
    
    /**
     * Handle notification detail view
     */
    private void handleNotificationDetail(Notification notification, User user) {
        System.out.println("\n" + notification.getFullDetails());
        
        if (!notification.isRead()) {
            System.out.println("\n[M] Mark as read | [A] Archive | [B] Back");
        } else {
            System.out.println("\n[U] Mark as unread | [A] Archive | [B] Back");
        }
        
        System.out.print("Choose option: ");
        String input = consoleView.getStringInput().trim().toUpperCase();
        
        switch (input) {
            case "M":
                if (!notification.isRead()) {
                    notificationService.markAsRead(user.getUsername(), notification.getNotificationId());
                    consoleView.displaySuccessMessage("Marked as read.");
                }
                break;
            case "U":
                if (notification.isRead()) {
                    notification.markAsUnread();
                    consoleView.displaySuccessMessage("Marked as unread.");
                }
                break;
            case "A":
                notificationService.archiveNotification(user.getUsername(), notification.getNotificationId());
                consoleView.displaySuccessMessage("Notification archived.");
                break;
            case "B":
            default:
                break;
        }
    }
    
    /**
     * Display real-time notification
     */
    private void displayRealTimeNotification(Notification notification) {
        if (notification.getRecipientUsername().equals("SYSTEM_BROADCAST") || notification.isUrgent()) {
            System.out.println("\n" + "!".repeat(50));
            System.out.println("URGENT NOTIFICATION: " + notification.getTitle());
            System.out.println(notification.getMessage());
            System.out.println("!".repeat(50));
        }
    }
    
    /**
     * Check and display pending notifications for user
     */
    public void checkPendingNotifications(User user) {
        lastNotificationCheck.put(user.getUsername(), LocalDateTime.now());
        
        Queue<Notification> pending = realtimeBuffer.get(user.getUsername());
        if (pending != null && !pending.isEmpty()) {
            System.out.println("\n" + "=".repeat(50));
            System.out.println("You have " + pending.size() + " new notification(s)!");
            
            List<Notification> urgentPending = pending.stream()
                .filter(Notification::isUrgent)
                .collect(Collectors.toList());
            
            if (!urgentPending.isEmpty()) {
                System.out.println("URGENT notifications: " + urgentPending.size());
                for (Notification urgent : urgentPending) {
                    System.out.println("  " + urgent.getPriorityIcon() + " " + urgent.getTitle());
                }
            }
            
            System.out.println("=".repeat(50));
            pending.clear();
        }
    }
     * Handle notification management menu
     */
    public void handleNotificationManagement(User currentUser) {
        boolean inNotificationMenu = true;
        
        while (inNotificationMenu) {
            displayNotificationMenu(currentUser);
            int choice = consoleView.getMenuChoice();
            
            switch (choice) {
                case 1:
                    handleViewNotifications(currentUser);
                    break;
                case 2:
                    handleViewUnreadNotifications(currentUser);
                    break;
                case 3:
                    handleViewUrgentNotifications(currentUser);
                    break;
                case 4:
                    handleSearchNotifications(currentUser);
                    break;
                case 5:
                    handleMarkAllAsRead(currentUser);
                    break;
                case 6:
                    handleNotificationPreferences(currentUser);
                    break;
                case 7:
                    if (permissionService.hasPermission(currentUser, PermissionService.NOTIFICATION_ADMIN)) {
                        handleSendNotification(currentUser);
                    } else {
                        consoleView.displayErrorMessage("Access denied. Admin permission required.");
                    }
                    break;
                case 8:
                    if (permissionService.hasPermission(currentUser, PermissionService.NOTIFICATION_ADMIN)) {
                        handleSystemBroadcast(currentUser);
                    } else {
                        consoleView.displayErrorMessage("Access denied. Admin permission required.");
                    }
                    break;
                case 9:
                    if (permissionService.hasPermission(currentUser, PermissionService.NOTIFICATION_ADMIN)) {
                        handleNotificationStatistics(currentUser);
                    } else {
                        consoleView.displayErrorMessage("Access denied. Admin permission required.");
                    }
                    break;
                case 0:
                    inNotificationMenu = false;
                    break;
                default:
                    consoleView.displayErrorMessage("Invalid option. Please try again.");
                    break;
            }
        }
    }
    
    /**
     * Display notification management menu
     */
    private void displayNotificationMenu(User user) {
        NotificationService.NotificationCount count = notificationService.getNotificationCount(user.getUsername());
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("         NOTIFICATION CENTER");
        System.out.println("=".repeat(50));
        System.out.println("Total: " + count.getTotal() + " | Unread: " + count.getUnread() + 
                          " | Urgent: " + count.getUrgent() + " | Archived: " + count.getArchived());
        System.out.println();
        
        System.out.println("NOTIFICATION OPTIONS:");
        System.out.println("1. View All Notifications");
        System.out.println("2. View Unread Notifications" + 
                          (count.getUnread() > 0 ? " (" + count.getUnread() + ")" : ""));
        System.out.println("3. View Urgent Notifications" + 
                          (count.getUrgent() > 0 ? " (" + count.getUrgent() + ")" : ""));
        System.out.println("4. Search Notifications");
        System.out.println("5. Mark All as Read");
        System.out.println("6. Notification Preferences");
        
        if (permissionService.hasPermission(user, PermissionService.NOTIFICATION_ADMIN)) {
            System.out.println();
            System.out.println("ADMIN OPTIONS:");
            System.out.println("7. Send Notification");
            System.out.println("8. System Broadcast");
            System.out.println("9. View Statistics");
        }
        
        System.out.println();
        System.out.println("0. Back to Dashboard");
        System.out.println("=".repeat(50));
        System.out.print("Choose an option: ");
    }
    
    /**
     *