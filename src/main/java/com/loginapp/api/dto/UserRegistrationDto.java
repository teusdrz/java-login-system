package com.loginapp.api.dto;

/**
 * UserRegistrationDto - User registration request DTO
 */
public class UserRegistrationDto {
    private String username;
    private String password;
    private String confirmPassword;
    private String email;
    private String firstName;
    private String lastName;
    private String ipAddress;
    private String userAgent;

    // Constructors
    public UserRegistrationDto() {}

    public UserRegistrationDto(String username, String password, String confirmPassword, 
                              String email, String firstName, String lastName, 
                              String ipAddress, String userAgent) {
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    // Getters and Setters
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

    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
