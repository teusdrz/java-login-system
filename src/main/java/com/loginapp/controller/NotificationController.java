package com.loginapp.controller;

import com.loginapp.model.User;
import com.loginapp.view.ConsoleView;

/**
 * NotificationController - Simplified notification management
 */
public class NotificationController {
    private final ConsoleView consoleView;
    
    public NotificationController(ConsoleView consoleView) {
        this.consoleView = consoleView;
    }
    
    /**
     * Handle notification management menu
     */
    public void handleNotificationManagement(User currentUser) {
        System.out.println("\n=== NOTIFICATION MANAGEMENT ===");
        System.out.println("1. View Notifications");
        System.out.println("2. Mark All as Read");
        System.out.println("0. Back");
        System.out.print("Choose an option: ");
        
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                handleViewNotifications(currentUser);
                break;
            case 2:
                handleMarkAllAsRead(currentUser);
                break;
            case 0:
                return;
            default:
                consoleView.displayErrorMessage("Invalid option.");
        }
    }
    
    private void handleViewNotifications(User user) {
        System.out.println("\n=== YOUR NOTIFICATIONS ===");
        System.out.println("No new notifications.");
        consoleView.waitForEnter();
    }
    
    private void handleMarkAllAsRead(User user) {
        System.out.println("All notifications marked as read.");
        consoleView.waitForEnter();
    }
    
    /**
     * Check for pending notifications
     */
    public void checkPendingNotifications(User user) {
        // Simplified implementation - no actual notifications to check
    }
}
