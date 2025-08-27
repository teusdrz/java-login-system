package com.loginapp.api.dto;

import com.loginapp.model.Role;
import com.loginapp.model.User;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * UserDto class - Data Transfer Object for User entity
 * Used for API responses and requests to avoid exposing sensitive data
 */
public class UserDto {
    
    private String userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private Role role;
    private boolean active;
    private boolean locked;
    private int failedLoginAttempts;
    private LocalDateTime createdAt;
    private LocalDateTime lastModified;
    private LocalDateTime lastLoginAt;
    private String profilePicture;
    private Set<String> permissions;
    private UserStatsDto stats;
    
    // Default constructor
    public UserDto() {}
    
    // Constructor from User entity
    public UserDto(User user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.fullName = user.getFullName();
        this.role = user.getRole();
        this.active = user.isActive();
        this.locked = user.isLocked();
        this.failedLoginAttempts = user.getFailedLoginAttempts();
        this.createdAt = user.getCreatedAt();
        this.lastModified = user.getLastModifiedAt();
        this.lastLoginAt = user.getLastLoginAt();
        this.permissions = Set.of(user.getRole().getPermissions());
    }
    
    // Factory methods for different contexts
    public static UserDto fromUser(User user) {
        return new UserDto(user);
    }
    
    public static UserDto publicProfile(User user) {
        UserDto dto = new UserDto();
        dto.userId = user.getUserId();
        dto.username = user.getUsername();
        dto.firstName = user.getFirstName();
        dto.lastName = user.getLastName();
        dto.fullName = user.getFullName();
        dto.role = user.getRole();
        dto.active = user.isActive();
        dto.createdAt = user.getCreatedAt();
        return dto;
    }
    
    public static UserDto adminView(User user) {
        UserDto dto = new UserDto(user);
        dto.stats = new UserStatsDto();
        // Set available statistics - these would come from external tracking
        dto.stats.setLoginCount(0); // Would track this separately
        dto.stats.setLastIpAddress("Unknown"); // Would track this separately
        return dto;
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
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
    
    public boolean isLocked() {
        return locked;
    }
    
    public void setLocked(boolean locked) {
        this.locked = locked;
    }
    
    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }
    
    public void setFailedLoginAttempts(int failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastModified() {
        return lastModified;
    }
    
    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }
    
    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
    
    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
    
    public String getProfilePicture() {
        return profilePicture;
    }
    
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
    
    public Set<String> getPermissions() {
        return permissions;
    }
    
    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }
    
    public UserStatsDto getStats() {
        return stats;
    }
    
    public void setStats(UserStatsDto stats) {
        this.stats = stats;
    }
    
    // Helper methods
    public String getRoleDisplayName() {
        return role != null ? role.getDisplayName() : "Unknown";
    }
    
    public boolean hasPermission(String permission) {
        return permissions != null && permissions.contains(permission);
    }
    
    @Override
    public String toString() {
        return "UserDto{" +
                "userId='" + userId + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", role=" + role +
                ", active=" + active +
                ", locked=" + locked +
                '}';
    }
    
    /**
     * Inner class for user statistics
     */
    public static class UserStatsDto {
        private int loginCount;
        private String lastIpAddress;
        private int sessionCount;
        private LocalDateTime lastActivityAt;
        
        public int getLoginCount() {
            return loginCount;
        }
        
        public void setLoginCount(int loginCount) {
            this.loginCount = loginCount;
        }
        
        public String getLastIpAddress() {
            return lastIpAddress;
        }
        
        public void setLastIpAddress(String lastIpAddress) {
            this.lastIpAddress = lastIpAddress;
        }
        
        public int getSessionCount() {
            return sessionCount;
        }
        
        public void setSessionCount(int sessionCount) {
            this.sessionCount = sessionCount;
        }
        
        public LocalDateTime getLastActivityAt() {
            return lastActivityAt;
        }
        
        public void setLastActivityAt(LocalDateTime lastActivityAt) {
            this.lastActivityAt = lastActivityAt;
        }
    }
}