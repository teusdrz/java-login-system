package com.loginapp.controller;

import com.loginapp.model.User;
import com.loginapp.model.Role;
import com.loginapp.model.Notification;
import com.loginapp.model.UserDatabase;
import com.loginapp.model.RegistrationResult;
import com.loginapp.services.PermissionService;
import com.loginapp.services.NotificationService;
import com.loginapp.view.ConsoleView;

import java.util.List;

/**
 * AuthController class - Enhanced with role-based access control,
 * notifications, and backup system integration
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
        
        // Initialize notification observers for system events
        initializeSystemNotifications();
    }

    /**
     * Initialize system notifications for important events
     */
    private void initializeSystemNotifications() {
        // System would set up observers for login events, security issues, etc.
    }

    /**
     * Start the main application loop
     */
    public void startApplication() {
        while (applicationRunning) {
            if (currentUser == null) {
                handleMainMenu();
            } else {
                handleUserDashboard();
            }
        }

        // Clean up resources
        shutdown();
        consoleView.displayInfoMessage("Application closed. Goodbye!");
    }

    /**
     * Handle main menu interactions
     */
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
            case 4:
                exitApplication();
                break;
            default:
                consoleView.displayErrorMessage("Invalid option. Please choose 1-4.");
                break;
        }
    }

    /**
     * Enhanced user dashboard with new advanced features
     */
    private void handleUserDashboard() {
        // Check for pending notifications before showing dashboard
        notificationController.checkPendingNotifications(currentUser);
        
        // Check backup-related notifications for admins
        backupController.checkBackupNotifications(currentUser);
        
        consoleView.displayUserDashboard(currentUser);
        int choice = consoleView.getMenuChoice();

        switch (choice) {
            case 1:
                handleViewProfile();
                break;
            case 2:
                handleEditProfile();
                break;
            case 3:
                handleChangePassword();
                break;
            case 4:
                if (permissionService.hasPermission(currentUser, PermissionService.SYSTEM_STATS)) {
                    handleSystemStatistics();
                } else {
                    consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
                }
                break;
            case 5:
                if (permissionService.hasPermission(currentUser, PermissionService.LOGIN_HISTORY)) {
                    handleLoginHistory();
                } else {
                    consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
                }
                break;
            case 6:
                if (permissionService.hasPermission(currentUser, PermissionService.USER_MANAGEMENT)) {
                    handleUserManagement();
                } else {
                    consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
                }
                break;
            case 7:
                if (permissionService.hasPermission(currentUser, PermissionService.SYSTEM_SETTINGS)) {
                    handleSystemAdministration();
                } else {
                    consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
                }
                break;
            case 8: // NEW: Notification Center
                handleNotificationCenter();
                break;
            case 9: // NEW: Backup & Recovery
                if (permissionService.hasPermission(currentUser, "BACKUP_SYSTEM")) {
                    backupController.handleBackupManagement(currentUser);
                } else {
                    consoleView.displayErrorMessage("Access denied. Backup system permission required.");
                }
                break;
            case 0:
                handleLogout();
                break;
            default:
                consoleView.displayErrorMessage("Invalid option. Please try again.");
                break;
        }
    }

    /**
     * Handle notification center access
     */
    private void handleNotificationCenter() {
        notificationController.handleNotificationManagement(currentUser);
    }

    /**
     * Handle user management menu
     */
    private void handleUserManagement() {
        boolean inUserManagement = true;

        while (inUserManagement) {
            consoleView.displayUserManagementMenu();
            int choice = consoleView.getMenuChoice();

            switch (choice) {
                case 1:
                    handleListAllUsers();
                    break;
                case 2:
                    handleSearchUsers();
                    break;
                case 3:
                    handleCreateUser();
                    break;
                case 4:
                    handleModifyUserRole();
                    break;
                case 5:
                    handleLockUnlockUser();
                    break;
                case 6:
                    handleDeleteUser();
                    break;
                case 0:
                    inUserManagement = false;
                    break;
                default:
                    consoleView.displayErrorMessage("Invalid option. Please try again.");
                    break;
            }
        }
    }

    /**
     * Handle system administration menu
     */
    private void handleSystemAdministration() {
        boolean inSystemAdmin = true;

        while (inSystemAdmin) {
            consoleView.displaySystemAdminMenu();
            int choice = consoleView.getMenuChoice();

            switch (choice) {
                case 1:
                    handleViewAuditLog();
                    break;
                case 2:
                    handleSystemHealthCheck();
                    break;
                case 3:
                    handleUserStatisticsReport();
                    break;
                case 4:
                    handleSecurityReport();
                    break;
                case 5:
                    handleNotificationManagement();
                    break;
                case 6:
                    handleBackupSystemStatus();
                    break;
                case 0:
                    inSystemAdmin = false;
                    break;
                default:
                    consoleView.displayErrorMessage("Invalid option. Please try again.");
                    break;
            }
        }
    }

    /**
     * Enhanced login with security notifications
     */
    private void handleLogin() {
        System.out.println("\n=== LOGIN ===");

        String username = consoleView.getUsername();
        String password = consoleView.getPassword();

        // Validate input
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            consoleView.displayErrorMessage("Username and password cannot be empty.");
            return;
        }

        // Attempt authentication
        User authenticatedUser = userDatabase.authenticateUser(username, password);

        if (authenticatedUser != null) {
            currentUser = authenticatedUser;
            consoleView.displaySuccessMessage("Login successful! Welcome, " +
                                            authenticatedUser.getFullName() + " (" +
                                            authenticatedUser.getRole().getDisplayName() + ")!");
            
            // Send login success notification
            notificationService.sendNotification(username,
                Notification.NotificationType.LOGIN_SUCCESS,
                "Login Successful",
                "Successful login from " + getCurrentTimestamp());
            
            // Check for system alerts for admins
            if (authenticatedUser.getRole().hasPermission("NOTIFICATION_ADMIN")) {
                checkAndSendSystemAlerts(authenticatedUser);
            }
            
        } else {
            User user = userDatabase.getUserByUsername(username);
            if (user != null && user.isLocked()) {
                consoleView.displayErrorMessage("Account is locked due to multiple failed login attempts. Contact administrator.");
                
                // Send security alert to admins
                sendSecurityAlertToAdmins("Account Lock Attempt", 
                    "User " + username + " attempted to login with locked account");
                    
            } else if (user != null && !user.isActive()) {
                consoleView.displayErrorMessage("Account is inactive. Contact administrator.");
            } else {
                consoleView.displayErrorMessage("Invalid username or password.");
                
                // Send failed login notification if user exists
                if (user != null) {
                    notificationService.sendNotification(username,
                        Notification.NotificationType.LOGIN_FAILURE,
                        "Login Failed",
                        "Failed login attempt from " + getCurrentTimestamp());
                    
                    // Send security alert if multiple failures
                    if (user.getFailedLoginAttempts() >= 3) {
                        sendSecurityAlertToAdmins("Multiple Failed Login Attempts",
                            "User " + username + " has " + user.getFailedLoginAttempts() + " failed attempts");
                    }
                }
            }
        }
    }

    /**
     * Handle user registration process with role assignment
     */
    private void handleRegistration() {
        System.out.println("\n=== REGISTRATION ===");

        String username = consoleView.getUsername();
        String password = consoleView.getPassword();
        String email = consoleView.getEmail();
        String firstName = consoleView.getFirstName();
        String lastName = consoleView.getLastName();

        // Create new user object (default role is USER)
        User newUser = new User(username, password, email, firstName, lastName, Role.USER);

        // Validate user data
        if (!newUser.isValidUsername()) {
            consoleView.displayErrorMessage("Invalid username. Must be 3-20 characters, alphanumeric and underscore only.");
            return;
        }

        if (!newUser.isValidPassword()) {
            consoleView.displayErrorMessage("Invalid password. Must be 6-50 characters long.");
            return;
        }

        if (!newUser.isValidEmail()) {
            consoleView.displayErrorMessage("Invalid email format.");
            return;
        }

        if (firstName != null && !firstName.isEmpty() && !newUser.isValidName(firstName)) {
            consoleView.displayErrorMessage("Invalid first name. Must be 2-30 characters, letters and spaces only.");
            return;
        }

        if (lastName != null && !lastName.isEmpty() && !newUser.isValidName(lastName)) {
            consoleView.displayErrorMessage("Invalid last name. Must be 2-30 characters, letters and spaces only.");
            return;
        }

        // Registration with error handling
        try {
            RegistrationResult registrationResult = userDatabase.registerUser(newUser);
            if (registrationResult.isSuccess()) {
                consoleView.displaySuccessMessage("Registration successful! You can now login with your credentials.");
                
                // Send welcome notification
                notificationService.sendNotification(username,
                    Notification.NotificationType.USER_CREATED,
                    "Welcome to the System",
                    "Your account has been created successfully. Welcome aboard!");
                    
            } else {
                consoleView.displayErrorMessage("Registration failed: " + registrationResult.getMessage());
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Handle view profile functionality
     */
    private void handleViewProfile() {
        consoleView.displayDetailedUserProfile(currentUser);
        consoleView.waitForEnter();
    }

    /**
     * Handle edit profile functionality
     */
    private void handleEditProfile() {
        System.out.println("\n=== EDIT PROFILE ===");
        consoleView.displayInfoMessage("Leave blank to keep current value");

        String newFirstName = consoleView.getFirstName();
        String newLastName = consoleView.getLastName();
        String newEmail = consoleView.getEmail();

        boolean updated = false;

        // Update first name if provided
        if (newFirstName != null && !newFirstName.isEmpty()) {
            if (currentUser.isValidName(newFirstName)) {
                currentUser.setFirstName(newFirstName);
                updated = true;
            } else {
                consoleView.displayErrorMessage("Invalid first name format.");
                return;
            }
        }

        // Update last name if provided
        if (newLastName != null && !newLastName.isEmpty()) {
            if (currentUser.isValidName(newLastName)) {
                currentUser.setLastName(newLastName);
                updated = true;
            } else {
                consoleView.displayErrorMessage("Invalid last name format.");
                return;
            }
        }

        // Update email if provided
        if (newEmail != null && !newEmail.isEmpty()) {
            if (!userDatabase.emailExists(newEmail) || newEmail.equals(currentUser.getEmail())) {
                if (isValidEmail(newEmail)) {
                    currentUser.setEmail(newEmail);
                    updated = true;
                } else {
                    consoleView.displayErrorMessage("Invalid email format.");
                    return;
                }
            } else {
                consoleView.displayErrorMessage("Email already exists.");
                return;
            }
        }

        if (updated) {
            userDatabase.updateUser(currentUser.getUsername(), currentUser, currentUser.getUsername());
            consoleView.displaySuccessMessage("Profile updated successfully!");
            
            // Send profile update notification
            notificationService.sendNotification(currentUser.getUsername(),
                Notification.NotificationType.PROFILE_UPDATED,
                "Profile Updated",
                "Your profile information has been updated successfully");
        } else {
            consoleView.displayInfoMessage("No changes made to profile.");
        }
    }

    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@") && email.contains(".") && email.length() > 5;
    }

    /**
     * Enhanced password change with notifications
     */
    private void handleChangePassword() {
        System.out.println("\n=== CHANGE PASSWORD ===");

        System.out.print("Enter current password: ");
        String currentPassword = consoleView.getPassword();

        // Validate current password through authentication
        User tempUser = userDatabase.authenticateUser(currentUser.getUsername(), currentPassword);
        if (tempUser == null) {
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

        // Validate new password
        if (newPassword.length() < 6 || newPassword.length() > 50) {
            consoleView.displayErrorMessage("New password must be 6-50 characters long.");
            return;
        }

        currentUser.setPassword(newPassword);
        userDatabase.updateUser(currentUser.getUsername(), currentUser, currentUser.getUsername());
        consoleView.displaySuccessMessage("Password changed successfully!");
        
        // Send notification about password change
        notificationService.sendNotification(currentUser.getUsername(),
            Notification.NotificationType.PASSWORD_CHANGED,
            "Password Changed",
            "Your password was successfully changed at " + getCurrentTimestamp());
    }

    /**
     * Handle logout functionality
     */
    private void handleLogout() {
        if (currentUser != null) {
            String username = currentUser.getUsername();
            consoleView.displaySuccessMessage("Logout successful. Goodbye, " + username + "!");
            currentUser = null;
        }
    }

    /**
     * Handle public statistics display
     */
    private void handlePublicStatistics() {
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        consoleView.displayEnhancedStatistics(stats, userDatabase.getRecentLoginHistory(5));
        consoleView.waitForEnter();
    }

    /**
     * Handle system statistics (admin only)
     */
    private void handleSystemStatistics() {
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        consoleView.displayEnhancedStatistics(stats, userDatabase.getLoginHistory());
        consoleView.waitForEnter();
    }

    /**
     * Handle login history display
     */
    private void handleLoginHistory() {
        List<String> history = userDatabase.getLoginHistory();
        System.out.println("\n=== LOGIN HISTORY ===");

        if (history.isEmpty()) {
            consoleView.displayInfoMessage("No login history available.");
        } else {
            int limit = Math.min(20, history.size());
            int startIndex = history.size() - limit;

            for (int i = startIndex; i < history.size(); i++) {
                System.out.println((i - startIndex + 1) + ". " + history.get(i));
            }
        }

        consoleView.waitForEnter();
    }

    /**
     * Handle list all users
     */
    private void handleListAllUsers() {
        List<User> users = userDatabase.getAllUsers();
        consoleView.displayUsersList(users);
        consoleView.waitForEnter();
    }

    /**
     * Handle search users functionality
     */
    private void handleSearchUsers() {
        String searchTerm = consoleView.getSearchTerm();

        if (searchTerm == null || searchTerm.isEmpty()) {
            consoleView.displayInfoMessage("Search cancelled.");
            return;
        }

        List<User> results = userDatabase.searchUsers(searchTerm);

        if (results.isEmpty()) {
            consoleView.displayInfoMessage("No users found matching: " + searchTerm);
        } else {
            System.out.println("\nSearch results for: " + searchTerm);
            consoleView.displayUsersList(results);
        }

        consoleView.waitForEnter();
    }

    /**
     * Enhanced user creation with notifications
     */
    private void handleCreateUser() {
        System.out.println("\n=== CREATE NEW USER ===");

        String username = consoleView.getUsername();
        String password = consoleView.getPassword();
        String email = consoleView.getEmail();
        String firstName = consoleView.getFirstName();
        String lastName = consoleView.getLastName();

        System.out.println("\nSelect role for new user:");
        Role selectedRole = consoleView.selectRole();

        if (selectedRole == null) {
            consoleView.displayErrorMessage("Invalid role selection.");
            return;
        }

        // Check if current user can assign this role
        if (!permissionService.canChangeUserRole(currentUser, new User(), selectedRole)) {
            consoleView.displayErrorMessage("You cannot assign the role: " + selectedRole.getDisplayName());
            return;
        }

        // Create new user
        User newUser = new User(username, password, email, firstName, lastName, selectedRole);

        // Validate user data
        if (!newUser.isValid()) {
            consoleView.displayErrorMessage("Invalid user data. Please check all fields.");
            return;
        }

        // Register user
        try {
            RegistrationResult registrationResult = userDatabase.registerUser(newUser, currentUser.getUsername());
            if (registrationResult.isSuccess()) {
                consoleView.displaySuccessMessage("User created successfully: " + username +
                                                " (" + selectedRole.getDisplayName() + ")");
                
                // Send notification to new user
                notificationService.sendNotification(username,
                    Notification.NotificationType.USER_CREATED,
                    "Welcome to the System",
                    "Your account has been created successfully by " + currentUser.getUsername());
                
                // Send notification to creator
                notificationService.sendNotification(currentUser.getUsername(),
                    Notification.NotificationType.USER_CREATED,
                    "User Created",
                    "Successfully created user: " + username + " (" + selectedRole.getDisplayName() + ")");
                    
            } else {
                consoleView.displayErrorMessage("User creation failed: " + registrationResult.getMessage());
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("User creation failed: " + e.getMessage());
        }
    }

    /**
     * Enhanced role modification with notifications
     */
    private void handleModifyUserRole() {
        System.out.println("\n=== MODIFY USER ROLE ===");

        String username = consoleView.getUsername();
        User targetUser = userDatabase.getUserByUsername(username);

        if (targetUser == null) {
            consoleView.displayErrorMessage("User not found: " + username);
            return;
        }

        System.out.println("Current role: " + targetUser.getRole().getDisplayName());
        System.out.println("\nSelect new role:");
        Role newRole = consoleView.selectRole();

        if (newRole == null) {
            consoleView.displayErrorMessage("Invalid role selection.");
            return;
        }

        if (targetUser.getRole() == newRole) {
            consoleView.displayInfoMessage("User already has this role.");
            return;
        }

        // Check permissions
        PermissionService.ValidationResult validation =
            permissionService.validateRoleOperation(currentUser, targetUser, PermissionService.MODIFY_ROLES);

        if (!validation.isValid()) {
            consoleView.displayErrorMessage(validation.getMessage());
            return;
        }

        if (!permissionService.canChangeUserRole(currentUser, targetUser, newRole)) {
            consoleView.displayErrorMessage("You cannot change this user's role to: " + newRole.getDisplayName());
            return;
        }

        // Confirm action
        if (!consoleView.getConfirmation("Change " + username + "'s role from " +
                                       targetUser.getRole().getDisplayName() + " to " +
                                       newRole.getDisplayName() + "?")) {
            consoleView.displayInfoMessage("Operation cancelled.");
            return;
        }

        // Perform role change
        if (userDatabase.changeUserRole(username, newRole, currentUser.getUsername())) {
            consoleView.displaySuccessMessage("Role changed successfully for user: " + username);
            
            // Send notification to affected user
            notificationService.sendNotification(username,
                Notification.NotificationType.ROLE_CHANGED,
                "Role Changed",
                "Your role has been changed to " + newRole.getDisplayName() + " by " + currentUser.getUsername());
            
            // Send notification to administrator
            notificationService.sendNotification(currentUser.getUsername(),
                Notification.NotificationType.ROLE_CHANGED,
                "Role Change Completed",
                "Successfully changed " + username + "'s role to " + newRole.getDisplayName());
                
        } else {
            consoleView.displayErrorMessage("Failed to change user role.");
        }
    }

    /**
     * Handle lock/unlock user functionality
     */
    private void handleLockUnlockUser() {
        System.out.println("\n=== LOCK/UNLOCK USER ===");

        String username = consoleView.getUsername();
        User targetUser = userDatabase.getUserByUsername(username);

        if (targetUser == null) {
            consoleView.displayErrorMessage("User not found: " + username);
            return;
        }

        // Check permissions
        if (!permissionService.canManageUser(currentUser, targetUser)) {
            consoleView.displayErrorMessage("You cannot manage this user.");
            return;
        }

        boolean currentLockStatus = targetUser.isLocked();
        String action = currentLockStatus ? "unlock" : "lock";

        System.out.println("User: " + username);
        System.out.println("Current status: " + (currentLockStatus ? "LOCKED" : "UNLOCKED"));

        if (!consoleView.getConfirmation("Do you want to " + action + " this user?")) {
            consoleView.displayInfoMessage("Operation cancelled.");
            return;
        }

        if (userDatabase.setUserLocked(username, !currentLockStatus, currentUser.getUsername())) {
            consoleView.displaySuccessMessage("User " + username + " has been " + action + "ed successfully.");
        } else {
            consoleView.displayErrorMessage("Failed to " + action + " user.");
        }
    }

    /**
     * Handle delete user functionality
     */
    private void handleDeleteUser() {
        System.out.println("\n=== DELETE USER ===");

        String username = consoleView.getUsername();
        User targetUser = userDatabase.getUserByUsername(username);

        if (targetUser == null) {
            consoleView.displayErrorMessage("User not found: " + username);
            return;
        }

        // Check permissions
        if (!permissionService.canDeleteUser(currentUser, targetUser)) {
            consoleView.displayErrorMessage("You cannot delete this user.");
            return;
        }

        System.out.println("User to delete: " + username + " (" + targetUser.getRole().getDisplayName() + ")");
        consoleView.displayWarningMessage("This action cannot be undone!");

        if (!consoleView.getConfirmation("Are you sure you want to delete this user?")) {
            consoleView.displayInfoMessage("Operation cancelled.");
            return;
        }

        // Double confirmation for admin users
        if (targetUser.getRole() == Role.ADMIN) {
            consoleView.displayWarningMessage("You are about to delete an ADMIN user! Type 'DELETE' to confirm.");
            System.out.print("Confirmation: ");
            String confirmation = consoleView.getStringInput();
            if (confirmation != null) {
                confirmation = confirmation.trim();
            }
            if (!"DELETE".equalsIgnoreCase(confirmation)) {
                consoleView.displayInfoMessage("Operation cancelled - confirmation failed.");
                return;
            }
        }

        if (userDatabase.deleteUser(username, currentUser.getUsername())) {
            consoleView.displaySuccessMessage("User " + username + " has been deleted successfully.");
        } else {
            consoleView.displayErrorMessage("Failed to delete user.");
        }
    }

    /**
     * Handle view audit log functionality
     */
    private void handleViewAuditLog() {
        List<String> auditLog = userDatabase.getAuditLog();
        consoleView.displayAuditLog(auditLog);
        consoleView.waitForEnter();
    }

    /**
     * Handle system health check
     */
    private void handleSystemHealthCheck() {
        System.out.println("\n=== SYSTEM HEALTH CHECK ===");

        UserDatabase.SystemStats stats = userDatabase.getSystemStats();

        System.out.println("System Status: OPERATIONAL");
        System.out.println("Total Users: " + stats.getTotalUsers());
        System.out.println("Active Users: " + stats.getActiveUsers());
        System.out.println("Locked Accounts: " + stats.getLockedUsers());

        // Check for potential issues
        if (stats.getLockedUsers() > 0) {
            consoleView.displayWarningMessage("There are " + stats.getLockedUsers() + " locked accounts.");
        }

        if (stats.getTotalUsers() > 0) {
            double lockPercentage = (double) stats.getLockedUsers() / stats.getTotalUsers() * 100;
            if (lockPercentage > 20) {
                consoleView.displayWarningMessage("High percentage of locked accounts: " +
                                                String.format("%.1f%%", lockPercentage));
            }
        }

        consoleView.displaySuccessMessage("System health check completed.");
        consoleView.waitForEnter();
    }

    /**
     * Handle user statistics report
     */
    private void handleUserStatisticsReport() {
        UserDatabase.SystemStats stats = userDatabase.getSystemStats();
        consoleView.displayEnhancedStatistics(stats, userDatabase.getRecentLoginHistory(10));
        consoleView.waitForEnter();
    }

    /**
     * Handle security report
     */
    private void handleSecurityReport() {
        System.out.println("\n=== SECURITY REPORT ===");

        List<User> lockedUsers = userDatabase.getLockedUsers();
        System.out.println("Locked Accounts: " + lockedUsers.size());

        if (!lockedUsers.isEmpty()) {
            System.out.println("\nLocked Users:");
            for (User user : lockedUsers) {
                System.out.println("  - " + user.getUsername() + " (" +
                                 user.getFailedLoginAttempts() + " failed attempts)");
            }
        }

        // Recent login failures
        List<String> recentHistory = userDatabase.getRecentLoginHistory(20);
        long failureCount = recentHistory.stream()
            .filter(entry -> entry.contains("LOGIN FAILED"))
            .count();

        System.out.println("\nRecent Login Failures: " + failureCount + " out of last " +
                          Math.min(20, recentHistory.size()) + " attempts");

        if (failureCount > 10) {
            consoleView.displayWarningMessage("High number of recent login failures detected!");
        }

        consoleView.waitForEnter();
    }

    private void handleNotificationManagement() {
        notificationController.handleAdminNotificationManagement(currentUser);
    }

    private void handleBackupSystemStatus() {
        backupController.handleBackupSystemStatus(currentUser);
    }

    /**
     * Exit the application
     */
    private void exitApplication() {
        applicationRunning = false;
    }

    /**
     * Helper method to get current timestamp
     */
    private String getCurrentTimestamp() {
        return java.time.LocalDateTime.now().format(
            java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * Check and send system alerts for administrators
     */
    private void checkAndSendSystemAlerts(User admin) {
        // Check for users with multiple failed login attempts
        List<User> usersWithFailures = userDatabase.getAllUsers().stream()
            .filter(user -> user.getFailedLoginAttempts() >= 3)
            .collect(java.util.stream.Collectors.toList());
        
        if (!usersWithFailures.isEmpty()) {
            notificationService.sendNotification(admin.getUsername(),
                Notification.NotificationType.SECURITY_ALERT,
                "Users with Failed Login Attempts",
                usersWithFailures.size() + " user(s) have multiple failed login attempts");
        }
        
        // Check for locked accounts
        List<User> lockedUsers = userDatabase.getLockedUsers();
        if (!lockedUsers.isEmpty()) {
            notificationService.sendNotification(admin.getUsername(),
                Notification.NotificationType.SECURITY_ALERT,
                "Locked Accounts Alert",
                lockedUsers.size() + " account(s) are currently locked");
        }
    }

    /**
     * Send security alert to all administrators
     */
    private void sendSecurityAlertToAdmins(String title, String message) {
        List<User> admins = userDatabase.getUsersByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.sendNotification(admin.getUsername(),
                Notification.NotificationType.SECURITY_ALERT,
                Notification.NotificationPriority.HIGH,
                title,
                message,
                "Immediate attention may be required");
        }
    }

    /**
     * Enhanced cleanup on application shutdown
     */
    public void shutdown() {
        if (notificationController != null) {
            notificationController.shutdown();
        }
        
        // Clean up other resources
        consoleView.close();
    }

    /**
     * Get current logged in user
     * @return Current user or null if not logged in
     */
    public User getCurrentUser() {
        return currentUser;
    }

    /**
     * Check if user is logged in
     * @return true if user is logged in, false otherwise
     */
    public boolean isUserLoggedIn() {
        return currentUser != null;
    }
}