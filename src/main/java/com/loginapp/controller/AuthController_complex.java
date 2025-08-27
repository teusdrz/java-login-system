package com.loginapp.controller;

import com.loginapp.model.User;
import com.loginapp.model.Role;
import com.loginapp.model.UserDatabase;
import com.loginapp.model.RegistrationResult;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

/**
 * AuthController class - Main authentication and user management controller
 */
public class AuthController {
    private final UserDatabase userDatabase;
    private final ConsoleView consoleView;
    private final PermissionService permissionService;
    private final NotificationController notificationController;
    private final BackupController backupController;
    private User currentUser;
    private boolean applicationRunning;

    // Constructor
    public AuthController(UserDatabase userDatabase, ConsoleView consoleView) {
        this.userDatabase = userDatabase;
        this.consoleView = consoleView;
        this.permissionService = PermissionService.getInstance();
        this.notificationController = new NotificationController(consoleView);
        this.backupController = new BackupController(consoleView);
        this.currentUser = null;
        this.applicationRunning = true;
    }

    public void run() {
        System.out.println("=== LOGIN SYSTEM ===");
        
        while (applicationRunning) {
            if (currentUser == null) {
                handleMainMenu();
            } else {
                handleLoggedInMenu();
            }
        }
        
        System.out.println("Goodbye!");
    }

    private void handleMainMenu() {
        consoleView.displayMainMenu();
        
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                handleLogin();
                break;
            case 2:
                handleRegistration();
                break;
            case 3:
                handlePublicStatistics();
                break;
            case 0:
                applicationRunning = false;
                break;
            default:
                consoleView.displayErrorMessage("Invalid option. Please try again.");
        }
    }

    private void handleLoggedInMenu() {
        System.out.println("\n=== MAIN MENU - Welcome " + currentUser.getUsername() + " ===");
        System.out.println("1. View Profile");
        System.out.println("2. List Users");
        System.out.println("3. Create User");
        System.out.println("4. Delete User");
        System.out.println("5. User Statistics");
        System.out.println("6. Change Password");
        System.out.println("7. View Notifications");
        if (hasAdminAccess()) {
            System.out.println("8. Backup Management");
            System.out.println("9. Notification Management");
            System.out.println("10. System Status");
        }
        System.out.println("0. Logout");
        System.out.print("Choose an option: ");
        
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                handleUserProfile();
                break;
            case 2:
                handleListUsers();
                break;
            case 3:
                handleCreateUser();
                break;
            case 4:
                handleDeleteUser();
                break;
            case 5:
                handleUserStatistics();
                break;
            case 6:
                handleChangePassword();
                break;
            case 7:
                handleViewNotifications();
                break;
            case 8:
                if (hasAdminAccess()) {
                    handleBackupManagement();
                } else {
                    consoleView.displayErrorMessage("Access denied. Admin privileges required.");
                }
                break;
            case 9:
                if (hasAdminAccess()) {
                    handleNotificationManagement();
                } else {
                    consoleView.displayErrorMessage("Access denied. Admin privileges required.");
                }
                break;
            case 10:
                if (hasAdminAccess()) {
                    handleSystemStatus();
                } else {
                    consoleView.displayErrorMessage("Access denied. Admin privileges required.");
                }
                break;
            case 0:
                handleLogout();
                break;
            default:
                consoleView.displayErrorMessage("Invalid option. Please try again.");
        }
    }

    private void handleLogin() {
        System.out.println("\n=== LOGIN ===");
        
        String username = consoleView.getUsername();
        String password = consoleView.getPassword();
        
        User user = userDatabase.authenticateUser(username, password);
        
        if (user != null) {
            currentUser = user;
            consoleView.displaySuccessMessage("Login successful! Welcome, " + user.getUsername() + "!");
            
            // Display user info
            System.out.println("User: " + user.getUsername());
            System.out.println("Role: " + user.getRole());
            
            // Check for pending notifications
            notificationController.checkPendingNotifications(currentUser);
        } else {
            consoleView.displayErrorMessage("Invalid username or password.");
        }
    }

    private void handleRegistration() {
        System.out.println("\n=== USER REGISTRATION ===");
        
        String username = consoleView.getUsername();
        
        if (userDatabase.getAllUsers().stream().anyMatch(u -> u.getUsername().equals(username))) {
            consoleView.displayErrorMessage("Username already exists. Please choose a different username.");
            return;
        }
        
        String password = consoleView.getPassword();
        
        // For the first user, automatically assign ADMIN role
        Role role = userDatabase.getAllUsers().isEmpty() ? Role.ADMIN : Role.USER;
        
        User newUser = new User(username, password, username + "@example.com", 
                                "First", "Last", role);
        RegistrationResult result = userDatabase.registerUser(newUser);
        
        if (result.isSuccess()) {
            consoleView.displaySuccessMessage("User registered successfully!");
            if (role == Role.ADMIN) {
                consoleView.displayInfoMessage("First user registered as ADMIN.");
            }
        } else {
            consoleView.displayErrorMessage("Registration failed: " + result.getMessage());
        }
    }

    private void handleUserProfile() {
        consoleView.displayUserProfile(currentUser, userDatabase);
    }

    private void handleListUsers() {
        if (!hasPermission("VIEW_USERS")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        consoleView.displayUserList(userDatabase.getAllUsers());
    }

    private void handleCreateUser() {
        if (!hasPermission("CREATE_USER")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        consoleView.displaySectionHeader("CREATE NEW USER");
        
        String username = consoleView.getUsername();
        
        if (userDatabase.userExists(username)) {
            consoleView.displayErrorMessage("Username already exists.");
            return;
        }
        
        String password = consoleView.getPassword();
        Role role = consoleView.selectRole();
        
        RegistrationResult result = userDatabase.registerUser(username, password, role);
        
        if (result == RegistrationResult.SUCCESS) {
            consoleView.displaySuccessMessage("User created successfully!");
        } else {
            consoleView.displayErrorMessage("User creation failed: " + result.getDescription());
        }
    }

    private void handleDeleteUser() {
        if (!hasPermission("DELETE_USER")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        consoleView.displaySectionHeader("DELETE USER");
        
        String username = consoleView.getUsername();
        
        if (!userDatabase.userExists(username)) {
            consoleView.displayErrorMessage("User not found.");
            return;
        }
        
        if (username.equals(currentUser.getUsername())) {
            consoleView.displayErrorMessage("You cannot delete your own account.");
            return;
        }
        
        if (consoleView.getConfirmation("Are you sure you want to delete user: " + username + "?")) {
            boolean success = userDatabase.deleteUser(username);
            if (success) {
                consoleView.displaySuccessMessage("User deleted successfully!");
            } else {
                consoleView.displayErrorMessage("Failed to delete user.");
            }
        }
    }

    private void handleUserStatistics() {
        if (!hasPermission("VIEW_STATISTICS")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        consoleView.displayDetailedStatistics(stats);
    }

    private void handleChangePassword() {
        consoleView.displaySectionHeader("CHANGE PASSWORD");
        
        String currentPassword = consoleView.getPassword("Enter current password: ");
        
        if (!userDatabase.verifyPassword(currentUser.getUsername(), currentPassword)) {
            consoleView.displayErrorMessage("Current password is incorrect.");
            return;
        }
        
        String newPassword = consoleView.getPassword("Enter new password: ");
        String confirmPassword = consoleView.getPassword("Confirm new password: ");
        
        if (!newPassword.equals(confirmPassword)) {
            consoleView.displayErrorMessage("Passwords do not match.");
            return;
        }
        
        boolean success = userDatabase.changePassword(currentUser.getUsername(), newPassword);
        if (success) {
            consoleView.displaySuccessMessage("Password changed successfully!");
        } else {
            consoleView.displayErrorMessage("Failed to change password.");
        }
    }

    private void handleViewNotifications() {
        notificationController.handleNotificationManagement(currentUser);
    }

    private void handleBackupManagement() {
        backupController.handleBackupManagement(currentUser);
    }

    private void handleNotificationManagement() {
        notificationController.handleNotificationManagement(currentUser);
    }

    private void handleSystemStatus() {
        consoleView.displaySectionHeader("SYSTEM STATUS");
        
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        
        consoleView.displayInfoMessage("=== SYSTEM OVERVIEW ===");
        System.out.println("Total Users: " + stats.getTotalUsers());
        System.out.println("Active Sessions: 1"); // Current user
        System.out.println("System Uptime: " + getCurrentTimestamp());
        System.out.println("Database Status: OPERATIONAL");
        
        // Additional system information
        System.out.println("\n=== USER BREAKDOWN ===");
        System.out.println("Administrators: " + stats.getAdminCount());
        System.out.println("Regular Users: " + stats.getUserCount());
        
        System.out.println("\n=== RECENT ACTIVITY ===");
        System.out.println("Last Login: " + getCurrentTimestamp());
        
        consoleView.waitForEnter();
    }

    private void handleLogout() {
        if (currentUser != null) {
            String username = currentUser.getUsername();
            consoleView.displaySuccessMessage("Logout successful. Goodbye, " + username + "!");
            currentUser = null;
        }
    }

    private void handlePublicStatistics() {
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        consoleView.displayPublicStatistics(stats);
    }

    // Helper methods
    private boolean hasAdminAccess() {
        return currentUser != null && currentUser.getRole() == Role.ADMIN;
    }

    private boolean hasPermission(String permission) {
        return permissionService.hasPermission(currentUser, permission);
    }

    private String getCurrentTimestamp() {
        return java.time.LocalDateTime.now().format(
            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    // Shutdown method
    public void shutdown() {
        try {
            if (currentUser != null) {
                handleLogout();
            }
            applicationRunning = false;
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error during shutdown: " + e.getMessage());
        }
    }
}
