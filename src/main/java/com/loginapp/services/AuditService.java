package com.loginapp.services;

import com.loginapp.model.User;
import com.loginapp.model.AuditEntry;
import com.loginapp.model.AuditAction;
import com.loginapp.model.AuditLevel;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * AuditService class - Comprehensive audit logging system
 * Tracks all system activities for security and compliance purposes
 */
public class AuditService {
    
    private static AuditService instance;
    private final Map<String, AuditEntry> auditLog;
    private final Map<String, List<AuditEntry>> userAuditLog;
    private final Queue<AuditEntry> recentActivities;
    private final int MAX_RECENT_ACTIVITIES = 1000;
    
    // Security thresholds
    private final int FAILED_LOGIN_THRESHOLD = 5;
    private final int SUSPICIOUS_ACTIVITY_THRESHOLD = 10;
    
    private AuditService() {
        this.auditLog = new ConcurrentHashMap<>();
        this.userAuditLog = new ConcurrentHashMap<>();
        this.recentActivities = new LinkedList<>();
    }
    
    public static synchronized AuditService getInstance() {
        if (instance == null) {
            instance = new AuditService();
        }
        return instance;
    }
    
    /**
     * Log audit entry with automatic ID generation
     */
    public String logActivity(AuditAction action, AuditLevel level, String userId, 
                             String description, Map<String, Object> details) {
        String auditId = generateAuditId();
        AuditEntry entry = new AuditEntry(auditId, action, level, userId, description, details);
        
        // Store in main audit log
        auditLog.put(auditId, entry);
        
        // Store in user-specific log
        userAuditLog.computeIfAbsent(userId, k -> new ArrayList<>()).add(entry);
        
        // Add to recent activities (with size limit)
        synchronized (recentActivities) {
            recentActivities.offer(entry);
            while (recentActivities.size() > MAX_RECENT_ACTIVITIES) {
                recentActivities.poll();
            }
        }
        
        // Check for security alerts
        checkSecurityAlerts(entry);
        
        // Print to console for immediate visibility
        printAuditEntry(entry);
        
        return auditId;
    }
    
    /**
     * Log authentication events
     */
    public String logAuthentication(String userId, boolean success, String ipAddress, String userAgent) {
        AuditAction action = success ? AuditAction.LOGIN_SUCCESS : AuditAction.LOGIN_FAILED;
        AuditLevel level = success ? AuditLevel.INFO : AuditLevel.WARNING;
        
        Map<String, Object> details = new HashMap<>();
        details.put("ipAddress", ipAddress);
        details.put("userAgent", userAgent);
        details.put("timestamp", LocalDateTime.now());
        
        String description = success ? 
            "User successfully logged in" : 
            "Failed login attempt";
        
        return logActivity(action, level, userId, description, details);
    }
    
    /**
     * Log authorization events
     */
    public String logAuthorization(String userId, String permission, boolean granted, String resource) {
        AuditAction action = granted ? AuditAction.ACCESS_GRANTED : AuditAction.ACCESS_DENIED;
        AuditLevel level = granted ? AuditLevel.INFO : AuditLevel.WARNING;
        
        Map<String, Object> details = new HashMap<>();
        details.put("permission", permission);
        details.put("resource", resource);
        details.put("granted", granted);
        
        String description = String.format("Access %s for permission '%s' on resource '%s'", 
                                         granted ? "granted" : "denied", permission, resource);
        
        return logActivity(action, level, userId, description, details);
    }
    
    /**
     * Log user management events
     */
    public String logUserManagement(String actorUserId, String targetUserId, AuditAction action, 
                                   Map<String, Object> changes) {
        Map<String, Object> details = new HashMap<>();
        details.put("targetUserId", targetUserId);
        details.put("changes", changes);
        details.put("actorUserId", actorUserId);
        
        String description = String.format("User management action: %s on user %s", 
                                         action.getDisplayName(), targetUserId);
        
        return logActivity(action, AuditLevel.INFO, actorUserId, description, details);
    }
    
    /**
     * Log system configuration changes
     */
    public String logSystemConfiguration(String userId, String configType, Object oldValue, 
                                       Object newValue, String description) {
        Map<String, Object> details = new HashMap<>();
        details.put("configType", configType);
        details.put("oldValue", oldValue);
        details.put("newValue", newValue);
        
        return logActivity(AuditAction.SYSTEM_CONFIG_CHANGED, AuditLevel.INFO, 
                          userId, description, details);
    }
    
    /**
     * Log backup and recovery operations
     */
    public String logBackupOperation(String userId, AuditAction action, String backupId, 
                                   boolean success, String details) {
        Map<String, Object> detailsMap = new HashMap<>();
        detailsMap.put("backupId", backupId);
        detailsMap.put("success", success);
        detailsMap.put("operationDetails", details);
        
        AuditLevel level = success ? AuditLevel.INFO : AuditLevel.ERROR;
        String description = String.format("Backup operation: %s - %s", 
                                         action.getDisplayName(), success ? "Success" : "Failed");
        
        return logActivity(action, level, userId, description, detailsMap);
    }
    
    /**
     * Log security incidents
     */
    public String logSecurityIncident(String userId, String incidentType, AuditLevel severity, 
                                    String description, Map<String, Object> evidence) {
        Map<String, Object> details = new HashMap<>();
        details.put("incidentType", incidentType);
        details.put("severity", severity.name());
        details.put("evidence", evidence);
        details.put("investigationRequired", severity == AuditLevel.CRITICAL);
        
        return logActivity(AuditAction.SECURITY_INCIDENT, severity, userId, description, details);
    }
    
    /**
     * Get audit entries by user
     */
    public List<AuditEntry> getAuditByUser(String userId) {
        return userAuditLog.getOrDefault(userId, new ArrayList<>());
    }
    
    /**
     * Get audit entries by action
     */
    public List<AuditEntry> getAuditByAction(AuditAction action) {
        return auditLog.values().stream()
                .filter(entry -> entry.getAction() == action)
                .sorted(Comparator.comparing(AuditEntry::getTimestamp).reversed())
                .collect(Collectors.toList());
    }
    
    /**
     * Get audit entries by level
     */
    public List<AuditEntry> getAuditByLevel(AuditLevel level) {
        return auditLog.values().stream()
                .filter(entry -> entry.getLevel() == level)
                .sorted(Comparator.comparing(AuditEntry::getTimestamp).reversed())
                .collect(Collectors.toList());
    }
    
    /**
     * Get audit entries within date range
     */
    public List<AuditEntry> getAuditByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLog.values().stream()
                .filter(entry -> !entry.getTimestamp().isBefore(startDate) && 
                               !entry.getTimestamp().isAfter(endDate))
                .sorted(Comparator.comparing(AuditEntry::getTimestamp).reversed())
                .collect(Collectors.toList());
    }
    
    /**
     * Get recent activities
     */
    public List<AuditEntry> getRecentActivities(int limit) {
        synchronized (recentActivities) {
            return recentActivities.stream()
                    .sorted(Comparator.comparing(AuditEntry::getTimestamp).reversed())
                    .limit(limit)
                    .collect(Collectors.toList());
        }
    }
    
    /**
     * Get security alerts
     */
    public List<AuditEntry> getSecurityAlerts() {
        return auditLog.values().stream()
                .filter(entry -> entry.getLevel() == AuditLevel.WARNING || 
                               entry.getLevel() == AuditLevel.ERROR ||
                               entry.getLevel() == AuditLevel.CRITICAL)
                .sorted(Comparator.comparing(AuditEntry::getTimestamp).reversed())
                .collect(Collectors.toList());
    }
    
    /**
     * Get failed login attempts for user
     */
    public long getFailedLoginCount(String userId, LocalDateTime since) {
        return getAuditByUser(userId).stream()
                .filter(entry -> entry.getAction() == AuditAction.LOGIN_FAILED)
                .filter(entry -> entry.getTimestamp().isAfter(since))
                .count();
    }
    
    /**
     * Generate audit statistics
     */
    public Map<String, Object> getAuditStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalEntries", auditLog.size());
        stats.put("uniqueUsers", userAuditLog.size());
        
        // Count by level
        Map<AuditLevel, Long> levelCounts = auditLog.values().stream()
                .collect(Collectors.groupingBy(AuditEntry::getLevel, Collectors.counting()));
        stats.put("levelCounts", levelCounts);
        
        // Count by action
        Map<AuditAction, Long> actionCounts = auditLog.values().stream()
                .collect(Collectors.groupingBy(AuditEntry::getAction, Collectors.counting()));
        stats.put("actionCounts", actionCounts);
        
        // Recent activity summary
        LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
        long recentActivityCount = auditLog.values().stream()
                .filter(entry -> entry.getTimestamp().isAfter(lastHour))
                .count();
        stats.put("lastHourActivity", recentActivityCount);
        
        return stats;
    }
    
    /**
     * Check for security alerts based on audit entry
     */
    private void checkSecurityAlerts(AuditEntry entry) {
        // Check for multiple failed logins
        if (entry.getAction() == AuditAction.LOGIN_FAILED) {
            LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
            long failedCount = getFailedLoginCount(entry.getUserId(), lastHour);
            
            if (failedCount >= FAILED_LOGIN_THRESHOLD) {
                logSecurityIncident(entry.getUserId(), "MULTIPLE_FAILED_LOGINS", 
                                  AuditLevel.WARNING, 
                                  String.format("User has %d failed login attempts in the last hour", failedCount),
                                  Map.of("failedCount", failedCount, "timeFrame", "1 hour"));
            }
        }
        
        // Check for suspicious activities
        if (entry.getLevel() == AuditLevel.WARNING || entry.getLevel() == AuditLevel.ERROR) {
            LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
            long suspiciousCount = getAuditByUser(entry.getUserId()).stream()
                    .filter(e -> e.getTimestamp().isAfter(lastHour))
                    .filter(e -> e.getLevel() == AuditLevel.WARNING || e.getLevel() == AuditLevel.ERROR)
                    .count();
            
            if (suspiciousCount >= SUSPICIOUS_ACTIVITY_THRESHOLD) {
                logSecurityIncident(entry.getUserId(), "SUSPICIOUS_ACTIVITY_PATTERN", 
                                  AuditLevel.ERROR,
                                  String.format("User has %d suspicious activities in the last hour", suspiciousCount),
                                  Map.of("suspiciousCount", suspiciousCount, "timeFrame", "1 hour"));
            }
        }
    }
    
    /**
     * Print audit entry to console
     */
    private void printAuditEntry(AuditEntry entry) {
        String levelColor = getColorForLevel(entry.getLevel());
        String resetColor = "\u001B[0m";
        
        System.out.printf("[%s%s%s] %s - User: %s - %s%n",
                levelColor, entry.getLevel().name(), resetColor,
                entry.getTimestamp().toString(),
                entry.getUserId() != null ? entry.getUserId() : "SYSTEM",
                entry.getDescription());
    }
    
    /**
     * Get console color for audit level
     */
    private String getColorForLevel(AuditLevel level) {
        switch (level) {
            case INFO: return "\u001B[32m";     // Green
            case WARNING: return "\u001B[33m";  // Yellow
            case ERROR: return "\u001B[31m";    // Red
            case CRITICAL: return "\u001B[35m"; // Magenta
            default: return "\u001B[0m";        // Reset
        }
    }
    
    /**
     * Generate unique audit ID
     */
    private String generateAuditId() {
        return "AUDIT_" + System.currentTimeMillis() + "_" + 
               UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}