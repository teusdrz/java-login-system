package com.loginapp.controller;

import com.loginapp.api.dto.*;
import com.loginapp.model.*;
import com.loginapp.services.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API Controller for handling HTTP requests
 * Implements all required RESTful endpoints with JWT authentication
 * Following MVC pattern for clean architecture
 */
public class RestApiController {
    
    private final UserDatabase userDatabase;
    private final PermissionService permissionService;
    private final AuditService auditService;
    
    public RestApiController() {
        this.userDatabase = UserDatabase.getInstance();
        this.permissionService = PermissionService.getInstance();
        this.auditService = AuditService.getInstance();
    }
    
    /**
     * POST /api/auth/register - Register a new user
     * @param request User registration data
     * @return API response with user data or error
     */
    public ApiResponse<UserDto> register(UserRegistrationDto request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ApiResponse.error("Username is required", "VALIDATION_ERROR");
            }
            
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ApiResponse.error("Password must be at least 6 characters long", "VALIDATION_ERROR");
            }
            
            if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
                return ApiResponse.error("Valid email is required", "VALIDATION_ERROR");
            }
            
            // Check if username already exists
            if (userDatabase.findByUsername(request.getUsername()) != null) {
                auditService.logAuthentication(request.getUsername(), false, 
                    "Registration failed", "Username already exists");
                return ApiResponse.error("Username already exists", "CONFLICT");
            }
            
            // Create new user
            User newUser = new User(request.getUsername(), request.getPassword(), request.getEmail());
            newUser.setFirstName(request.getFirstName());
            newUser.setLastName(request.getLastName());
            newUser.setRole(Role.USER); // Default role
            
            // Add user to database
            userDatabase.addUser(newUser);
            
            // Log successful registration
            auditService.logActivity(
                AuditAction.USER_CREATED,
                AuditLevel.INFO,
                newUser.getUsername(),
                "User registered successfully",
                createUserAuditMetadata(newUser)
            );
            
            // Convert to DTO and return
            UserDto userDto = UserDto.fromUser(newUser);
            return ApiResponse.success(userDto, "User registered successfully");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Registration error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * POST /api/auth/login - Authenticate user and return JWT token
     * @param request Login credentials
     * @return API response with JWT token or error
     */
    public ApiResponse<LoginResponseDto> login(LoginRequestDto request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getPassword() == null) {
                return ApiResponse.error("Username and password are required", "VALIDATION_ERROR");
            }
            
            // Find user
            User user = userDatabase.findByUsername(request.getUsername());
            if (user == null) {
                auditService.logAuthentication(request.getUsername(), false, 
                    "Login failed", "User not found");
                return ApiResponse.error("Invalid credentials", "UNAUTHORIZED");
            }
            
            // Check if account is locked
            if (user.isLocked()) {
                auditService.logAuthentication(request.getUsername(), false, 
                    "Login failed", "Account is locked");
                return ApiResponse.error("Account is locked", "FORBIDDEN");
            }
            
            // Check if account is active
            if (!user.isActive()) {
                auditService.logAuthentication(request.getUsername(), false, 
                    "Login failed", "Account is inactive");
                return ApiResponse.error("Account is inactive", "FORBIDDEN");
            }
            
            // Validate password
            if (!user.getPassword().equals(request.getPassword())) {
                // Increment failed login attempts
                user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
                
                // Lock account after 5 failed attempts
                if (user.getFailedLoginAttempts() >= 5) {
                    user.setLocked(true);
                    auditService.logSecurityIncident(
                        user.getUsername(),
                        "Account locked due to multiple failed login attempts",
                        AuditLevel.WARNING,
                        "Failed attempts: " + user.getFailedLoginAttempts(),
                        new HashMap<>()
                    );
                }
                
                auditService.logAuthentication(request.getUsername(), false, 
                    "Login failed", "Invalid password");
                return ApiResponse.error("Invalid credentials", "UNAUTHORIZED");
            }
            
            // Successful login - reset failed attempts
            user.setFailedLoginAttempts(0);
            user.setLastLoginAt(LocalDateTime.now());
            
            // Generate JWT token
            String token = JwtService.generateToken(user);
            
            // Create response
            LoginResponseDto response = new LoginResponseDto(
                token,
                null, // Refresh token (implement if needed)
                LocalDateTime.now().plusHours(1),
                user
            );
            
            // Log successful login
            auditService.logAuthentication(request.getUsername(), true, 
                "Login successful", "JWT token generated");
            
            return ApiResponse.success(response, "Login successful");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Login error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * GET /api/users - List all users (Admin only)
     * @param authToken JWT token for authentication
     * @return API response with users list or error
     */
    public ApiResponse<List<UserDto>> getAllUsers(String authToken) {
        try {
            // Validate token
            if (!JwtService.validateToken(authToken)) {
                return ApiResponse.error("Invalid or expired token", "UNAUTHORIZED");
            }
            
            // Get current user
            String username = JwtService.getUsernameFromToken(authToken);
            User currentUser = userDatabase.findByUsername(username);
            
            if (currentUser == null) {
                return ApiResponse.error("User not found", "UNAUTHORIZED");
            }
            
            // Check admin permission
            if (!permissionService.hasPermission(currentUser, "USER_MANAGEMENT")) {
                auditService.logAuthorization(username, "GET_ALL_USERS", false, "/api/users");
                return ApiResponse.error("Insufficient permissions", "FORBIDDEN");
            }
            
            // Get all users and convert to DTOs
            List<UserDto> users = userDatabase.getAllUsers().stream()
                .map(UserDto::fromUser)
                .collect(Collectors.toList());
            
            auditService.logAuthorization(username, "GET_ALL_USERS", true, "/api/users");
            
            return ApiResponse.success(users, "Users retrieved successfully");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Get users error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * PUT /api/users/{id} - Update user information (Admin only)
     * @param userId User ID to update
     * @param request Update data
     * @param authToken JWT token for authentication
     * @return API response with updated user or error
     */
    public ApiResponse<UserDto> updateUser(String userId, UserUpdateDto request, String authToken) {
        try {
            // Validate token
            if (!JwtService.validateToken(authToken)) {
                return ApiResponse.error("Invalid or expired token", "UNAUTHORIZED");
            }
            
            // Get current user
            String username = JwtService.getUsernameFromToken(authToken);
            User currentUser = userDatabase.findByUsername(username);
            
            if (currentUser == null) {
                return ApiResponse.error("User not found", "UNAUTHORIZED");
            }
            
            // Check admin permission
            if (!permissionService.hasPermission(currentUser, "USER_MANAGEMENT")) {
                auditService.logAuthorization(username, "UPDATE_USER", false, "/api/users/" + userId);
                return ApiResponse.error("Insufficient permissions", "FORBIDDEN");
            }
            
            // Find user to update
            User userToUpdate = userDatabase.findById(userId);
            if (userToUpdate == null) {
                return ApiResponse.error("User not found", "NOT_FOUND");
            }
            
            // Update user fields
            if (request.getEmail() != null && isValidEmail(request.getEmail())) {
                userToUpdate.setEmail(request.getEmail());
            }
            if (request.getFirstName() != null) {
                userToUpdate.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                userToUpdate.setLastName(request.getLastName());
            }
            if (request.getRole() != null) {
                userToUpdate.setRole(request.getRole());
            }
            if (request.getIsActive() != null) {
                userToUpdate.setActive(request.getIsActive());
            }
            
            userToUpdate.setLastModifiedAt(LocalDateTime.now());
            
            // Log update
            auditService.logActivity(
                AuditAction.USER_UPDATED,
                AuditLevel.INFO,
                username,
                "User updated: " + userToUpdate.getUsername(),
                createUserAuditMetadata(userToUpdate)
            );
            
            auditService.logAuthorization(username, "UPDATE_USER", true, "/api/users/" + userId);
            
            UserDto updatedUserDto = UserDto.fromUser(userToUpdate);
            return ApiResponse.success(updatedUserDto, "User updated successfully");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Update user error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * DELETE /api/users/{id} - Delete user (Admin only)
     * @param userId User ID to delete
     * @param authToken JWT token for authentication
     * @return API response confirming deletion or error
     */
    public ApiResponse<Void> deleteUser(String userId, String authToken) {
        try {
            // Validate token
            if (!JwtService.validateToken(authToken)) {
                return ApiResponse.error("Invalid or expired token", "UNAUTHORIZED");
            }
            
            // Get current user
            String username = JwtService.getUsernameFromToken(authToken);
            User currentUser = userDatabase.findByUsername(username);
            
            if (currentUser == null) {
                return ApiResponse.error("User not found", "UNAUTHORIZED");
            }
            
            // Check admin permission
            if (!permissionService.hasPermission(currentUser, "USER_MANAGEMENT")) {
                auditService.logAuthorization(username, "DELETE_USER", false, "/api/users/" + userId);
                return ApiResponse.error("Insufficient permissions", "FORBIDDEN");
            }
            
            // Find user to delete
            User userToDelete = userDatabase.findById(userId);
            if (userToDelete == null) {
                return ApiResponse.error("User not found", "NOT_FOUND");
            }
            
            // Prevent self-deletion
            if (userToDelete.getUsername().equals(username)) {
                return ApiResponse.error("Cannot delete your own account", "FORBIDDEN");
            }
            
            // Delete user
            userDatabase.removeUser(userToDelete);
            
            // Log deletion
            auditService.logActivity(
                AuditAction.USER_DELETED,
                AuditLevel.WARNING,
                username,
                "User deleted: " + userToDelete.getUsername(),
                createUserAuditMetadata(userToDelete)
            );
            
            auditService.logAuthorization(username, "DELETE_USER", true, "/api/users/" + userId);
            
            return ApiResponse.success(null, "User deleted successfully");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Delete user error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * PUT /api/profile - Update current user's profile
     * @param request Profile update data
     * @param authToken JWT token for authentication
     * @return API response with updated profile or error
     */
    public ApiResponse<UserDto> updateProfile(UserUpdateDto request, String authToken) {
        try {
            // Validate token
            if (!JwtService.validateToken(authToken)) {
                return ApiResponse.error("Invalid or expired token", "UNAUTHORIZED");
            }
            
            // Get current user
            String username = JwtService.getUsernameFromToken(authToken);
            User currentUser = userDatabase.findByUsername(username);
            
            if (currentUser == null) {
                return ApiResponse.error("User not found", "UNAUTHORIZED");
            }
            
            // Update profile fields (users can only update their own basic info)
            if (request.getEmail() != null && isValidEmail(request.getEmail())) {
                currentUser.setEmail(request.getEmail());
            }
            if (request.getFirstName() != null) {
                currentUser.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                currentUser.setLastName(request.getLastName());
            }
            
            currentUser.setLastModifiedAt(LocalDateTime.now());
            
            // Log profile update
            auditService.logActivity(
                AuditAction.USER_UPDATED,
                AuditLevel.INFO,
                username,
                "Profile updated",
                createUserAuditMetadata(currentUser)
            );
            
            UserDto updatedUserDto = UserDto.fromUser(currentUser);
            return ApiResponse.success(updatedUserDto, "Profile updated successfully");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Update profile error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * PUT /api/profile/password - Change current user's password
     * @param request Password change data
     * @param authToken JWT token for authentication
     * @return API response confirming password change or error
     */
    public ApiResponse<Void> changePassword(PasswordChangeDto request, String authToken) {
        try {
            // Validate token
            if (!JwtService.validateToken(authToken)) {
                return ApiResponse.error("Invalid or expired token", "UNAUTHORIZED");
            }
            
            // Get current user
            String username = JwtService.getUsernameFromToken(authToken);
            User currentUser = userDatabase.findByUsername(username);
            
            if (currentUser == null) {
                return ApiResponse.error("User not found", "UNAUTHORIZED");
            }
            
            // Validate current password
            if (!currentUser.getPassword().equals(request.getCurrentPassword())) {
                auditService.logSecurityIncident(
                    username,
                    "Failed password change attempt",
                    AuditLevel.WARNING,
                    "Incorrect current password provided",
                    new HashMap<>()
                );
                return ApiResponse.error("Current password is incorrect", "UNAUTHORIZED");
            }
            
            // Validate new password
            if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                return ApiResponse.error("New password must be at least 6 characters long", "VALIDATION_ERROR");
            }
            
            // Check if new password is different from current
            if (request.getNewPassword().equals(request.getCurrentPassword())) {
                return ApiResponse.error("New password must be different from current password", "VALIDATION_ERROR");
            }
            
            // Update password
            currentUser.setPassword(request.getNewPassword());
            currentUser.setLastModifiedAt(LocalDateTime.now());
            
            // Log password change
            auditService.logActivity(
                AuditAction.PASSWORD_CHANGED,
                AuditLevel.INFO,
                username,
                "Password changed successfully",
                new HashMap<>()
            );
            
            return ApiResponse.success(null, "Password changed successfully");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Change password error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * POST /api/auth/logout - Logout and invalidate token
     * @param authToken JWT token to invalidate
     * @return API response confirming logout
     */
    public ApiResponse<Void> logout(String authToken) {
        try {
            if (authToken != null && JwtService.validateToken(authToken)) {
                String username = JwtService.getUsernameFromToken(authToken);
                JwtService.invalidateToken(authToken);
                
                if (username != null) {
                    auditService.logAuthentication(username, true, "Logout successful", "JWT token invalidated");
                }
            }
            
            return ApiResponse.success(null, "Logout successful");
            
        } catch (Exception e) {
            auditService.logActivity(
                AuditAction.SYSTEM_ERROR,
                AuditLevel.ERROR,
                "system",
                "Logout error: " + e.getMessage(),
                new HashMap<>()
            );
            return ApiResponse.error("Internal server error", "INTERNAL_ERROR");
        }
    }
    
    /**
     * Validate email format
     * @param email Email to validate
     * @return true if valid, false otherwise
     */
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    /**
     * Create audit metadata for user operations
     * @param user User object
     * @return metadata map
     */
    private Map<String, Object> createUserAuditMetadata(User user) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("userId", user.getUserId());
        metadata.put("username", user.getUsername());
        metadata.put("email", user.getEmail());
        metadata.put("role", user.getRole().name());
        metadata.put("isActive", user.isActive());
        metadata.put("lastModified", user.getLastModifiedAt());
        return metadata;
    }
}
