package com.loginapp.api.dto;

import com.loginapp.model.User;
import java.time.LocalDateTime;

/**
 * LoginResponseDto - Login response DTO
 */
public class LoginResponseDto {
    private String token;
    private String refreshToken;
    private LocalDateTime expiresAt;
    private UserDto user;
    private String message;

    // Constructors
    public LoginResponseDto() {}

    public LoginResponseDto(String token, String refreshToken, LocalDateTime expiresAt, User user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.user = UserDto.fromUser(user);
        this.message = "Login successful";
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
