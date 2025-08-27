package com.loginapp.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * BackupMetadata - Advanced backup metadata with encryption support
 * Tracks backup operations, integrity, and recovery information
 */
public class BackupMetadata {
    
    public enum BackupType {
        FULL("Full Backup", "Complete system backup including all data"),
        INCREMENTAL("Incremental Backup", "Only changes since last backup"),
        DIFFERENTIAL("Differential Backup", "Changes since last full backup"),
        EMERGENCY("Emergency Backup", "Critical system state backup");
        
        private final String displayName;
        private final String description;
        
        BackupType(String displayName, String description) {
            this.displayName = displayName;
            this.description = description;
        }
        
        public String getDisplayName() { return displayName; }
        public String getDescription() { return description; }
    }
    
    public enum BackupStatus {
        INITIALIZING("Initializing", "Backup preparation in progress"),
        IN_PROGRESS("In Progress", "Backup operation running"),
        COMPLETED("Completed", "Backup completed successfully"),
        FAILED("Failed", "Backup operation failed"),
        CORRUPTED("Corrupted", "Backup file integrity compromised"),
        ARCHIVED("Archived", "Backup moved to long-term storage"),
        EXPIRED("Expired", "Backup exceeded retention period");
        
        private final String displayName;
        private final String description;
        
        BackupStatus(String displayName, String description) {
            this.displayName = displayName;
            this.description = description;
        }
        
        public String getDisplayName() { return displayName; }
        public String getDescription() { return description; }
    }
    
    public enum CompressionLevel {
        NONE(0, "No Compression"),
        LOW(1, "Low Compression"),
        MEDIUM(5, "Medium Compression"),
        HIGH(9, "High Compression");
        
        private final int level;
        private final String description;
        
        CompressionLevel(int level, String description) {
            this.level = level;
            this.description = description;
        }
        
        public int getLevel() { return level; }
        public String getDescription() { return description; }
    }
    
    private final String backupId;
    private final BackupType backupType;
    private final LocalDateTime createdAt;
    private final String createdBy;
    private final String backupPath;
    private final String description;
    
    private BackupStatus status;
    private LocalDateTime startTime;
    private LocalDateTime completionTime;
    private long backupSizeBytes;
    private long originalSizeBytes;
    private String checksumMD5;
    private String checksumSHA256;
    private boolean isEncrypted;
    private String encryptionAlgorithm;
    private CompressionLevel compressionLevel;
    private String errorMessage;
    private final Map<String, Object> backupStatistics;
    private final List<String> includedDataTypes;
    private String parentBackupId; // For incremental backups
    private int retentionDays;
    private boolean isVerified;
    private LocalDateTime lastVerificationTime;
    
    /**
     * Constructor for BackupMetadata
     */
    public BackupMetadata(BackupType backupType, String createdBy, String backupPath, String description) {
        this.backupId = generateBackupId();
        this.backupType = backupType;
        this.createdAt = LocalDateTime.now();
        this.createdBy = createdBy;
        this.backupPath = backupPath;
        this.description = description != null ? description : "System backup";
        this.status = BackupStatus.INITIALIZING;
        this.compressionLevel = CompressionLevel.MEDIUM;
        this.backupStatistics = new HashMap<>();
        this.includedDataTypes = new ArrayList<>();
        this.retentionDays = getDefaultRetentionDays(backupType);
        this.isEncrypted = true;
        this.encryptionAlgorithm = "AES-256";
        this.isVerified = false;
    }
    
    /**
     * Generate unique backup ID
     */
    private String generateBackupId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "BKP_" + timestamp + "_" + randomSuffix;
    }
    
    /**
     * Get default retention days based on backup type
     */
    private int getDefaultRetentionDays(BackupType type) {
        return switch (type) {
            case FULL -> 90;        // 3 months
            case INCREMENTAL -> 30; // 1 month
            case DIFFERENTIAL -> 60; // 2 months
            case EMERGENCY -> 365;  // 1 year
        };
    }
    
    // Getters
    public String getBackupId() { return backupId; }
    public BackupType getBackupType() { return backupType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public String getBackupPath() { return backupPath; }
    public String getDescription() { return description; }
    public BackupStatus getStatus() { return status; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getCompletionTime() { return completionTime; }
    public long getBackupSizeBytes() { return backupSizeBytes; }
    public long getOriginalSizeBytes() { return originalSizeBytes; }
    public String getChecksumMD5() { return checksumMD5; }
    public String getChecksumSHA256() { return checksumSHA256; }
    public boolean isEncrypted() { return isEncrypted; }
    public String getEncryptionAlgorithm() { return encryptionAlgorithm; }
    public CompressionLevel getCompressionLevel() { return compressionLevel; }
    public String getErrorMessage() { return errorMessage; }
    public Map<String, Object> getBackupStatistics() { return new HashMap<>(backupStatistics); }
    public List<String> getIncludedDataTypes() { return new ArrayList<>(includedDataTypes); }
    public String getParentBackupId() { return parentBackupId; }
    public int getRetentionDays() { return retentionDays; }
    public boolean isVerified() { return isVerified; }
    public LocalDateTime getLastVerificationTime() { return lastVerificationTime; }
    
    // Setters and status management methods
    public void setStatus(BackupStatus status) {
        this.status = status;
        if (status == BackupStatus.IN_PROGRESS && startTime == null) {
            this.startTime = LocalDateTime.now();
        } else if (status == BackupStatus.COMPLETED || status == BackupStatus.FAILED) {
            this.completionTime = LocalDateTime.now();
        }
    }
    
    public void setBackupSizeBytes(long backupSizeBytes) {
        this.backupSizeBytes = backupSizeBytes;
    }
    
    public void setOriginalSizeBytes(long originalSizeBytes) {
        this.originalSizeBytes = originalSizeBytes;
    }
    
    public void setChecksumMD5(String checksumMD5) {
        this.checksumMD5 = checksumMD5;
    }
    
    public void setChecksumSHA256(String checksumSHA256) {
        this.checksumSHA256 = checksumSHA256;
    }
    
    public void setEncrypted(boolean encrypted) {
        this.isEncrypted = encrypted;
    }
    
    public void setEncryptionAlgorithm(String encryptionAlgorithm) {
        this.encryptionAlgorithm = encryptionAlgorithm;
    }
    
    public void setCompressionLevel(CompressionLevel compressionLevel) {
        this.compressionLevel = compressionLevel;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public void setParentBackupId(String parentBackupId) {
        this.parentBackupId = parentBackupId;
    }
    
    public void setRetentionDays(int retentionDays) {
        this.retentionDays = retentionDays;
    }
    
    public void markAsVerified() {
        this.isVerified = true;
        this.lastVerificationTime = LocalDateTime.now();
    }
    
    public void markAsCorrupted() {
        this.status = BackupStatus.CORRUPTED;
        this.isVerified = false;
    }
    
    /**
     * Add backup statistic
     */
    public void addStatistic(String key, Object value) {
        backupStatistics.put(key, value);
    }
    
    /**
     * Add included data type
     */
    public void addIncludedDataType(String dataType) {
        if (!includedDataTypes.contains(dataType)) {
            includedDataTypes.add(dataType);
        }
    }
    
    /**
     * Calculate compression ratio
     */
    public double getCompressionRatio() {
        if (originalSizeBytes <= 0) return 0.0;
        return ((double) (originalSizeBytes - backupSizeBytes) / originalSizeBytes) * 100;
    }
    
    /**
     * Get backup duration in seconds
     */
    public long getDurationSeconds() {
        if (startTime == null) return 0;
        LocalDateTime endTime = completionTime != null ? completionTime : LocalDateTime.now();
        return java.time.Duration.between(startTime, endTime).getSeconds();
    }
    
    /**
     * Check if backup is expired
     */
    public boolean isExpired() {
        return createdAt.plusDays(retentionDays).isBefore(LocalDateTime.now());
    }
    
    /**
     * Check if backup requires verification
     */
    public boolean needsVerification() {
        if (!isVerified) return true;
        if (lastVerificationTime == null) return true;
        return lastVerificationTime.plusDays(7).isBefore(LocalDateTime.now()); // Verify weekly
    }
    
    /**
     * Get formatted file size
     */
    public String getFormattedBackupSize() {
        return formatFileSize(backupSizeBytes);
    }
    
    /**
     * Get formatted original size
     */
    public String getFormattedOriginalSize() {
        return formatFileSize(originalSizeBytes);
    }
    
    /**
     * Helper method to format file sizes
     */
    private String formatFileSize(long sizeBytes) {
        if (sizeBytes <= 0) return "0 B";
        
        String[] units = {"B", "KB", "MB", "GB", "TB"};
        int unitIndex = 0;
        double size = sizeBytes;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return String.format("%.2f %s", size, units[unitIndex]);
    }
    
    /**
     * Get backup summary for display
     */
    public String getSummary() {
        StringBuilder summary = new StringBuilder();
        summary.append(backupId).append(" - ");
        summary.append(backupType.getDisplayName());
        summary.append(" (").append(status.getDisplayName()).append(")");
        if (backupSizeBytes > 0) {
            summary.append(" - ").append(getFormattedBackupSize());
        }
        return summary.toString();
    }
    
    /**
     * Get detailed backup information
     */
    public String getDetailedInfo() {
        StringBuilder info = new StringBuilder();
        info.append("=".repeat(60)).append("\n");
        info.append("BACKUP DETAILS\n");
        info.append("=".repeat(60)).append("\n");
        info.append("ID: ").append(backupId).append("\n");
        info.append("Type: ").append(backupType.getDisplayName()).append("\n");
        info.append("Status: ").append(status.getDisplayName()).append("\n");
        info.append("Created: ").append(createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        info.append("Created By: ").append(createdBy).append("\n");
        info.append("Description: ").append(description).append("\n");
        info.append("Path: ").append(backupPath).append("\n");
        
        if (startTime != null) {
            info.append("Started: ").append(startTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        }
        
        if (completionTime != null) {
            info.append("Completed: ").append(completionTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
            info.append("Duration: ").append(getDurationSeconds()).append(" seconds\n");
        }
        
        if (backupSizeBytes > 0) {
            info.append("Backup Size: ").append(getFormattedBackupSize()).append("\n");
            info.append("Original Size: ").append(getFormattedOriginalSize()).append("\n");
            info.append("Compression: ").append(String.format("%.1f%%", getCompressionRatio())).append("\n");
        }
        
        info.append("Encrypted: ").append(isEncrypted ? "Yes (" + encryptionAlgorithm + ")" : "No").append("\n");
        info.append("Compression Level: ").append(compressionLevel.getDescription()).append("\n");
        info.append("Verified: ").append(isVerified ? "Yes" : "No").append("\n");
        info.append("Retention: ").append(retentionDays).append(" days\n");
        info.append("Expires: ").append(isExpired() ? "EXPIRED" : createdAt.plusDays(retentionDays).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("\n");
        
        if (parentBackupId != null) {
            info.append("Parent Backup: ").append(parentBackupId).append("\n");
        }
        
        if (errorMessage != null) {
            info.append("Error: ").append(errorMessage).append("\n");
        }
        
        if (!includedDataTypes.isEmpty()) {
            info.append("Included Data: ").append(String.join(", ", includedDataTypes)).append("\n");
        }
        
        info.append("=".repeat(60));
        return info.toString();
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        BackupMetadata that = (BackupMetadata) obj;
        return Objects.equals(backupId, that.backupId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(backupId);
    }
    
    @Override
    public String toString() {
        return getSummary();
    }
}