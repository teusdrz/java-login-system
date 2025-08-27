package com.loginapp.security;

import com.loginapp.model.User;
import com.loginapp.model.Role;
import com.loginapp.services.AuditService;
import com.loginapp.model.AuditAction;
import com.loginapp.model.AuditLevel;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SecurityConfiguration - Security configuration and utilities for the authentication system
 * Provides password hashing, session management, and security policy enforcement
 */
public class SecurityConfiguration {
    
    private static SecurityConfiguration instance;
    private final AuditService auditService;
    private final Map<String, SecuritySession> activeSessions;
    private final Map<String, Integer> failedAttempts;
    private final Map<String, LocalDateTime> lockoutTime;
    private final SecureRandom secureRandom;
    
    // Security constants
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 30;
    private static final int SESSION_TIMEOUT_MINUTES = 60;
    private static final int MIN_PASSWORD_LENGTH = 6;
    private static final int MAX_PASSWORD_LENGTH = 50;
    private static final String PASSWORD_SALT = "JavaAuthSalt2024";
    
    private SecurityConfiguration() {
        this.auditService = AuditService.getInstance();
        this.activeSessions = new ConcurrentHashMap<>();
        this.failedAttempts = new ConcurrentHashMap<>();
        this.lockoutTime = new ConcurrentHashMap<>();
        this.secureRandom = new SecureRandom();
    }
    
    public static synchronized SecurityConfiguration getInstance() {
        if (instance == null) {
            instance = new SecurityConfiguration();
        }
        return instance;
    }
    
    /**
     * Hash password using SHA-256 with salt
     */
    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String saltedPassword = password + PASSWORD_SALT;
            byte[] hash = digest.digest(saltedPassword.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    /**
     * Validate password strength
     */
    public ValidationResult validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return ValidationResult.error("Password cannot be empty");
        }
        
        if (password.length() < MIN_PASSWORD_LENGTH) {
            return ValidationResult.error("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long");
        }
        
        if (password.length() > MAX_PASSWORD_LENGTH) {
            return ValidationResult.error("Password cannot exceed " + MAX_PASSWORD_LENGTH + " characters");
        }
        
        // Check for basic complexity
        boolean hasLetter = password.matches(".*[a-zA-Z].*");
        boolean hasDigit = password.matches(".*[0-9].*");
        
        if (!hasLetter || !hasDigit) {
            return ValidationResult.warning("Password should contain both letters and numbers for better security");
        }
        
        return ValidationResult.success("Password meets security requirements");
    }
    
    /**
     * Check if user account is locked
     */
    public boolean isAccountLocked(String username) {
        LocalDateTime lockTime = lockoutTime.get(username);
        if (lockTime == null) {
            return false;
        }
        
        LocalDateTime unlockTime = lockTime.plusMinutes(LOCKOUT_DURATION_MINUTES);
        if (LocalDateTime.now().isAfter(unlockTime)) {
            // Lockout period has expired
            lockoutTime.remove(username);
            failedAttempts.remove(username);
            return false;
        }
        
        return true;
    }
    
    /**
     * Record failed login attempt
     */
    public void recordFailedAttempt(String username) {
        int attempts = failedAttempts.getOrDefault(username, 0) + 1;
        failedAttempts.put(username, attempts);
        
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            lockoutTime.put(username, LocalDateTime.now());
            
            auditService.logActivity(
                AuditAction.ACCOUNT_LOCKOUT,
                AuditLevel.WARNING,
                username,
                "Account locked due to multiple failed login attempts",
                Map.of("failedAttempts", attempts, "lockoutDuration", LOCKOUT_DURATION_MINUTES)
            );
        }
        
        auditService.logAuthentication(username, false, "127.0.0.1", "Console Application");
    }
    
    /**
     * Clear failed attempts on successful login
     */
    public void clearFailedAttempts(String username) {
        failedAttempts.remove(username);
        lockoutTime.remove(username);
    }
    
    /**
     * Create secure session for user
     */
    public String createSession(User user) {
        String sessionId = generateSessionId();
        SecuritySession session = new SecuritySession(sessionId, user, LocalDateTime.now());
        activeSessions.put(sessionId, session);
        
        auditService.logAuthentication(user.getUsername(), true, "127.0.0.1", "Console Application");
        
        return sessionId;
    }
    
    /**
     * Validate session and check timeout
     */
    public SecuritySession validateSession(String sessionId) {
        SecuritySession session = activeSessions.get(sessionId);
        if (session == null) {
            return null;
        }
        
        LocalDateTime expireTime = session.getCreatedAt().plusMinutes(SESSION_TIMEOUT_MINUTES);
        if (LocalDateTime.now().isAfter(expireTime)) {
            // Session expired
            activeSessions.remove(sessionId);
            
            auditService.logActivity(
                AuditAction.SESSION_EXPIRED,
                AuditLevel.INFO,
                session.getUser().getUsername(),
                "User session expired",
                Map.of("sessionId", sessionId, "duration", SESSION_TIMEOUT_MINUTES)
            );
            
            return null;
        }
        
        return session;
    }
    
    /**
     * Invalidate session
     */
    public void invalidateSession(String sessionId) {
        SecuritySession session = activeSessions.remove(sessionId);
        if (session != null) {
            auditService.logActivity(
                AuditAction.LOGOUT,
                AuditLevel.INFO,
                session.getUser().getUsername(),
                "User logged out",
                Map.of("sessionId", sessionId)
            );
        }
    }
    
    /**
     * Check user permissions for specific action
     */
    public boolean hasPermission(User user, String permission) {
        if (user == null || user.getRole() == null) {
            return false;
        }
        
        Role userRole = user.getRole();
        String[] userPermissions = userRole.getPermissions();
        
        // Check if user has the specific permission
        for (String userPermission : userPermissions) {
            if (userPermission.equals(permission) || userPermission.equals("*")) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check if user can access resource based on role level
     */
    public boolean canAccessResource(User user, int requiredLevel) {
        if (user == null || user.getRole() == null) {
            return false;
        }
        
        return user.getRole().getLevel() >= requiredLevel;
    }
    
    /**
     * Get security statistics
     */
    public Map<String, Object> getSecurityStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("activeSessions", activeSessions.size());
        stats.put("lockedAccounts", lockoutTime.size());
        stats.put("accountsWithFailedAttempts", failedAttempts.size());
        
        // Calculate total failed attempts
        int totalFailedAttempts = failedAttempts.values().stream()
            .mapToInt(Integer::intValue)
            .sum();
        stats.put("totalFailedAttempts", totalFailedAttempts);
        
        return stats;
    }
    
    /**
     * Generate secure session ID
     */
    private String generateSessionId() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        
        StringBuilder sessionId = new StringBuilder();
        for (byte b : bytes) {
            sessionId.append(String.format("%02x", b));
        }
        
        return sessionId.toString();
    }
    
    /**
     * Security session class
     */
    public static class SecuritySession {
        private final String sessionId;
        private final User user;
        private final LocalDateTime createdAt;
        private LocalDateTime lastAccessedAt;
        
        public SecuritySession(String sessionId, User user, LocalDateTime createdAt) {
            this.sessionId = sessionId;
            this.user = user;
            this.createdAt = createdAt;
            this.lastAccessedAt = createdAt;
        }
        
        public String getSessionId() { return sessionId; }
        public User getUser() { return user; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getLastAccessedAt() { return lastAccessedAt; }
        
        public void updateLastAccessed() {
            this.lastAccessedAt = LocalDateTime.now();
        }
    }
    
    /**
     * Validation result class
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final ValidationLevel level;
        
        private ValidationResult(boolean valid, String message, ValidationLevel level) {
            this.valid = valid;
            this.message = message;
            this.level = level;
        }
        
        public static ValidationResult success(String message) {
            return new ValidationResult(true, message, ValidationLevel.SUCCESS);
        }
        
        public static ValidationResult error(String message) {
            return new ValidationResult(false, message, ValidationLevel.ERROR);
        }
        
        public static ValidationResult warning(String message) {
            return new ValidationResult(true, message, ValidationLevel.WARNING);
        }
        
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public ValidationLevel getLevel() { return level; }
        
        public enum ValidationLevel {
            SUCCESS, WARNING, ERROR
        }
    }
}
