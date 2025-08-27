package com.loginapp.api.dto;

import com.loginapp.model.Role;

/**
 * UserRegistrationDto - DTO for user registration
 * Contains all required information for creating a new user account
 */
public class UserRegistrationDto {
    
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role = Role.USER; // Default role
    
    // Default constructor
    public UserRegistrationDto() {
    }
    
    // Constructor with all fields
    public UserRegistrationDto(String username, String email, String password, 
                               String firstName, String lastName, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role != null ? role : Role.USER;
    }
    
    // Getters
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public Role getRole() {
        return role;
    }
    
    // Setters
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public void setRole(Role role) {
        this.role = role != null ? role : Role.USER;
    }
    
    // Validation helper methods
    public boolean isValid() {
        return username != null && !username.trim().isEmpty() &&
               email != null && !email.trim().isEmpty() &&
               password != null && !password.trim().isEmpty() &&
               firstName != null && !firstName.trim().isEmpty() &&
               lastName != null && !lastName.trim().isEmpty();
    }
    
    @Override
    public String toString() {
        return "UserRegistrationDto{" +
               "username='" + username + '\'' +
               ", email='" + email + '\'' +
               ", firstName='" + firstName + '\'' +
               ", lastName='" + lastName + '\'' +
               ", role=" + role +
               '}';
    }
}
