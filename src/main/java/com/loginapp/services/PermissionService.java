package com.loginapp.services;

import com.loginapp.model.Role;
import com.loginapp.model.User;

/**
 * PermissionService class - Centralized authorization logic
 * Handles permission checking and role-based access control
 */
public class PermissionService {
    
    // Permission constants
    public static final String USER_MANAGEMENT = "USER_MANAGEMENT";
    public static final String SYSTEM_STATS = "SYSTEM_STATS";
    public static final String LOGIN_HISTORY = "LOGIN_HISTORY";
    public static final String DELETE_USERS = "DELETE_USERS";
    public static final String MODIFY_ROLES = "MODIFY_ROLES";
    public static final String SYSTEM_SETTINGS = "SYSTEM_SETTINGS";
    public static final String VIEW_PROFILE = "VIEW_PROFILE";
    public static final String EDIT_PROFILE = "EDIT_PROFILE";
    public static final String CHANGE_PASSWORD = "CHANGE_PASSWORD";
    public static final String MODERATE_CONTENT = "MODERATE_CONTENT";
    public static final String VIEW_REPORTS = "VIEW_REPORTS";
    
    private static PermissionService instance;
    
    // Singleton pattern
    private PermissionService() {}
    
    public static PermissionService getInstance() {
        if (instance == null) {
            instance = new PermissionService();
        }
        return instance;
    }
    
    /**
     * Check if user has permission to perform action
     * @param user User to check
     * @param permission Permission required
     * @return true if authorized, false otherwise
     */
    public boolean hasPermission(User user, String permission) {
        if (user == null || permission == null) {
            return false;
        }
        
        // Check if user account is valid
        if (!user.isActive() || user.isLocked()) {
            return false;
        }
        
        return user.hasPermission(permission);
    }
    
    /**
     * Check if user can access admin functions
     * @param user User to check
     * @return true if is admin, false otherwise
     */
    public boolean isAdmin(User user) {
        return user != null && user.getRole() == Role.ADMIN && 
               user.isActive() && !user.isLocked();
    }
    
    /**
     * Check if user can access moderator functions
     * @param user User to check
     * @return true if is moderator or higher, false otherwise
     */
    public boolean isModerator(User user) {
        return user != null && 
               (user.getRole() == Role.MODERATOR || user.getRole() == Role.ADMIN) &&
               user.isActive() && !user.isLocked();
    }
    
    /**
     * Check if user can manage another user
     * @param manager User attempting to manage
     * @param target User being managed
     * @return true if can manage, false otherwise
     */
    public boolean canManageUser(User manager, User target) {
        if (manager == null || target == null) {
            return false;
        }
        
        // Cannot manage yourself through user management
        if (manager.equals(target)) {
            return false;
        }
        
        return manager.canManageUser(target);
    }
    
    /**
     * Check if user can change role of another user
     * @param changer User attempting to change role
     * @param target User whose role is being changed
     * @param newRole New role to assign
     * @return true if can change role, false otherwise
     */
    public boolean canChangeUserRole(User changer, User target, Role newRole) {
        if (!hasPermission(changer, MODIFY_ROLES)) {
            return false;
        }
        
        // Cannot change own role
        if (changer.equals(target)) {
            return false;
        }
        
        // Must be able to manage current role and new role
        return changer.getRole().canManageRole(target.getRole()) &&
               changer.getRole().canManageRole(newRole);
    }
    
    /**
     * Check if user can delete another user
     * @param deleter User attempting to delete
     * @param target User being deleted
     * @return true if can delete, false otherwise
     */
    public boolean canDeleteUser(User deleter, User target) {
        if (!hasPermission(deleter, DELETE_USERS)) {
            return false;
        }
        
        // Cannot delete yourself
        if (deleter.equals(target)) {
            return false;
        }
        
        return canManageUser(deleter, target);
    }
    
    /**
     * Check if user can view system statistics
     * @param user User to check
     * @return true if authorized, false otherwise
     */
    public boolean canViewSystemStats(User user) {
        return hasPermission(user, SYSTEM_STATS);
    }
    
    /**
     * Check if user can view login history
     * @param user User to check
     * @return true if authorized, false otherwise
     */
    public boolean canViewLoginHistory(User user) {
        return hasPermission(user, LOGIN_HISTORY);
    }
    
    /**
     * Get user's permission level description
     * @param user User to describe
     * @return Description of user's permissions
     */
    public String getUserPermissionDescription(User user) {
        if (user == null || !user.isActive() || user.isLocked()) {
            return "No permissions (inactive/locked account)";
        }
        
        switch (user.getRole()) {
            case ADMIN:
                return "Full system access - can manage all users and system settings";
            case MODERATOR:
                return "Moderate content and manage regular users";
            case USER:
                return "Basic user access - can manage own profile";
            default:
                return "Unknown permission level";
        }
    }
    
    /**
     * Validate role hierarchy for operations
     * @param actor User performing action
     * @param target User being acted upon
     * @param requiredPermission Permission needed for action
     * @return Validation result with message
     */
    public ValidationResult validateRoleOperation(User actor, User target, String requiredPermission) {
        if (actor == null) {
            return new ValidationResult(false, "Actor user is null");
        }
        
        if (!actor.isActive()) {
            return new ValidationResult(false, "Your account is inactive");
        }
        
        if (actor.isLocked()) {
            return new ValidationResult(false, "Your account is locked");
        }
        
        if (!hasPermission(actor, requiredPermission)) {
            return new ValidationResult(false, "You don't have permission: " + requiredPermission);
        }
        
        if (target != null && !canManageUser(actor, target)) {
            return new ValidationResult(false, "You cannot manage users with role: " + target.getRole().getDisplayName());
        }
        
        return new ValidationResult(true, "Operation authorized");
    }
    
    /**
     * Inner class for validation results
     */
    public static class ValidationResult {
        private final boolean isValid;
        private final String message;
        
        public ValidationResult(boolean isValid, String message) {
            this.isValid = isValid;
            this.message = message;
        }
        
        public boolean isValid() {
            return isValid;
        }
        
        public String getMessage() {
            return message;
        }
    }
}