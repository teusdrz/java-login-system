package com.loginapp;


import com.loginapp.controller.AuthController;
import com.loginapp.model.UserDatabase;
import com.loginapp.view.ConsoleView;

/**
 * Main class - Application entry point
 * Follows MVC pattern for user authentication system
 */
public class Main {
    public static void main(String[] args) {
        // Initialize components following MVC pattern
        UserDatabase userDatabase = new UserDatabase();
        ConsoleView consoleView = new ConsoleView();
        AuthController authController = new AuthController(userDatabase, consoleView);
        
        // Start the application
        System.out.println("=== Java Login System ===");
        System.out.println("Welcome to the Authentication System!");
        System.out.println();
        
        // Run the main application loop
        authController.startApplication();
    }
}