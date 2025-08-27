package com.loginapp.api.dto;

import com.loginapp.model.Role;
import com.loginapp.model.User;
import java.time.LocalDateTime;

/**
 * User Data Transfer Object
 * Represents user information for API responses
 */
public class UserDto {
    private String userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String roleDisplayName;
    private Role role;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    
    // Default constructor
    public UserDto() {}
    
    // Constructor with basic fields
    public UserDto(String username, String email, String firstName, String lastName, Role role) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.roleDisplayName = role.getDisplayName();
        this.fullName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
        this.isActive = true;
    }
    
    /**
     * Create UserDto from User entity
     * @param user User entity
     * @return UserDto
     */
    public static UserDto fromUser(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setRoleDisplayName(user.getRole().getDisplayName());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLoginAt(user.getLastLoginAt());
        
        // Generate full name
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        String last = user.getLastName() != null ? user.getLastName() : "";
        dto.setFullName((first + " " + last).trim());
        
        return dto;
    }
    
    /**
     * Create public profile DTO (limited information)
     * @param user User entity
     * @return UserDto with public information only
     */
    public static UserDto publicProfile(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRoleDisplayName(user.getRole().getDisplayName());
        
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        String last = user.getLastName() != null ? user.getLastName() : "";
        dto.setFullName((first + " " + last).trim());
        
        return dto;
    }
    
    /**
     * Create admin view DTO (all information)
     * @param user User entity
     * @return UserDto with all information
     */
    public static UserDto adminView(User user) {
        return fromUser(user); // Admin can see all information
    }
    
    // Getters and Setters
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
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
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getRoleDisplayName() {
        return roleDisplayName;
    }
    
    public void setRoleDisplayName(String roleDisplayName) {
        this.roleDisplayName = roleDisplayName;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
        this.roleDisplayName = role != null ? role.getDisplayName() : "";
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
    
    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
    
    @Override
    public String toString() {
        return "UserDto{" +
                "userId='" + userId + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                '}';
    }
    
    /**
     * Inner class for user statistics
     */
    public static class UserStatsDto {
        private int totalUsers;
        private int activeUsers;
        private int inactiveUsers;
        private String mostCommonRole;
        
        public UserStatsDto(int totalUsers, int activeUsers, int inactiveUsers, String mostCommonRole) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.inactiveUsers = inactiveUsers;
            this.mostCommonRole = mostCommonRole;
        }
        
        // Getters and setters
        public int getTotalUsers() { return totalUsers; }
        public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }
        
        public int getActiveUsers() { return activeUsers; }
        public void setActiveUsers(int activeUsers) { this.activeUsers = activeUsers; }
        
        public int getInactiveUsers() { return inactiveUsers; }
        public void setInactiveUsers(int inactiveUsers) { this.inactiveUsers = inactiveUsers; }
        
        public String getMostCommonRole() { return mostCommonRole; }
        public void setMostCommonRole(String mostCommonRole) { this.mostCommonRole = mostCommonRole; }
    }
}
