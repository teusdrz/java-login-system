package com.loginapp.api.dto;

/**
 * BackupRequestDto - Backup operation request DTO
 */
public class BackupRequestDto {
    private String backupType; // FULL, INCREMENTAL, DIFFERENTIAL
    private String description;
    private boolean includeUserData;
    private boolean includeAuditLogs;
    private boolean compressBackup;

    // Constructors
    public BackupRequestDto() {}

    public BackupRequestDto(String backupType, String description, boolean includeUserData, 
                           boolean includeAuditLogs, boolean compressBackup) {
        this.backupType = backupType;
        this.description = description;
        this.includeUserData = includeUserData;
        this.includeAuditLogs = includeAuditLogs;
        this.compressBackup = compressBackup;
    }

    // Getters and Setters
    public String getBackupType() {
        return backupType;
    }
    
    public void setBackupType(String backupType) {
        this.backupType = backupType;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isIncludeUserData() {
        return includeUserData;
    }
    
    public void setIncludeUserData(boolean includeUserData) {
        this.includeUserData = includeUserData;
    }

    public boolean isIncludeAuditLogs() {
        return includeAuditLogs;
    }
    
    public void setIncludeAuditLogs(boolean includeAuditLogs) {
        this.includeAuditLogs = includeAuditLogs;
    }

    public boolean isCompressBackup() {
        return compressBackup;
    }
    
    public void setCompressBackup(boolean compressBackup) {
        this.compressBackup = compressBackup;
    }
}
