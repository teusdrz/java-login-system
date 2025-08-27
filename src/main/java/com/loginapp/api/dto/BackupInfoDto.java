package com.loginapp.api.dto;

import com.loginapp.model.BackupMetadata;
import java.time.LocalDateTime;

/**
 * BackupInfoDto - Backup information response DTO
 */
public class BackupInfoDto {
    private String backupId;
    private String backupType;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private long fileSizeBytes;
    private String fileName;
    private String compressionLevel;
    private boolean verified;

    // Constructors
    public BackupInfoDto() {}

    public BackupInfoDto(BackupMetadata backup) {
        this.backupId = backup.getBackupId();
        this.backupType = backup.getBackupType().name();
        this.status = backup.getStatus().name();
        this.description = backup.getDescription();
        this.createdAt = backup.getCreatedAt();
        this.compressionLevel = backup.getCompressionLevel().name();
        this.verified = backup.isVerified();
        // Set reasonable defaults for missing fields
        this.completedAt = backup.getCreatedAt();
        this.fileSizeBytes = 0L;
        this.fileName = "backup_" + backup.getBackupId() + ".zip";
    }

    // Getters and Setters
    public String getBackupId() {
        return backupId;
    }
    
    public void setBackupId(String backupId) {
        this.backupId = backupId;
    }

    public String getBackupType() {
        return backupType;
    }
    
    public void setBackupType(String backupType) {
        this.backupType = backupType;
    }

    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public long getFileSizeBytes() {
        return fileSizeBytes;
    }
    
    public void setFileSizeBytes(long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getCompressionLevel() {
        return compressionLevel;
    }
    
    public void setCompressionLevel(String compressionLevel) {
        this.compressionLevel = compressionLevel;
    }

    public boolean isVerified() {
        return verified;
    }
    
    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
