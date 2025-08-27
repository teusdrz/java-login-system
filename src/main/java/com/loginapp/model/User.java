package com.loginapp.model;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User model class - Represents user entity with role-based access
 * Enhanced with ID, role system, timestamps and additional validations
 */
public class User {
    private String userId;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private boolean isActive;
    private boolean isLocked;
    private int failedLoginAttempts;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private LocalDateTime lastModifiedAt;
    
    // Default constructor
    public User() {
        this.userId = UUID.randomUUID().toString();
        this.role = Role.USER;
        this.isActive = true;
        this.isLocked = false;
        this.failedLoginAttempts = 0;
        this.createdAt = LocalDateTime.now();
        this.lastModifiedAt = LocalDateTime.now();
    }
    
    // Basic constructor for backward compatibility
    public User(String username, String password, String email) {
        this();
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    // Full constructor
    public User(String username, String password, String email, 
                String firstName, String lastName, Role role) {
        this();
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role != null ? role : Role.USER;
    }
    
    // Getters and Setters
    public String getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
        updateModificationTime();
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
        updateModificationTime();
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
        updateModificationTime();
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateModificationTime();
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateModificationTime();
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role != null ? role : Role.USER;
        updateModificationTime();
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        this.isActive = active;
        updateModificationTime();
    }
    
    public boolean isLocked() {
        return isLocked;
    }
    
    public void setLocked(boolean locked) {
        this.isLocked = locked;
        if (locked) {
            this.failedLoginAttempts = 0;
        }
        updateModificationTime();
    }
    
    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }
    
    public void incrementFailedAttempts() {
        this.failedLoginAttempts++;
        updateModificationTime();
        
        // Auto-lock after 5 failed attempts
        if (this.failedLoginAttempts >= 5) {
            this.isLocked = true;
        }
    }
    
    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        updateModificationTime();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
    
    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
    
    public LocalDateTime getLastModifiedAt() {
        return lastModifiedAt;
    }
    
    /**
     * Get full name of user
     * @return Full name or username if names not set
     */
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return username;
    }
    
    /**
     * Check if user has specific permission
     * @param permission Permission to check
     * @return true if user has permission, false otherwise
     */
    public boolean hasPermission(String permission) {
        return isActive && !isLocked && role.hasPermission(permission);
    }
    
    /**
     * Check if user can manage another user
     * @param targetUser Target user to manage
     * @return true if can manage, false otherwise
     */
    public boolean canManageUser(User targetUser) {
        return isActive && !isLocked && 
               role.canManageRole(targetUser.getRole()) &&
               hasPermission("USER_MANAGEMENT");
    }
    
    // Validation methods
    public boolean isValidUsername() {
        return username != null && 
               username.length() >= 3 && 
               username.length() <= 20 &&
               username.matches("^[a-zA-Z0-9_]+$");
    }
    
    public boolean isValidPassword() {
        return password != null && 
               password.length() >= 6 && 
               password.length() <= 50;
    }
    
    public boolean isValidEmail() {
        return email != null && 
               email.contains("@") && 
               email.contains(".") &&
               email.length() >= 5 &&
               email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    public boolean isValidName(String name) {
        return name != null && 
               name.trim().length() >= 2 && 
               name.trim().length() <= 30 &&
               name.matches("^[a-zA-Z\\s]+$");
    }
    
    /**
     * Validate all user data
     * @return true if all data is valid, false otherwise
     */
    public boolean isValid() {
        boolean basicValid = isValidUsername() && isValidPassword() && isValidEmail();
        boolean namesValid = true;
        
        if (firstName != null) {
            namesValid = namesValid && isValidName(firstName);
        }
        if (lastName != null) {
            namesValid = namesValid && isValidName(lastName);
        }
        
        return basicValid && namesValid;
    }
    
    /**
     * Update modification timestamp
     */
    private void updateModificationTime() {
        this.lastModifiedAt = LocalDateTime.now();
    }
    
    // Override toString for better object representation
    @Override
    public String toString() {
        return "User{" +
                "userId='" + userId + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + getFullName() + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                ", isLocked=" + isLocked +
                ", createdAt=" + createdAt +
                '}';
    }
    
    // Override equals for object comparison
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return userId.equals(user.userId);
    }
    
    @Override
    public int hashCode() {
        return userId.hashCode();
    }
    
    // Additional methods for REST API compatibility
    
    /**
     * Set failed login attempts
     * @param attempts Number of failed attempts
     */
    public void setFailedLoginAttempts(int attempts) {
        this.failedLoginAttempts = attempts;
    }
    
    /**
     * Set last modified timestamp
     * @param dateTime Last modified date and time
     */
    public void setLastModifiedAt(LocalDateTime dateTime) {
        this.lastModifiedAt = dateTime;
    }
}