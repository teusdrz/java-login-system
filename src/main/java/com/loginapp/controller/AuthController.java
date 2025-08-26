package com.loginapp.controller;

import com.loginapp.model.User;
import com.loginapp.model.UserDatabase;
import com.loginapp.view.ConsoleView;

/**
 * AuthController class - Controls authentication flow
 * Part of Controller layer in MVC pattern
 */
public class AuthController {
    private UserDatabase userDatabase;
    private ConsoleView consoleView;
    private User currentUser;
    private boolean applicationRunning;
    
    // Constructor
    public AuthController(UserDatabase userDatabase, ConsoleView consoleView) {
        this.userDatabase = userDatabase;
        this.consoleView = consoleView;
        this.currentUser = null;
        this.applicationRunning = true;
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
        consoleView.close();
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
                handleStatistics();
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
     * Handle user dashboard interactions
     */
    private void handleUserDashboard() {
        consoleView.displayUserDashboard(currentUser);
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                handleViewProfile();
                break;
            case 2:
                handleChangePassword();
                break;
            case 3:
                handleLogout();
                break;
            default:
                consoleView.displayErrorMessage("Invalid option. Please choose 1-3.");
                break;
        }
    }
    
    /**
     * Handle user login process
     */
    private void handleLogin() {
        System.out.println("\n=== LOGIN ===");
        
        String username = consoleView.getUsername();
        String password = consoleView.getPassword();
        
        // Validate input
        if (username.isEmpty() || password.isEmpty()) {
            consoleView.displayErrorMessage("Username and password cannot be empty.");
            return;
        }
        
        // Attempt authentication
        User authenticatedUser = userDatabase.authenticateUser(username, password);
        
        if (authenticatedUser != null) {
            currentUser = authenticatedUser;
            consoleView.displaySuccessMessage("Login successful! Welcome, " + username + "!");
        } else {
            consoleView.displayErrorMessage("Invalid username or password. Please try again.");
        }
    }
    
    /**
     * Handle user registration process
     */
    private void handleRegistration() {
        System.out.println("\n=== REGISTRATION ===");
        
        String username = consoleView.getUsername();
        String password = consoleView.getPassword();
        String email = consoleView.getEmail();
        
        // Create new user object
        User newUser = new User(username, password, email);
        
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
        
        // Attempt registration
        if (userDatabase.registerUser(newUser)) {
            consoleView.displaySuccessMessage("Registration successful! You can now login with your credentials.");
        } else {
            consoleView.displayErrorMessage("Registration failed. Username might already exist.");
        }
    }
    
    /**
     * Handle view profile functionality
     */
    private void handleViewProfile() {
        consoleView.displayUserProfile(currentUser);
        consoleView.waitForEnter();
    }
    
    /**
     * Handle change password functionality
     */
    private void handleChangePassword() {
        System.out.println("\n=== CHANGE PASSWORD ===");
        
        String currentPassword = consoleView.getPassword();
        
        if (!currentUser.getPassword().equals(currentPassword)) {
            consoleView.displayErrorMessage("Current password is incorrect.");
            return;
        }
        
        System.out.print("Enter new password: ");
        String newPassword = consoleView.getPassword();
        
        if (newPassword.length() < 6 || newPassword.length() > 50) {
            consoleView.displayErrorMessage("New password must be 6-50 characters long.");
            return;
        }
        
        currentUser.setPassword(newPassword);
        consoleView.displaySuccessMessage("Password changed successfully!");
    }
    
    /**
     * Handle logout functionality
     */
    private void handleLogout() {
        String username = currentUser.getUsername();
        currentUser = null;
        consoleView.displaySuccessMessage("Logout successful. Goodbye, " + username + "!");
    }
    
    /**
     * Handle statistics display
     */
    private void handleStatistics() {
        int totalUsers = userDatabase.getTotalUsers();
        var loginHistory = userDatabase.getLoginHistory();
        
        consoleView.displayStatistics(totalUsers, loginHistory);
        consoleView.waitForEnter();
    }
    
    /**
     * Exit the application
     */
    private void exitApplication() {
        applicationRunning = false;
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