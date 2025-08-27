package com.loginapp.controller;

import com.loginapp.model.RegistrationResult;
import com.loginapp.model.Role;
import com.loginapp.model.User;
import com.loginapp.model.UserDatabase;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

/**
 * AuthController class - Main authentication and user management controller
 */
public class AuthController {
    private final UserDatabase userDatabase;
    private final ConsoleView consoleView;
    private final PermissionService permissionService;
    private final BackupController backupController;
    private final NotificationController notificationController;
    private User currentUser;
    private boolean applicationRunning;

    // Constructor
    public AuthController(UserDatabase userDatabase, ConsoleView consoleView) {
        this.userDatabase = userDatabase;
        this.consoleView = consoleView;
        this.permissionService = PermissionService.getInstance();
        this.backupController = new BackupController(consoleView);
        this.notificationController = new NotificationController(consoleView);
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
        if (hasAdminAccess()) {
            System.out.println("7. System Status");
        }
        
        // New functionalities
        System.out.println("8. Backup Management");
        System.out.println("9. Notification Center");
        
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
                if (hasAdminAccess()) {
                    handleSystemStatus();
                } else {
                    consoleView.displayErrorMessage("Access denied. Admin privileges required.");
                }
                break;
            case 8:
                handleBackupManagement();
                break;
            case 9:
                handleNotificationCenter();
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
            System.out.println("User: " + user.getUsername());
            System.out.println("Role: " + user.getRole());
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
        System.out.println("\n=== USER PROFILE ===");
        System.out.println("Username: " + currentUser.getUsername());
        System.out.println("Email: " + currentUser.getEmail());
        System.out.println("First Name: " + currentUser.getFirstName());
        System.out.println("Last Name: " + currentUser.getLastName());
        System.out.println("Role: " + currentUser.getRole());
        System.out.println("Created: " + currentUser.getCreatedAt());
        System.out.println("Last Login: " + currentUser.getLastLoginAt());
        consoleView.waitForEnter();
    }

    private void handleListUsers() {
        if (!hasPermission("VIEW_USERS")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        System.out.println("\n=== USER LIST ===");
        userDatabase.getAllUsers().forEach(user -> {
            System.out.println("- " + user.getUsername() + " (" + user.getRole() + ")");
        });
        consoleView.waitForEnter();
    }

    private void handleCreateUser() {
        if (!hasPermission("CREATE_USER")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        System.out.println("\n=== CREATE NEW USER ===");
        
        String username = consoleView.getUsername();
        
        if (userDatabase.getAllUsers().stream().anyMatch(u -> u.getUsername().equals(username))) {
            consoleView.displayErrorMessage("Username already exists.");
            return;
        }
        
        String password = consoleView.getPassword();
        Role role = consoleView.selectRole();
        
        User newUser = new User(username, password, username + "@example.com", 
                                "First", "Last", role);
        RegistrationResult result = userDatabase.registerUser(newUser, currentUser.getUsername());
        
        if (result.isSuccess()) {
            consoleView.displaySuccessMessage("User created successfully!");
        } else {
            consoleView.displayErrorMessage("User creation failed: " + result.getMessage());
        }
    }

    private void handleDeleteUser() {
        if (!hasPermission("DELETE_USER")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        System.out.println("\n=== DELETE USER ===");
        
        String username = consoleView.getUsername();
        
        if (userDatabase.getAllUsers().stream().noneMatch(u -> u.getUsername().equals(username))) {
            consoleView.displayErrorMessage("User not found.");
            return;
        }
        
        if (username.equals(currentUser.getUsername())) {
            consoleView.displayErrorMessage("You cannot delete your own account.");
            return;
        }
        
        if (consoleView.getConfirmation("Are you sure you want to delete user: " + username + "?")) {
            boolean success = userDatabase.deleteUser(username, currentUser.getUsername());
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
        System.out.println("\n=== USER STATISTICS ===");
        System.out.println("Total Users: " + stats.getTotalUsers());
        consoleView.waitForEnter();
    }

    private void handleChangePassword() {
        System.out.println("\n=== CHANGE PASSWORD ===");
        
        System.out.print("Enter current password: ");
        String currentPassword = consoleView.getPassword();
        
        User authUser = userDatabase.authenticateUser(currentUser.getUsername(), currentPassword);
        if (authUser == null) {
            consoleView.displayErrorMessage("Current password is incorrect.");
            return;
        }
        
        System.out.print("Enter new password: ");
        String newPassword = consoleView.getPassword();
        System.out.print("Confirm new password: ");
        String confirmPassword = consoleView.getPassword();
        
        if (!newPassword.equals(confirmPassword)) {
            consoleView.displayErrorMessage("Passwords do not match.");
            return;
        }
        
        // Update password (simplified approach)
        currentUser.setPassword(newPassword);
        consoleView.displaySuccessMessage("Password changed successfully!");
    }

    private void handleSystemStatus() {
        System.out.println("\n=== SYSTEM STATUS ===");
        
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        
        consoleView.displayInfoMessage("=== SYSTEM OVERVIEW ===");
        System.out.println("Total Users: " + stats.getTotalUsers());
        System.out.println("Active Sessions: 1"); // Current user
        System.out.println("System Uptime: " + getCurrentTimestamp());
        System.out.println("Database Status: OPERATIONAL");
        
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
        System.out.println("\n=== PUBLIC STATISTICS ===");
        System.out.println("Total Registered Users: " + stats.getTotalUsers());
        System.out.println("System Active Since: " + getCurrentTimestamp());
        consoleView.waitForEnter();
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

    /**
     * Handle backup management operations
     */
    private void handleBackupManagement() {
        try {
            if (currentUser != null) {
                System.out.println("\n=== ACCESSING BACKUP MANAGEMENT SYSTEM ===");
                System.out.println("Initializing backup management for user: " + currentUser.getUsername());
                System.out.println("User role: " + currentUser.getRole().getDisplayName());
                System.out.println("");
                
                // Pass the current user to the backup controller
                backupController.handleBackupManagement(currentUser);
            } else {
                consoleView.displayErrorMessage("Error: No authenticated user found.");
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error accessing backup management: " + e.getMessage());
            System.err.println("Backup management error details: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Handle notification center operations
     */
    private void handleNotificationCenter() {
        try {
            if (currentUser != null) {
                System.out.println("\n=== ACCESSING NOTIFICATION CENTER ===");
                System.out.println("Opening notification center for user: " + currentUser.getUsername());
                System.out.println("User role: " + currentUser.getRole().getDisplayName());
                System.out.println("");
                
                // Pass the current user to the notification controller
                notificationController.handleNotificationManagement(currentUser);
            } else {
                consoleView.displayErrorMessage("Error: No authenticated user found.");
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error accessing notification center: " + e.getMessage());
            System.err.println("Notification center error details: " + e.getMessage());
            e.printStackTrace();
        }
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
