package com.loginapp.api.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SystemStatsDto - System statistics response DTO
 */
public class SystemStatsDto {
    private int totalUsers;
    private int activeUsers;
    private int totalBackups;
    private LocalDateTime lastBackupDate;
    private int auditLogEntries;
    private LocalDateTime systemStartTime;
    private List<UserDto> recentUsers;
    private double cpuUsage;
    private long memoryUsage;
    private long diskUsage;

    // Constructors
    public SystemStatsDto() {}

    // Getters and Setters
    public int getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getActiveUsers() {
        return activeUsers;
    }
    
    public void setActiveUsers(int activeUsers) {
        this.activeUsers = activeUsers;
    }

    public int getTotalBackups() {
        return totalBackups;
    }
    
    public void setTotalBackups(int totalBackups) {
        this.totalBackups = totalBackups;
    }

    public LocalDateTime getLastBackupDate() {
        return lastBackupDate;
    }
    
    public void setLastBackupDate(LocalDateTime lastBackupDate) {
        this.lastBackupDate = lastBackupDate;
    }

    public int getAuditLogEntries() {
        return auditLogEntries;
    }
    
    public void setAuditLogEntries(int auditLogEntries) {
        this.auditLogEntries = auditLogEntries;
    }

    public LocalDateTime getSystemStartTime() {
        return systemStartTime;
    }
    
    public void setSystemStartTime(LocalDateTime systemStartTime) {
        this.systemStartTime = systemStartTime;
    }

    public List<UserDto> getRecentUsers() {
        return recentUsers;
    }
    
    public void setRecentUsers(List<UserDto> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public double getCpuUsage() {
        return cpuUsage;
    }
    
    public void setCpuUsage(double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public long getMemoryUsage() {
        return memoryUsage;
    }
    
    public void setMemoryUsage(long memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public long getDiskUsage() {
        return diskUsage;
    }
    
    public void setDiskUsage(long diskUsage) {
        this.diskUsage = diskUsage;
    }
}
