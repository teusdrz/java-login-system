package com.loginapp;

import com.loginapp.controller.AuthController;
import com.loginapp.model.UserDatabase;
import com.loginapp.view.ConsoleView;

/**
 * Main class - Enhanced Application Entry Point
 * Initializes the role-based authentication system with MVC architecture
 */
public class Main {
    
    private static final String WELCOME_BANNER = """
            
            ╔══════════════════════════════════════════════════════════════╗
            ║                                                              ║
            ║                 JAVA AUTHENTICATION SYSTEM                  ║
            ║                                                              ║
            ║                    Enhanced Security Edition                 ║
            ║                                                              ║
            ║  Features:                                                   ║
            ║  • Role-based Access Control (RBAC)                         ║
            ║  • User Management System                                    ║
            ║  • Security Audit Logging                                   ║
            ║  • Account Lock Protection                                   ║
            ║  • Advanced Permission System                               ║
            ║                                                              ║
            ╚══════════════════════════════════════════════════════════════╝
            
            """;
    
    public static void main(String[] args) {
        try {
            // Display welcome banner
            System.out.println(WELCOME_BANNER);
            
            // Initialize system components following MVC pattern
            System.out.println("Initializing system components...");
            
            UserDatabase userDatabase = new UserDatabase();
            ConsoleView consoleView = new ConsoleView();
            AuthController authController = new AuthController(userDatabase, consoleView);
            
            System.out.println("✓ Database initialized");
            System.out.println("✓ View components loaded");
            System.out.println("✓ Authentication controller ready");
            System.out.println("✓ Permission system activated");
            
            // Display default users information
            displayDefaultUsers();
            
            // Start the application
            System.out.println("\n" + "=".repeat(60));
            System.out.println("                  SYSTEM READY");
            System.out.println("=".repeat(60));
            System.out.println();
            
            // Run the main application loop
            authController.run();
            
        } catch (Exception e) {
            System.err.println("FATAL ERROR: Application failed to start");
            System.err.println("Error details: " + e.getMessage());
            System.err.println("\nPlease contact system administrator.");
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    /**
     * Display information about default users for testing
     */
    private static void displayDefaultUsers() {
        System.out.println("\n" + "─".repeat(60));
        System.out.println("                DEFAULT TEST ACCOUNTS");
        System.out.println("─".repeat(60));
        
        System.out.println("ADMINISTRATOR ACCOUNT:");
        System.out.println("  Username: admin");
        System.out.println("  Password: admin123");
        System.out.println("  Role:     Administrator");
        System.out.println("  Access:   Full system management");
        
        System.out.println("\nMODERATOR ACCOUNT:");
        System.out.println("  Username: moderator");
        System.out.println("  Password: mod123");
        System.out.println("  Role:     Moderator");
        System.out.println("  Access:   User management & content moderation");
        
        System.out.println("\nREGULAR USER ACCOUNT:");
        System.out.println("  Username: testuser");
        System.out.println("  Password: password123");
        System.out.println("  Role:     Regular User");
        System.out.println("  Access:   Profile management only");
        
        System.out.println("\n" + "─".repeat(60));
        System.out.println("Note: These are test accounts for demonstration purposes.");
        System.out.println("In production, change default passwords immediately!");
        System.out.println("─".repeat(60));
    }
}