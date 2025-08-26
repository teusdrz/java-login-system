package com.loginapp.model;

/**
 * User model class - Represents user entity
 * Contains user properties and validation methods
 */
public class User {
    private String username;
    private String password;
    private String email;
    private boolean isActive;
    
    // Default constructor
    public User() {
        this.isActive = true;
    }
    
    // Parameterized constructor
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.isActive = true;
    }
    
    // Getter and setter methods
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        this.isActive = active;
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
               email.length() >= 5;
    }
    
    // Override toString for better object representation
    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", isActive=" + isActive +
                '}';
    }
    
    // Override equals for object comparison
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return username.equals(user.username);
    }
}