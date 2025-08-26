package com.loginapp.model;

/**
 * Role enum - Defines user roles and their permissions
 * Used for access control throughout the application
 */
public enum Role {
    ADMIN("Administrator", 3, new String[]{
        "USER_MANAGEMENT", "SYSTEM_STATS", "LOGIN_HISTORY", 
        "DELETE_USERS", "MODIFY_ROLES", "SYSTEM_SETTINGS"
    }),
    
    MODERATOR("Moderator", 2, new String[]{
        "USER_MANAGEMENT", "SYSTEM_STATS", "LOGIN_HISTORY",
        "MODERATE_CONTENT", "VIEW_REPORTS"
    }),
    
    USER("Regular User", 1, new String[]{
        "VIEW_PROFILE", "EDIT_PROFILE", "CHANGE_PASSWORD"
    });
    
    private final String displayName;
    private final int level;
    private final String[] permissions;
    
    // Constructor
    Role(String displayName, int level, String[] permissions) {
        this.displayName = displayName;
        this.level = level;
        this.permissions = permissions;
    }
    
    // Getters
    public String getDisplayName() {
        return displayName;
    }
    
    public int getLevel() {
        return level;
    }
    
    public String[] getPermissions() {
        return permissions.clone();
    }
    
    /**
     * Check if role has specific permission
     * @param permission Permission to check
     * @return true if role has permission, false otherwise
     */
    public boolean hasPermission(String permission) {
        for (String perm : permissions) {
            if (perm.equals(permission)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if this role can perform actions on target role
     * @param targetRole Target role to check against
     * @return true if can manage, false otherwise
     */
    public boolean canManageRole(Role targetRole) {
        return this.level > targetRole.level;
    }
    
    /**
     * Get role by name (case insensitive)
     * @param roleName Name of the role
     * @return Role enum or USER as default
     */
    public static Role fromString(String roleName) {
        if (roleName == null) return USER;
        
        try {
            return Role.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            return USER; // Default role
        }
    }
    
    @Override
    public String toString() {
        return displayName + " (Level " + level + ")";
    }
}