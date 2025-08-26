package com.loginapp.model;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * UserDatabase class - Enhanced with role management and security features
 * Handles user storage, authentication, and role-based operations
 */
public class UserDatabase {
    private Map<String, User> users;
    private Map<String, User> usersByEmail;
    private List<String> loginHistory;
    private List<String> auditLog;
    private Map<String, Integer> loginAttempts;
    private final int MAX_LOGIN_ATTEMPTS = 5;
    
    // Constructor - Initialize data structures
    public UserDatabase() {
        this.users = new HashMap<>();
        this.usersByEmail = new HashMap<>();
        this.loginHistory = new ArrayList<>();
        this.auditLog = new ArrayList<>();
        this.loginAttempts = new HashMap<>();
        initializeDefaultUsers();
    }
    
    /**
     * Initialize default users for testing with different roles
     */
    private void initializeDefaultUsers() {
        // Create default admin user
        User adminUser = new User("admin", "admin123", "admin@system.com", 
                                 "System", "Administrator", Role.ADMIN);
        users.put(adminUser.getUsername(), adminUser);
        usersByEmail.put(adminUser.getEmail(), adminUser);
        
        // Create default moderator user
        User moderatorUser = new User("moderator", "mod123", "mod@system.com",
                                     "Content", "Moderator", Role.MODERATOR);
        users.put(moderatorUser.getUsername(), moderatorUser);
        usersByEmail.put(moderatorUser.getEmail(), moderatorUser);
        
        // Create default regular user
        User regularUser = new User("testuser", "password123", "test@example.com",
                                   "Test", "User", Role.USER);
        users.put(regularUser.getUsername(), regularUser);
        usersByEmail.put(regularUser.getEmail(), regularUser);
        
        addAuditLog("SYSTEM", "Default users initialized");
    }
    
    /**
     * Register new user in the system
     * @param user User object to register
     * @param registeredBy Username of user performing registration (null for self-registration)
     * @return Registration result with message
     */
    public RegistrationResult registerUser(User user, String registeredBy) {
        if (user == null) {
            return new RegistrationResult(false, "User object is null");
        }
        
        // Validate user data
        if (!user.isValid()) {
            return new RegistrationResult(false, "Invalid user data provided");
        }
        
        // Check if username already exists
        if (users.containsKey(user.getUsername())) {
            return new RegistrationResult(false, "Username already exists");
        }
        
        // Check if email already exists
        if (usersByEmail.containsKey(user.getEmail())) {
            return new RegistrationResult(false, "Email already registered");
        }
        
        // Store user in both maps
        users.put(user.getUsername(), user);
        usersByEmail.put(user.getEmail(), user);
        
        // Log registration
        String actor = registeredBy != null ? registeredBy : "SELF";
        addAuditLog(actor, "User registered: " + user.getUsername() + " with role: " + user.getRole());
        
        return new RegistrationResult(true, "User registered successfully");
    }
    
    /**
     * Overloaded method for self-registration
     */
    public RegistrationResult registerUser(User user) {
        return registerUser(user, null);
    }
    
    /**
     * Authenticate user credentials with enhanced security
     * @param username User's username
     * @param password User's password
     * @return User object if authentication successful, null otherwise
     */
    public User authenticateUser(String username, String password) {
        User user = users.get(username);
        String loginKey = username.toLowerCase();
        
        if (user == null) {
            addLoginHistory("LOGIN FAILED: User not found - " + username);
            return null;
        }
        
        // Check if account is locked
        if (user.isLocked()) {
            addLoginHistory("LOGIN BLOCKED: Account locked - " + username);
            return null;
        }
        
        // Check if account is inactive
        if (!user.isActive()) {
            addLoginHistory("LOGIN BLOCKED: Account inactive - " + username);
            return null;
        }
        
        // Verify password
        if (!user.getPassword().equals(password)) {
            user.incrementFailedAttempts();
            addLoginHistory("LOGIN FAILED: Invalid password - " + username + 
                           " (Attempts: " + user.getFailedLoginAttempts() + ")");
            
            if (user.isLocked()) {
                addAuditLog("SYSTEM", "Account auto-locked due to failed attempts: " + username);
            }
            
            return null;
        }
        
        // Successful authentication
        user.resetFailedAttempts();
        user.setLastLoginAt(LocalDateTime.now());
        
        addLoginHistory("LOGIN SUCCESS: " + username + " (" + user.getRole().getDisplayName() + ")");
        
        return user;
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
     * Get user by email
     * @param email Email to search
     * @return User object if found, null otherwise
     */
    public User getUserByEmail(String email) {
        return usersByEmail.get(email);
    }
    
    /**
     * Update user information
     * @param username Username of user to update
     * @param updatedUser Updated user object
     * @param updatedBy Username of user performing update
     * @return true if update successful, false otherwise
     */
    public boolean updateUser(String username, User updatedUser, String updatedBy) {
        User existingUser = users.get(username);
        if (existingUser == null || updatedUser == null) {
            return false;
        }
        
        // Preserve system fields
        updatedUser.setLastLoginAt(existingUser.getLastLoginAt());
        
        // Update email mapping if email changed
        if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
            usersByEmail.remove(existingUser.getEmail());
            usersByEmail.put(updatedUser.getEmail(), updatedUser);
        }
        
        // Update user in username map
        users.put(username, updatedUser);
        
        addAuditLog(updatedBy, "User updated: " + username);
        
        return true;
    }
    
    /**
     * Change user role (admin operation)
     * @param username Username of user to modify
     * @param newRole New role to assign
     * @param changedBy Username of user making the change
     * @return true if change successful, false otherwise
     */
    public boolean changeUserRole(String username, Role newRole, String changedBy) {
        User user = users.get(username);
        if (user == null || newRole == null) {
            return false;
        }
        
        Role oldRole = user.getRole();
        user.setRole(newRole);
        
        addAuditLog(changedBy, "Role changed for " + username + 
                   ": " + oldRole.getDisplayName() + " → " + newRole.getDisplayName());
        
        return true;
    }
    
    /**
     * Lock/unlock user account
     * @param username Username to lock/unlock
     * @param locked true to lock, false to unlock
     * @param changedBy Username of user making the change
     * @return true if operation successful, false otherwise
     */
    public boolean setUserLocked(String username, boolean locked, String changedBy) {
        User user = users.get(username);
        if (user == null) {
            return false;
        }
        
        user.setLocked(locked);
        String action = locked ? "locked" : "unlocked";
        
        addAuditLog(changedBy, "Account " + action + ": " + username);
        
        return true;
    }
    
    /**
     * Delete user from system
     * @param username Username to delete
     * @param deletedBy Username of user performing deletion
     * @return true if deletion successful, false otherwise
     */
    public boolean deleteUser(String username, String deletedBy) {
        User user = users.get(username);
        if (user == null) {
            return false;
        }
        
        // Remove from both maps
        users.remove(username);
        usersByEmail.remove(user.getEmail());
        
        addAuditLog(deletedBy, "User deleted: " + username + " (" + user.getRole().getDisplayName() + ")");
        
        return true;
    }
    
    /**
     * Get users by role
     * @param role Role to filter by
     * @return List of users with specified role
     */
    public List<User> getUsersByRole(Role role) {
        return users.values().stream()
                .filter(user -> user.getRole() == role)
                .collect(Collectors.toList());
    }
    
    /**
     * Get active users
     * @return List of active users
     */
    public List<User> getActiveUsers() {
        return users.values().stream()
                .filter(User::isActive)
                .collect(Collectors.toList());
    }
    
    /**
     * Get locked users
     * @return List of locked users
     */
    public List<User> getLockedUsers() {
        return users.values().stream()
                .filter(User::isLocked)
                .collect(Collectors.toList());
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
     * Check if email exists
     * @param email Email to check
     * @return true if exists, false otherwise
     */
    public boolean emailExists(String email) {
        return usersByEmail.containsKey(email);