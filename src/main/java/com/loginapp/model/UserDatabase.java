package com.loginapp.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * UserDatabase class - Simulates database operations
 * Handles user storage and retrieval (in-memory storage)
 */
public class UserDatabase {
    private Map<String, User> users;
    private List<String> loginHistory;
    
    // Constructor - Initialize data structures
    public UserDatabase() {
        this.users = new HashMap<>();
        this.loginHistory = new ArrayList<>();
        initializeDefaultUsers();
    }
    
    /**
     * Initialize default users for testing
     */
    private void initializeDefaultUsers() {
        // Create default admin user
        User adminUser = new User("admin", "admin123", "admin@example.com");
        users.put(adminUser.getUsername(), adminUser);
        
        // Create default test user
        User testUser = new User("testuser", "password123", "test@example.com");
        users.put(testUser.getUsername(), testUser);
    }
    
    /**
     * Register new user in the system
     * @param user User object to register
     * @return true if registration successful, false otherwise
     */
    public boolean registerUser(User user) {
        if (user == null || !user.isValidUsername() || 
            !user.isValidPassword() || !user.isValidEmail()) {
            return false;
        }
        
        // Check if username already exists
        if (users.containsKey(user.getUsername())) {
            return false;
        }
        
        // Store user in database
        users.put(user.getUsername(), user);
        return true;
    }
    
    /**
     * Authenticate user credentials
     * @param username User's username
     * @param password User's password
     * @return User object if authentication successful, null otherwise
     */
    public User authenticateUser(String username, String password) {
        User user = users.get(username);
        
        if (user != null && user.isActive() && user.getPassword().equals(password)) {
            // Log successful login
            loginHistory.add("LOGIN SUCCESS: " + username + " at " + 
                           java.time.LocalDateTime.now());
            return user;
        }
        
        // Log failed login attempt
        loginHistory.add("LOGIN FAILED: " + username + " at " + 
                       java.time.LocalDateTime.now());
        return null;
    }
    
    /**
     * Get user by username
     * @param username Username to search
     * @return User object if found, null otherwise
     */
    public User getUserByUsername(String username) {
        return users.get(username);
    }
    
    /**
     * Check if username exists
     * @param username Username to check
     * @return true if exists, false otherwise
     */
    public boolean usernameExists(String username) {
        return users.containsKey(username);
    }
    
    /**
     * Get total number of registered users
     * @return Number of users
     */
    public int getTotalUsers() {
        return users.size();
    }
    
    /**
     * Get login history (for admin purposes)
     * @return List of login attempts
     */
    public List<String> getLoginHistory() {
        return new ArrayList<>(loginHistory);
    }
    
    /**
     * Get all users (for admin purposes)
     * @return List of all users
     */
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
}