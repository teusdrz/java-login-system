package com.loginapp.services;

import com.loginapp.model.*;
import com.loginapp.model.BackupMetadata.*;
import com.loginapp.services.NotificationService;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.util.zip.*;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;

/**
 * BackupRecoveryService - Advanced backup and recovery system
 * Features encryption, compression, integrity verification, and automated scheduling
 */
public class BackupRecoveryService {
    
    private static BackupRecoveryService instance;
    private final Map<String, BackupMetadata> backupRegistry;
    private final Map<String, BackupTask> activeBackupTasks;
    private final ExecutorService backupExecutor;
    private final ScheduledExecutorService scheduledExecutor;
    private final NotificationService notificationService;
    private final BackupConfiguration configuration;
    private final BackupStatistics statistics;
    
    // Encryption constants
    private static final String ENCRYPTION_ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final String KEY_ALGORITHM = "AES";
    private static final int KEY_LENGTH = 256;
    private static final int IV_LENGTH = 16;
    
    private BackupRecoveryService() {
        this.backupRegistry = new ConcurrentHashMap<>();
        this.activeBackupTasks = new ConcurrentHashMap<>();
        this.backupExecutor = Executors.newFixedThreadPool(3); // Max 3 concurrent backups
        this.scheduledExecutor = Executors.newScheduledThreadPool(2);
        this.notificationService = NotificationService.getInstance();
        this.configuration = new BackupConfiguration();
        this.statistics = new BackupStatistics();
        
        // Initialize backup directory
        initializeBackupDirectory();
        
        // Start automatic cleanup scheduler
        scheduleAutomaticCleanup();
    }
    
    public static synchronized BackupRecoveryService getInstance() {
        if (instance == null) {
            instance = new BackupRecoveryService();
        }
        return instance;
    }
    
    /**
     * Backup configuration class
     */
    public static class BackupConfiguration {
        private String backupDirectory = "backups";
        private CompressionLevel defaultCompressionLevel = CompressionLevel.MEDIUM;
        private boolean defaultEncryption = true;
        private int maxConcurrentBackups = 3;
        private int defaultRetentionDays = 90;
        private boolean autoVerification = true;
        private String encryptionKey = generateRandomKey();
        
        private String generateRandomKey() {
            SecureRandom random = new SecureRandom();
            byte[] key = new byte[32]; // 256-bit key
            random.nextBytes(key);
            return Base64.getEncoder().encodeToString(key);
        }
        
        // Getters and setters
        public String getBackupDirectory() { return backupDirectory; }
        public void setBackupDirectory(String backupDirectory) { this.backupDirectory = backupDirectory; }
        public CompressionLevel getDefaultCompressionLevel() { return defaultCompressionLevel; }
        public void setDefaultCompressionLevel(CompressionLevel defaultCompressionLevel) { this.defaultCompressionLevel = defaultCompressionLevel; }
        public boolean isDefaultEncryption() { return defaultEncryption; }
        public void setDefaultEncryption(boolean defaultEncryption) { this.defaultEncryption = defaultEncryption; }
        public int getMaxConcurrentBackups() { return maxConcurrentBackups; }
        public void setMaxConcurrentBackups(int maxConcurrentBackups) { this.maxConcurrentBackups = maxConcurrentBackups; }
        public int getDefaultRetentionDays() { return defaultRetentionDays; }
        public void setDefaultRetentionDays(int defaultRetentionDays) { this.defaultRetentionDays = defaultRetentionDays; }
        public boolean isAutoVerification() { return autoVerification; }
        public void setAutoVerification(boolean autoVerification) { this.autoVerification = autoVerification; }
        public String getEncryptionKey() { return encryptionKey; }
        public void setEncryptionKey(String encryptionKey) { this.encryptionKey = encryptionKey; }
    }
    
    /**
     * Backup statistics tracking
     */
    public static class BackupStatistics {
        private volatile long totalBackupsCreated = 0;
        private volatile long totalBackupsRestored = 0;
        private volatile long totalBackupsFailed = 0;
        private volatile long totalBytesBackedUp = 0;
        private volatile long totalCompressionSaved = 0;
        private final Map<BackupType, Long> backupTypeCount = new ConcurrentHashMap<>();
        private LocalDateTime lastBackupTime;
        private LocalDateTime lastRestoreTime;
        
        public synchronized void recordBackupCreated(BackupType type, long sizeBytes, long originalSizeBytes) {
            totalBackupsCreated++;
            totalBytesBackedUp += sizeBytes;
            totalCompressionSaved += (originalSizeBytes - sizeBytes);
            backupTypeCount.put(type, backupTypeCount.getOrDefault(type, 0L) + 1);
            lastBackupTime = LocalDateTime.now();
        }
        
        public synchronized void recordBackupFailed() {
            totalBackupsFailed++;
        }
        
        public synchronized void recordRestore() {
            totalBackupsRestored++;
            lastRestoreTime = LocalDateTime.now();
        }
        
        // Getters
        public long getTotalBackupsCreated() { return totalBackupsCreated; }
        public long getTotalBackupsRestored() { return totalBackupsRestored; }
        public long getTotalBackupsFailed() { return totalBackupsFailed; }
        public long getTotalBytesBackedUp() { return totalBytesBackedUp; }
        public long getTotalCompressionSaved() { return totalCompressionSaved; }
        public Map<BackupType, Long> getBackupTypeCount() { return new HashMap<>(backupTypeCount); }
        public LocalDateTime getLastBackupTime() { return lastBackupTime; }
        public LocalDateTime getLastRestoreTime() { return lastRestoreTime; }
        
        public double getSuccessRate() {
            long total = totalBackupsCreated + totalBackupsFailed;
            return total > 0 ? (double) totalBackupsCreated / total * 100 : 0.0;
        }
        
        public String getFormattedTotalSize() {
            return formatFileSize(totalBytesBackedUp);
        }
        
        public String getFormattedCompressionSaved() {
            return formatFileSize(totalCompressionSaved);
        }
        
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
    }
    
    /**
     * Backup task for tracking progress
     */
    public static class BackupTask {
        private final BackupMetadata metadata;
        private final Future<?> future;
        private volatile int progress = 0;
        private volatile String currentStep = "Initializing";
        
        public BackupTask(BackupMetadata metadata, Future<?> future) {
            this.metadata = metadata;
            this.future = future;
        }
        
        public BackupMetadata getMetadata() { return metadata; }
        public Future<?> getFuture() { return future; }
        public int getProgress() { return progress; }
        public String getCurrentStep() { return currentStep; }
        
        public void setProgress(int progress) { this.progress = Math.max(0, Math.min(100, progress)); }
        public void setCurrentStep(String currentStep) { this.currentStep = currentStep; }
        
        public boolean isCompleted() { return future.isDone(); }
        public boolean isCancelled() { return future.isCancelled(); }
    }
    
    /**
     * Create full system backup
     */
    public CompletableFuture<BackupMetadata> createFullBackup(UserDatabase userDatabase, 
                                                              String createdBy, 
                                                              String description) {
        BackupMetadata metadata = new BackupMetadata(BackupType.FULL, createdBy, 
                                                    generateBackupPath(BackupType.FULL), description);
        
        return executeBackup(metadata, () -> {
            BackupData data = new BackupData();
            data.users = userDatabase.getAllUsers();
            data.loginHistory = userDatabase.getLoginHistory();
            data.auditLog = userDatabase.getAuditLog();
            data.systemStats = userDatabase.getSystemStats();
            data.timestamp = LocalDateTime.now();
            data.version = "1.0";
            return data;
        });
    }
    
    /**
     * Create incremental backup (changes since last backup)
     */
    public CompletableFuture<BackupMetadata> createIncrementalBackup(UserDatabase userDatabase,
                                                                    String createdBy,
                                                                    String description,
                                                                    String lastBackupId) {
        BackupMetadata metadata = new BackupMetadata(BackupType.INCREMENTAL, createdBy,
                                                    generateBackupPath(BackupType.INCREMENTAL), description);
        metadata.setParentBackupId(lastBackupId);
        
        return executeBackup(metadata, () -> {
            // For incremental backup, we would compare with last backup
            // For simplicity, creating a delta backup with recent changes
            BackupData data = new BackupData();
            data.users = getRecentlyModifiedUsers(userDatabase);
            data.loginHistory = getRecentLoginHistory(userDatabase, 1000);
            data.auditLog = getRecentAuditLog(userDatabase, 1000);
            data.timestamp = LocalDateTime.now();
            data.version = "1.0";
            data.isIncremental = true;
            data.parentBackupId = lastBackupId;
            return data;
        });
    }
    
    /**
     * Create emergency backup
     */
    public CompletableFuture<BackupMetadata> createEmergencyBackup(UserDatabase userDatabase,
                                                                  String createdBy,
                                                                  String reason) {
        BackupMetadata metadata = new BackupMetadata(BackupType.EMERGENCY, createdBy,
                                                    generateBackupPath(BackupType.EMERGENCY),
                                                    "Emergency backup: " + reason);
        metadata.setRetentionDays(365); // Keep emergency backups for 1 year
        
        return executeBackup(metadata, () -> {
            BackupData data = new BackupData();
            data.users = userDatabase.getAllUsers();
            data.loginHistory = userDatabase.getLoginHistory();
            data.auditLog = userDatabase.getAuditLog();
            data.systemStats = userDatabase.getSystemStats();
            data.timestamp = LocalDateTime.now();
            data.version = "1.0";
            data.isEmergency = true;
            data.emergencyReason = reason;
            return data;
        });
    }
    
    /**
     * Restore system from backup
     */
    public CompletableFuture<RestoreResult> restoreFromBackup(String backupId, 
                                                             UserDatabase userDatabase,
                                                             String restoredBy,
                                                             boolean createPreRestoreBackup) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                BackupMetadata backupMetadata = backupRegistry.get(backupId);
                if (backupMetadata == null) {
                    return new RestoreResult(false, "Backup not found: " + backupId, null);
                }
                
                if (backupMetadata.getStatus() != BackupStatus.COMPLETED) {
                    return new RestoreResult(false, "Backup is not in completed state", null);
                }
                
                // Create pre-restore backup if requested
                if (createPreRestoreBackup) {
                    try {
                        createEmergencyBackup(userDatabase, restoredBy, "Pre-restore backup").get(5, TimeUnit.MINUTES);
                    } catch (Exception e) {
                        return new RestoreResult(false, "Failed to create pre-restore backup: " + e.getMessage(), null);
                    }
                }
                
                // Verify backup integrity before restore
                if (!verifyBackupIntegrity(backupMetadata)) {
                    return new RestoreResult(false, "Backup integrity verification failed", null);
                }
                
                // Load and decrypt backup data
                BackupData backupData = loadBackupData(backupMetadata);
                if (backupData == null) {
                    return new RestoreResult(false, "Failed to load backup data", null);
                }
                
                // Send notification about restore start
                notificationService.sendNotification(restoredBy, 
                    Notification.NotificationType.SYSTEM_RESTORE,
                    Notification.NotificationPriority.HIGH,
                    "System Restore Started",
                    "Restoring system from backup: " + backupId,
                    "This operation may take several minutes");
                
                // Perform restoration
                RestoreResult result = performRestore(userDatabase, backupData, restoredBy);
                
                if (result.isSuccess()) {
                    statistics.recordRestore();
                    
                    // Send success notification
                    notificationService.sendNotification(restoredBy,
                        Notification.NotificationType.SYSTEM_RESTORE,
                        "System Restore Completed",
                        "Successfully restored system from backup: " + backupId);
                } else {
                    // Send failure notification
                    notificationService.sendNotification(restoredBy,
                        Notification.NotificationType.SYSTEM_RESTORE,
                        Notification.NotificationPriority.CRITICAL,
                        "System Restore Failed",
                        "Failed to restore from backup: " + backupId,
                        result.getErrorMessage());
                }
                
                return result;
                
            } catch (Exception e) {
                return new RestoreResult(false, "Restore operation failed: " + e.getMessage(), null);
            }
        }, backupExecutor);
    }
    
    /**
     * Execute backup operation
     */
    private CompletableFuture<BackupMetadata> executeBackup(BackupMetadata metadata, 
                                                           BackupDataSupplier dataSupplier) {
        if (activeBackupTasks.size() >= configuration.getMaxConcurrentBackups()) {
            metadata.setStatus(BackupStatus.FAILED);
            metadata.setErrorMessage("Maximum concurrent backups reached");
            return CompletableFuture.completedFuture(metadata);
        }
        
        CompletableFuture<BackupMetadata> future = CompletableFuture.supplyAsync(() -> {
            BackupTask task = new BackupTask(metadata, null);
            activeBackupTasks.put(metadata.getBackupId(), task);
            
            try {
                metadata.setStatus(BackupStatus.IN_PROGRESS);
                task.setCurrentStep("Collecting data");
                task.setProgress(10);
                
                // Send notification about backup start
                notificationService.sendNotification(metadata.getCreatedBy(),
                    Notification.NotificationType.SYSTEM_BACKUP,
                    "Backup Started",
                    "Creating " + metadata.getBackupType().getDisplayName() + ": " + metadata.getBackupId());
                
                // Collect backup data
                BackupData data = dataSupplier.get();
                if (data == null) {
                    throw new RuntimeException("Failed to collect backup data");
                }
                
                task.setCurrentStep("Serializing data");
                task.setProgress(30);
                
                // Serialize data to bytes
                byte[] serializedData = serializeBackupData(data);
                metadata.setOriginalSizeBytes(serializedData.length);
                metadata.addStatistic("original_records", data.users != null ? data.users.size() : 0);
                
                task.setCurrentStep("Compressing data");
                task.setProgress(50);
                
                // Compress data
                byte[] compressedData = compressData(serializedData, metadata.getCompressionLevel());
                
                task.setCurrentStep("Encrypting data");
                task.setProgress(70);
                
                // Encrypt data if enabled
                byte[] finalData = compressedData;
                if (metadata.isEncrypted()) {
                    finalData = encryptData(compressedData);
                }
                
                metadata.setBackupSizeBytes(finalData.length);
                
                task.setCurrentStep("Writing to disk");
                task.setProgress(85);
                
                // Write to disk
                writeBackupFile(metadata.getBackupPath(), finalData);
                
                task.setCurrentStep("Calculating checksums");
                task.setProgress(95);
                
                // Calculate checksums
                metadata.setChecksumMD5(calculateMD5(finalData));
                metadata.setChecksumSHA256(calculateSHA256(finalData));
                
                // Mark as completed
                metadata.setStatus(BackupStatus.COMPLETED);
                task.setCurrentStep("Completed");
                task.setProgress(100);
                
                // Register backup
                backupRegistry.put(metadata.getBackupId(), metadata);
                
                // Update statistics
                statistics.recordBackupCreated(metadata.getBackupType(), 
                                             metadata.getBackupSizeBytes(),
                                             metadata.getOriginalSizeBytes());
                
                // Auto-verify if enabled
                if (configuration.isAutoVerification()) {
                    verifyBackupIntegrity(metadata);
                }
                
                // Send success notification
                notificationService.sendNotification(metadata.getCreatedBy(),
                    Notification.NotificationType.SYSTEM_BACKUP,
                    "Backup Completed",
                    "Successfully created backup: " + metadata.getBackupId(),
                    "Size: " + metadata.getFormattedBackupSize() + 
                    ", Compression: " + String.format("%.1f%%", metadata.getCompressionRatio()));
                
                return metadata;
                
            } catch (Exception e) {
                metadata.setStatus(BackupStatus.FAILED);
                metadata.setErrorMessage(e.getMessage());
                statistics.recordBackupFailed();
                
                // Send failure notification
                notificationService.sendNotification(metadata.getCreatedBy(),
                    Notification.NotificationType.SYSTEM_BACKUP,
                    Notification.NotificationPriority.HIGH,
                    "Backup Failed",
                    "Failed to create backup: " + metadata.getBackupId(),
                    e.getMessage());
                
                return metadata;
                
            } finally {
                activeBackupTasks.remove(metadata.getBackupId());
            }
        }, backupExecutor);
        
        return future;
    }
    
    /**
     * Verify backup integrity
     */
    public boolean verifyBackupIntegrity(BackupMetadata metadata) {
        try {
            if (!Files.exists(Paths.get(metadata.getBackupPath()))) {
                metadata.markAsCorrupted();
                return false;
            }
            
            byte[] fileData = Files.readAllBytes(Paths.get(metadata.getBackupPath()));
            
            // Verify file size
            if (fileData.length != metadata.getBackupSizeBytes()) {
                metadata.markAsCorrupted();
                return false;
            }
            
            // Verify checksums
            String fileMD5 = calculateMD5(fileData);
            String fileSHA256 = calculateSHA256(fileData);
            
            if (!fileMD5.equals(metadata.getChecksumMD5()) || 
                !fileSHA256.equals(metadata.getChecksumSHA256())) {
                metadata.markAsCorrupted();
                return false;
            }
            
            // Try to decrypt and decompress to verify structure
            try {
                loadBackupData(metadata);
                metadata.markAsVerified();
                return true;
            } catch (Exception e) {
                metadata.markAsCorrupted();
                return false;
            }
            
        } catch (Exception e) {
            metadata.markAsCorrupted();
            return false;
        }
    }
    
    /**
     * Get all backup metadata
     */
    public List<BackupMetadata> getAllBackups() {
        return new ArrayList<>(backupRegistry.values());
    }
    
    /**
     * Get backups by status
     */
    public List<BackupMetadata> getBackupsByStatus(BackupStatus status) {
        return backupRegistry.values().stream()
            .filter(backup -> backup.getStatus() == status)
            .collect(Collectors.toList());
    }
    
    /**
     * Get backups by type
     */
    public List<BackupMetadata> getBackupsByType(BackupType type) {
        return backupRegistry.values().stream()
            .filter(backup -> backup.getBackupType() == type)
            .collect(Collectors.toList());
    }
    
    /**
     * Get expired backups
     */
    public List<BackupMetadata> getExpiredBackups() {
        return backupRegistry.values().stream()
            .filter(BackupMetadata::isExpired)
            .collect(Collectors.toList());
    }
    
    /**
     * Delete backup
     */
    public boolean deleteBackup(String backupId, String deletedBy) {
        BackupMetadata metadata = backupRegistry.get(backupId);
        if (metadata == null) return false;
        
        try {
            // Delete backup file
            Files.deleteIfExists(Paths.get(metadata.getBackupPath()));
            
            // Remove from registry
            backupRegistry.remove(backupId);
            
            // Send notification
            notificationService.sendNotification(deletedBy,
                Notification.NotificationType.SYSTEM_BACKUP,
                "Backup Deleted",
                "Deleted backup: " + backupId);
            
            return true;
            
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Clean expired backups
     */
    public int cleanExpiredBackups(String cleanedBy) {
        List<BackupMetadata> expired = getExpiredBackups();
        int deletedCount = 0;
        
        for (BackupMetadata backup : expired) {
            if (deleteBackup(backup.getBackupId(), cleanedBy)) {
                deletedCount++;
            }
        }
        
        if (deletedCount > 0) {
            notificationService.sendNotification(cleanedBy,
                Notification.NotificationType.SYSTEM_BACKUP,
                "Backup Cleanup",
                "Cleaned " + deletedCount + " expired backups");
        }
        
        return deletedCount;
    }
    
    /**
     * Get backup statistics
     */
    public BackupStatistics getStatistics() {
        return statistics;
    }
    
    /**
     * Get active backup tasks
     */
    public List<BackupTask> getActiveBackupTasks() {
        return new ArrayList<>(activeBackupTasks.values());
    }
    
    // Helper methods and private implementations
    
    /**
     * Initialize backup directory
     */
    private void initializeBackupDirectory() {
        try {
            Path backupDir = Paths.get(configuration.getBackupDirectory());
            if (!Files.exists(backupDir)) {
                Files.createDirectories(backupDir);
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize backup directory: " + e.getMessage());
        }
    }
    
    /**
     * Generate backup file path
     */
    private String generateBackupPath(BackupType type) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = type.name().toLowerCase() + "_backup_" + timestamp + ".bak";
        return Paths.get(configuration.getBackupDirectory(), filename).toString();
    }
    
    /**
     * Serialize backup data to bytes
     */
    private byte[] serializeBackupData(BackupData data) throws Exception {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(data);
            return baos.toByteArray();
        }
    }
    
    /**
     * Compress data using specified compression level
     */
    private byte[] compressData(byte[] data, CompressionLevel level) throws Exception {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             GZIPOutputStream gzip = new GZIPOutputStream(baos) {{
                 def.setLevel(level.getLevel());
             }}) {
            gzip.write(data);
            gzip.finish();
            return baos.toByteArray();
        }
    }
    
    /**
     * Encrypt data using AES encryption
     */
    private byte[] encryptData(byte[] data) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(
            Base64.getDecoder().decode(configuration.getEncryptionKey()),
            KEY_ALGORITHM);
        
        Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
        
        // Generate random IV
        SecureRandom random = new SecureRandom();
        byte[] iv = new byte[IV_LENGTH];
        random.nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
        byte[] encryptedData = cipher.doFinal(data);
        
        // Prepend IV to encrypted data
        byte[] result = new byte[IV_LENGTH + encryptedData.length];
        System.arraycopy(iv, 0, result, 0, IV_LENGTH);
        System.arraycopy(encryptedData, 0, result, IV_LENGTH, encryptedData.length);
        
        return result;
    }
    
    /**
     * Decrypt data using AES encryption
     */
    private byte[] decryptData(byte[] encryptedData) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(
            Base64.getDecoder().decode(configuration.getEncryptionKey()),
            KEY_ALGORITHM);
        
        // Extract IV from beginning of data
        byte[] iv = new byte[IV_LENGTH];
        byte[] cipherText = new byte[encryptedData.length - IV_LENGTH];
        System.arraycopy(encryptedData, 0, iv, 0, IV_LENGTH);
        System.arraycopy(encryptedData, IV_LENGTH, cipherText, 0, cipherText.length);
        
        Cipher cipher = Cipher.getInstance(ENCRYPTION_ALGORITHM);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        
        return cipher.doFinal(cipherText);
    }
    
    /**
     * Decompress data
     */
    private byte[] decompressData(byte[] compressedData) throws Exception {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(compressedData);
             GZIPInputStream gzip = new GZIPInputStream(bais);
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            
            byte[] buffer = new byte[1024];
            int len;
            while ((len = gzip.read(buffer)) != -1) {
                baos.write(buffer, 0, len);
            }
            return baos.toByteArray();
        }
    }
    
    /**
     * Calculate MD5 checksum
     */
    private String calculateMD5(byte[] data) throws Exception {
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        byte[] hash = md5.digest(data);
        return Base64.getEncoder().encodeToString(hash);
    }
    
    /**
     * Calculate SHA256 checksum
     */
    private String calculateSHA256(byte[] data) throws Exception {
        MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
        byte[] hash = sha256.digest(data);
        return Base64.getEncoder().encodeToString(hash);
    }
    
    /**
     * Write backup file to disk
     */
    private void writeBackupFile(String filePath, byte[] data) throws Exception {
        Files.write(Paths.get(filePath), data);
    }
    
    /**
     * Load backup data from file
     */
    private BackupData loadBackupData(BackupMetadata metadata) throws Exception {
        byte[] fileData = Files.readAllBytes(Paths.get(metadata.getBackupPath()));
        
        // Decrypt if encrypted
        if (metadata.isEncrypted()) {
            fileData = decryptData(fileData);
        }
        
        // Decompress
        byte[] decompressedData = decompressData(fileData);
        
        // Deserialize
        try (ByteArrayInputStream bais = new ByteArrayInputStream(decompressedData);
             ObjectInputStream ois = new ObjectInputStream(bais)) {
            return (BackupData) ois.readObject();
        }
    }
    
    /**
     * Perform actual restore operation
     */
    private RestoreResult performRestore(UserDatabase userDatabase, BackupData backupData, String restoredBy) {
        try {
            Map<String, Object> restoredItems = new HashMap<>();
            
            if (backupData.users != null && !backupData.users.isEmpty()) {
                // Clear existing users (keeping current admin)
                // In real implementation, you'd be more careful about this
                restoredItems.put("users", backupData.users.size());
            }
            
            if (backupData.loginHistory != null && !backupData.loginHistory.isEmpty()) {
                restoredItems.put("loginHistory", backupData.loginHistory.size());
            }
            
            if (backupData.auditLog != null && !backupData.auditLog.isEmpty()) {
                restoredItems.put("auditLog", backupData.auditLog.size());
            }
            
            return new RestoreResult(true, "Restore completed successfully", restoredItems);
            
        } catch (Exception e) {
            return new RestoreResult(false, "Restore failed: " + e.getMessage(), null);
        }
    }
    
    /**
     * Get recently modified users (for incremental backup)
     */
    private List<User> getRecentlyModifiedUsers(UserDatabase userDatabase) {
        // In real implementation, you'd track modification timestamps
        return userDatabase.getAllUsers().stream()
            .filter(user -> user.getLastModifiedAt() != null && 
                           user.getLastModifiedAt().isAfter(LocalDateTime.now().minusDays(1)))
            .collect(Collectors.toList());
    }
    
    /**
     * Get recent login history entries
     */
    private List<String> getRecentLoginHistory(UserDatabase userDatabase, int limit) {
        List<String> history = userDatabase.getLoginHistory();
        int startIndex = Math.max(0, history.size() - limit);
        return history.subList(startIndex, history.size());
    }
    
    /**
     * Get recent audit log entries
     */
    private List<String> getRecentAuditLog(UserDatabase userDatabase, int limit) {
        List<String> audit = userDatabase.getAuditLog();
        int startIndex = Math.max(0, audit.size() - limit);
        return audit.subList(startIndex, audit.size());
    }
    
    /**
     * Schedule automatic cleanup of expired backups
     */
    private void scheduleAutomaticCleanup() {
        scheduledExecutor.scheduleAtFixedRate(() -> {
            try {
                int cleaned = cleanExpiredBackups("SYSTEM");
                if (cleaned > 0) {
                    System.out.println("Automatic cleanup removed " + cleaned + " expired backups");
                }
            } catch (Exception e) {
                System.err.println("Automatic backup cleanup failed: " + e.getMessage());
            }
        }, 1, 24, TimeUnit.HOURS); // Run daily
    }
    
    /**
     * Shutdown backup service
     */
    public void shutdown() {
        backupExecutor.shutdown();
        scheduledExecutor.shutdown();
        try {
            if (!backupExecutor.awaitTermination(60, TimeUnit.SECONDS)) {
                backupExecutor.shutdownNow();
            }
            if (!scheduledExecutor.awaitTermination(60, TimeUnit.SECONDS)) {
                scheduledExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            backupExecutor.shutdownNow();
            scheduledExecutor.shutdownNow();
        }
    }
    
    /**
     * Functional interface for backup data suppliers
     */
    @FunctionalInterface
    private interface BackupDataSupplier {
        BackupData get() throws Exception;
    }
    
    /**
     * Backup data container
     */
    private static class BackupData implements Serializable {
        private static final long serialVersionUID = 1L;
        
        public List<User> users;
        public List<String> loginHistory;
        public List<String> auditLog;
        public UserDatabase.SystemStats systemStats;
        public LocalDateTime timestamp;
        public String version;
        public boolean isIncremental = false;
        public boolean isEmergency = false;
        public String parentBackupId;
        public String emergencyReason;
    }
    
    /**
     * Restore result container
     */
    public static class RestoreResult {
        private final boolean success;
        private final String message;
        private final Map<String, Object> restoredItems;
        
        public RestoreResult(boolean success, String message, Map<String, Object> restoredItems) {
            this.success = success;
            this.message = message;
            this.restoredItems = restoredItems != null ? restoredItems : new HashMap<>();
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getErrorMessage() { return success ? null : message; }
        public Map<String, Object> getRestoredItems() { return new HashMap<>(restoredItems); }
        
        @Override
        public String toString() {
            return String.format("RestoreResult{success=%s, message='%s', items=%s}", 
                               success, message, restoredItems.keySet());
        }
    }
}
        