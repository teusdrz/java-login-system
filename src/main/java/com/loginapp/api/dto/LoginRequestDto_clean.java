package com.loginapp.api.dto;

/**
 * LoginRequestDto - Login request DTO
 */
public class LoginRequestDto {
    private String username;
    private String password;
    private String ipAddress;
    private String userAgent;
    private boolean rememberMe;

    // Constructors
    public LoginRequestDto() {}

    public LoginRequestDto(String username, String password, String ipAddress, String userAgent, boolean rememberMe) {
        this.username = username;
        this.password = password;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.rememberMe = rememberMe;
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

    public boolean isRememberMe() {
        return rememberMe;
    }
    
    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
}
