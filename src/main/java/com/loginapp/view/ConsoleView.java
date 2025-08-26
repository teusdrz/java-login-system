package com.loginapp.view;

import com.loginapp.model.User;
import java.util.List;
import java.util.Scanner;

/**
 * ConsoleView class - Handles user interface through console
 * Part of View layer in MVC pattern
 */
public class ConsoleView {
    private Scanner scanner;
    
    // Constructor
    public ConsoleView() {
        this.scanner = new Scanner(System.in);
    }
    
    /**
     * Display main menu options
     */
    public void displayMainMenu() {
        System.out.println("\n=== MAIN MENU ===");
        System.out.println("1. Login");
        System.out.println("2. Register");
        System.out.println("3. View Statistics");
        System.out.println("4. Exit");
        System.out.print("Choose an option (1-4): ");
    }
    
    /**
     * Display user dashboard after successful login
     * @param user Logged in user
     */
    public void displayUserDashboard(User user) {
        System.out.println("\n=== USER DASHBOARD ===");
        System.out.println("Welcome, " + user.getUsername() + "!");
        System.out.println("Email: " + user.getEmail());
        System.out.println("Account Status: " + (user.isActive() ? "Active" : "Inactive"));
        System.out.println("\nDashboard Options:");
        System.out.println("1. View Profile");
        System.out.println("2. Change Password");
        System.out.println("3. Logout");
        System.out.print("Choose an option (1-3): ");
    }
    
    /**
     * Get user input for menu selection
     * @return Selected menu option
     */
    public int getMenuChoice() {
        try {
            int choice = Integer.parseInt(scanner.nextLine().trim());
            return choice;
        } catch (NumberFormatException e) {
            return -1; // Invalid input
        }
    }
    
    /**
     * Get username input from user
     * @return Username string
     */
    public String getUsername() {
        System.out.print("Enter username: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get password input from user
     * @return Password string
     */
    public String getPassword() {
        System.out.print("Enter password: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get email input from user
     * @return Email string
     */
    public String getEmail() {
        System.out.print("Enter email: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Display success message
     * @param message Success message to display
     */
    public void displaySuccessMessage(String message) {
        System.out.println("\n✓ SUCCESS: " + message);
    }
    
    /**
     * Display error message
     * @param message Error message to display
     */
    public void displayErrorMessage(String message) {
        System.out.println("\n✗ ERROR: " + message);
    }
    
    /**
     * Display information message
     * @param message Info message to display
     */
    public void displayInfoMessage(String message) {
        System.out.println("\nℹ INFO: " + message);
    }
    
    /**
     * Display application statistics
     * @param totalUsers Total number of users
     * @param loginHistory Recent login history
     */
    public void displayStatistics(int totalUsers, List<String> loginHistory) {
        System.out.println("\n=== SYSTEM STATISTICS ===");
        System.out.println("Total Registered Users: " + totalUsers);
        System.out.println("\nRecent Login History:");
        
        if (loginHistory.isEmpty()) {
            System.out.println("No login history available.");
        } else {
            int limit = Math.min(5, loginHistory.size());
            for (int i = loginHistory.size() - limit; i < loginHistory.size(); i++) {
                System.out.println("- " + loginHistory.get(i));
            }
        }
    }
    
    /**
     * Display user profile information
     * @param user User to display
     */
    public void displayUserProfile(User user) {
        System.out.println("\n=== USER PROFILE ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Account Status: " + (user.isActive() ? "Active" : "Inactive"));
        System.out.println("Account Created: Recently"); // In real app, would show creation date
    }
    
    /**
     * Wait for user to press Enter
     */
    public void waitForEnter() {
        System.out.print("\nPress Enter to continue...");
        scanner.nextLine();
    }
    
    /**
     * Close scanner resource
     */
    public void close() {
        if (scanner != null) {
            scanner.close();
        }
    }
}