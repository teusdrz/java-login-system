    /**
     * Handle verify backup integrity
     */
    private void handleVerifyBackups(User user) {
        System.out.println("\n=== BACKUP INTEGRITY VERIFICATION ===");
        
        List<BackupMetadata> backups = backupService.getBackupsByStatus(BackupStatus.COMPLETED);
        if (backups.isEmpty()) {
            consoleView.displayInfoMessage("No completed backups found for verification.");
            consoleView.waitForEnter();
            return;
        }
        
        System.out.println("Verification options:");
        System.out.println("1. Verify all backups");
        System.out.println("2. Verify specific backup");
        System.out.println("3. Verify backups needing verification");
        System.out.println("0. Cancel");
        
        System.out.print("Choose option (1-3): ");
        int choice = consoleView.getMenuChoice();
        
        List<BackupMetadata> toVerify = new ArrayList<>();
        
        switch (choice) {
            case 1:
                toVerify = backups;
                break;
            case 2:
                BackupMetadata selected = selectBackupForVerification(backups);
                if (selected != null) toVerify.add(selected);
                break;
            case 3:
                toVerify = backups.stream()
                    .filter(BackupMetadata::needsVerification)
                    .collect(Collectors.toList());
                break;
            case 0:
                return;
            default:
                consoleView.displayErrorMessage("Invalid option.");
                return;
        }
        
        if (toVerify.isEmpty()) {
            consoleView.displayInfoMessage("No backups selected for verification.");
            consoleView.waitForEnter();
            return;
        }
        
        System.out.println("\nVerifying " + toVerify.size() + " backup(s)...");
        
        int verified = 0, corrupted = 0;
        for (BackupMetadata backup : toVerify) {
            System.out.print("Verifying " + backup.getBackupId() + "... ");
            
            try {
                boolean isValid = backupService.verifyBackupIntegrity(backup);
                if (isValid) {
                    System.out.println("OK");
                    verified++;
                } else {
                    System.out.println("CORRUPTED");
                    corrupted++;
                    consoleView.displayWarningMessage("Backup " + backup.getBackupId() + " is corrupted!");
                }
            } catch (Exception e) {
                System.out.println("ERROR: " + e.getMessage());
                corrupted++;
            }
        }
        
        System.out.println("\nVerification completed:");
        System.out.println("Verified: " + verified);
        System.out.println("Corrupted: " + corrupted);
        
        if (corrupted > 0) {
            consoleView.displayWarningMessage("Some backups are corrupted. Consider creating new backups.");
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handle backup maintenance
     */
    private void handleBackupMaintenance(User user) {
        System.out.println("\n=== BACKUP MAINTENANCE ===");
        
        System.out.println("Maintenance options:");
        System.out.println("1. Clean expired backups");
        System.out.println("2. Delete specific backup");
        System.out.println("3. Archive old backups");
        System.out.println("4. Backup health check");
        System.out.println("0. Back");
        
        System.out.print("Choose option (1-4): ");
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                handleCleanExpiredBackups(user);
                break;
            case 2:
                handleDeleteSpecificBackup(user);
                break;
            case 3:
                handleArchiveOldBackups(user);
                break;
            case 4:
                handleBackupHealthCheck(user);
                break;
        }
    }
    
    /**
     * Handle backup statistics
     */
    private void handleBackupStatistics(User user) {
        System.out.println("\n=== BACKUP STATISTICS ===");
        
        BackupRecoveryService.BackupStatistics stats = backupService.getStatistics();
        
        System.out.println("=".repeat(50));
        System.out.println("OVERALL STATISTICS");
        System.out.println("=".repeat(50));
        System.out.println("Total Backups Created: " + stats.getTotalBackupsCreated());
        System.out.println("Total Backups Restored: " + stats.getTotalBackupsRestored());
        System.out.println("Total Backups Failed: " + stats.getTotalBackupsFailed());
        System.out.println("Success Rate: " + String.format("%.2f%%", stats.getSuccessRate()));
        System.out.println("Total Data Backed Up: " + stats.getFormattedTotalSize());
        System.out.println("Space Saved (Compression): " + stats.getFormattedCompressionSaved());
        
        if (stats.getLastBackupTime() != null) {
            System.out.println("Last Backup: " + stats.getLastBackupTime());
        }
        
        if (stats.getLastRestoreTime() != null) {
            System.out.println("Last Restore: " + stats.getLastRestoreTime());
        }
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("BACKUP TYPE DISTRIBUTION");
        System.out.println("=".repeat(50));
        Map<BackupType, Long> typeCount = stats.getBackupTypeCount();
        for (Map.Entry<BackupType, Long> entry : typeCount.entrySet()) {
            System.out.println(entry.getKey().getDisplayName() + ": " + entry.getValue());
        }
        
        // Current backup status overview
        List<BackupMetadata> allBackups = backupService.getAllBackups();
        Map<BackupStatus, Long> statusCount = allBackups.stream()
            .collect(Collectors.groupingBy(BackupMetadata::getStatus, Collectors.counting()));
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("CURRENT BACKUP STATUS");
        System.out.println("=".repeat(50));
        for (Map.Entry<BackupStatus, Long> entry : statusCount.entrySet()) {
            System.out.println(entry.getKey().getDisplayName() + ": " + entry.getValue());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handle scheduled backups
     */
    private void handleScheduledBackups(User user) {
        System.out.println("\n=== SCHEDULED BACKUPS ===");
        consoleView.displayInfoMessage("Scheduled backup functionality would be implemented here.");
        consoleView.displayInfoMessage("This would include automatic daily/weekly/monthly backup scheduling.");
        consoleView.waitForEnter();
    }
    
    /**
     * Handle backup configuration
     */
    private void handleBackupConfiguration(User user) {
        System.out.println("\n=== BACKUP CONFIGURATION ===");
        consoleView.displayInfoMessage("Backup configuration functionality would be implemented here.");
        consoleView.displayInfoMessage("This would include settings for compression, encryption, retention, etc.");
        consoleView.waitForEnter();
    }
    
    // Helper methods
    
    private void displayBackupList(List<BackupMetadata> backups, String title, User user) {
        System.out.println("\n=== " + title.toUpperCase() + " ===");
        System.out.println("Total: " + backups.size());
        System.out.println("=".repeat(80));
        
        // Display in pages
        int pageSize = 10;
        int currentPage = 0;
        boolean viewing = true;
        
        while (viewing) {
            int startIndex = currentPage * pageSize;
            int endIndex = Math.min(startIndex + pageSize, backups.size());
            
            System.out.printf("%-15s %-12s %-10s %-12s %-10s %-15s%n",
                            "BACKUP ID", "TYPE", "STATUS", "DATE", "SIZE", "CREATED BY");
            System.out.println("-".repeat(80));
            
            for (int i = startIndex; i < endIndex; i++) {
                BackupMetadata backup = backups.get(i);
                System.out.printf("%-15s %-12s %-10s %-12s %-10s %-15s%n",
                                backup.getBackupId(),
                                backup.getBackupType().name(),
                                backup.getStatus().name(),
                                backup.getCreatedAt().toLocalDate(),
                                backup.getFormattedBackupSize(),
                                backup.getCreatedBy());
            }
            
            System.out.println("=".repeat(80));
            System.out.println("Page " + (currentPage + 1) + " of " + 
                             ((backups.size() - 1) / pageSize + 1));
            
            System.out.println("\nOptions: [1-" + (endIndex - startIndex) + "] View details");
            if (currentPage > 0) System.out.print(" | [P] Previous");
            if (endIndex < backups.size()) System.out.print(" | [N] Next");
            System.out.println(" | [Q] Back");
            
            System.out.print("Choose option: ");
            String input = consoleView.getStringInput().trim().toUpperCase();
            
            try {
                int choice = Integer.parseInt(input);
                int index = startIndex + choice - 1;
                if (index >= startIndex && index < endIndex) {
                    displayBackupDetails(backups.get(index), user);
                }
            } catch (NumberFormatException e) {
                switch (input) {
                    case "P":
                        if (currentPage > 0) currentPage--;
                        break;
                    case "N":
                        if (endIndex < backups.size()) currentPage++;
                        break;
                    case "Q":
                        viewing = false;
                        break;
                    default:
                        consoleView.displayErrorMessage("Invalid option.");
                }
            }
        }
    }
    
    private void displayBackupDetails(BackupMetadata backup, User user) {
        System.out.println(backup.getDetailedInfo());
        
        System.out.println("\nActions:");
        if (backup.getStatus() == BackupStatus.COMPLETED) {
            System.out.println("[V] Verify integrity");
            if (permissionService.hasPermission(user, PermissionService.RESTORE_SYSTEM)) {
                System.out.println("[R] Restore from this backup");
            }
        }
        if (permissionService.hasPermission(user, PermissionService.SYSTEM_SETTINGS)) {
            System.out.println("[D] Delete backup");
        }
        System.out.println("[B] Back");
        
        System.out.print("Choose action: ");
        String action = consoleView.getStringInput().trim().toUpperCase();
        
        switch (action) {
            case "V":
                if (backup.getStatus() == BackupStatus.COMPLETED) {
                    System.out.print("Verifying backup... ");
                    boolean valid = backupService.verifyBackupIntegrity(backup);
                    System.out.println(valid ? "OK" : "CORRUPTED");
                    consoleView.waitForEnter();
                }
                break;
            case "D":
                if (permissionService.hasPermission(user, PermissionService.SYSTEM_SETTINGS)) {
                    if (consoleView.getConfirmation("Delete backup " + backup.getBackupId() + "?")) {
                        boolean deleted = backupService.deleteBackup(backup.getBackupId(), user.getUsername());
                        if (deleted) {
                            consoleView.displaySuccessMessage("Backup deleted successfully.");
                        } else {
                            consoleView.displayErrorMessage("Failed to delete backup.");
                        }
                        consoleView.waitForEnter();
                    }
                }
                break;
        }
    }
    
    private BackupStatus selectBackupStatus() {
        System.out.println("\nSelect backup status:");
        BackupStatus[] statuses = BackupStatus.values();
        for (int i = 0; i < statuses.length; i++) {
            System.out.println((i + 1) + ". " + statuses[i].getDisplayName());
        }
        
        System.out.print("Choose status (1-" + statuses.length + "): ");
        try {
            int choice = Integer.parseInt(consoleView.getStringInput().trim());
            if (choice >= 1 && choice <= statuses.length) {
                return statuses[choice - 1];
            }
        } catch (NumberFormatException e) {
            // Invalid input
        }
        return null;
    }
    
    private BackupType selectBackupType() {
        System.out.println("\nSelect backup type:");
        BackupType[] types = BackupType.values();
        for (int i = 0; i < types.length; i++) {
            System.out.println((i + 1) + ". " + types[i].getDisplayName());
        }
        
        System.out.print("Choose type (1-" + types.length + "): ");
        try {
            int choice = Integer.parseInt(consoleView.getStringInput().trim());
            if (choice >= 1 && choice <= types.length) {
                return types[choice - 1];
            }
        } catch (NumberFormatException e) {
            // Invalid input
        }
        return null;
    }
    
    private BackupMetadata selectBackupForVerification(List<BackupMetadata> backups) {
        System.out.println("\nSelect backup to verify:");
        for (int i = 0; i < Math.min(10, backups.size()); i++) {
            BackupMetadata backup = backups.get(i);
            System.out.println((i + 1) + ". " + backup.getSummary() + 
                             (backup.needsVerification() ? " [NEEDS VERIFICATION]" : " [VERIFIED]"));
        }
        
        System.out.print("Choose backup (1-" + Math.min(10, backups.size()) + "): ");
        try {
            int choice = Integer.parseInt(consoleView.getStringInput().trim());
            if (choice >= 1 && choice <= Math.min(10, backups.size())) {
                return backups.get(choice - 1);
            }
        } catch (NumberFormatException e) {
            // Invalid input
        }
        return null;
    }
    
    private void handleCleanExpiredBackups(User user) {
        int cleaned = backupService.cleanExpiredBackups(user.getUsername());
        if (cleaned > 0) {
            consoleView.displaySuccessMessage("Cleaned " + cleaned + " expired backup(s).");
        } else {
            consoleView.displayInfoMessage("No expired backups found.");
        }
        consoleView.waitForEnter();
    }
    
    private void handleDeleteSpecificBackup(User user) {
        List<BackupMetadata> allBackups = backupService.getAllBackups();
        if (allBackups.isEmpty()) {
            consoleView.displayInfoMessage("No backups available.");
            return;
        }
        
        BackupMetadata toDelete = selectBackupForVerification(allBackups);
        if (toDelete != null) {
            consoleView.displayWarningMessage("This action cannot be undone!");
            if (consoleView.getConfirmation("Delete backup " + toDelete.getBackupId() + "?")) {
                boolean deleted = backupService.deleteBackup(toDelete.getBackupId(), user.getUsername());
                if (deleted) {
                    consoleView.displaySuccessMessage("Backup deleted successfully.");
            }
        }
        consoleView.waitForEnter();
    }
    
    private void handleArchiveOldBackups(User user) {
        consoleView.displayInfoMessage("Archive functionality would move old backups to long-term storage.");
        consoleView.waitForEnter();
    }
    
    private void handleBackupHealthCheck(User user) {
        System.out.println("\n=== BACKUP HEALTH CHECK ===");
        
        List<BackupMetadata> allBackups = backupService.getAllBackups();
        if (allBackups.isEmpty()) {
            consoleView.displayInfoMessage("No backups found.");
            consoleView.waitForEnter();
            return;
        }
        
        System.out.println("Running backup health check...");
        
        // Check for various health issues
        List<String> healthIssues = new ArrayList<>();
        
        // Check for recent backups
        boolean hasRecentBackup = allBackups.stream()
            .anyMatch(b -> b.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(7)) &&
                          b.getStatus() == BackupStatus.COMPLETED);
        
        if (!hasRecentBackup) {
            healthIssues.add("No successful backup in the last 7 days");
        }
        
        // Check for corrupted backups
        long corruptedCount = allBackups.stream()
            .filter(b -> b.getStatus() == BackupStatus.CORRUPTED)
            .count();
        
        if (corruptedCount > 0) {
            healthIssues.add(corruptedCount + " corrupted backup(s) found");
        }
        
        // Check for failed backups
        long failedCount = allBackups.stream()
            .filter(b -> b.getStatus() == BackupStatus.FAILED)
            .count();
        
        if (failedCount > 0) {
            healthIssues.add(failedCount + " failed backup(s) found");
        }
        
        // Check for backups needing verification
        long needsVerification = allBackups.stream()
            .filter(BackupMetadata::needsVerification)
            .count();
        
        if (needsVerification > 0) {
            healthIssues.add(needsVerification + " backup(s) need verification");
        }
        
        // Check for expired backups
        long expiredCount = backupService.getExpiredBackups().size();
        if (expiredCount > 0) {
            healthIssues.add(expiredCount + " expired backup(s) should be cleaned");
        }
        
        // Display results
        if (healthIssues.isEmpty()) {
            consoleView.displaySuccessMessage("Backup system health: GOOD");
            System.out.println("All backups are in good condition.");
        } else {
            consoleView.displayWarningMessage("Backup system health: NEEDS ATTENTION");
            System.out.println("Issues found:");
            for (String issue : healthIssues) {
                System.out.println("  - " + issue);
            }
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Get backup operation status for dashboard display
     */
    public String getBackupStatusSummary() {
        List<BackupRecoveryService.BackupTask> activeTasks = backupService.getActiveBackupTasks();
        if (activeTasks.isEmpty()) {
            BackupRecoveryService.BackupStatistics stats = backupService.getStatistics();
            if (stats.getLastBackupTime() != null) {
                return "Last backup: " + stats.getLastBackupTime().toLocalDate();
            } else {
                return "No backups created yet";
            }
        } else {
            return activeTasks.size() + " active backup operation(s)";
        }
    }
    
    /**
     * Check if user has backup-related notifications
     */
    public void checkBackupNotifications(User user) {
        if (permissionService.hasPermission(user, PermissionService.BACKUP_SYSTEM)) {
            // Check for backup health issues
            List<BackupMetadata> expiredBackups = backupService.getExpiredBackups();
            if (!expiredBackups.isEmpty()) {
                notificationService.sendNotification(user.getUsername(),
                    Notification.NotificationType.SYSTEM_MAINTENANCE,
                    "Backup Maintenance Required",
                    expiredBackups.size() + " expired backups should be cleaned up");
            }
            
            // Check for corrupted backups
            List<BackupMetadata> corruptedBackups = backupService.getBackupsByStatus(BackupStatus.CORRUPTED);
            if (!corruptedBackups.isEmpty()) {
                notificationService.sendNotification(user.getUsername(),
                    Notification.NotificationType.SECURITY_ALERT,
                    Notification.NotificationPriority.HIGH,
                    "Corrupted Backups Detected",
                    corruptedBackups.size() + " backup(s) are corrupted and need attention");
            }
        }
    }
}

package com.loginapp.controller;

import com.loginapp.model.*;
import com.loginapp.model.BackupMetadata.*;
import com.loginapp.services.*;
import com.loginapp.view.ConsoleView;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * BackupController - Advanced backup and recovery management controller
 * Handles backup operations, recovery, monitoring, and maintenance tasks
 */
public class BackupController {
    
    private final BackupRecoveryService backupService;
    private final NotificationService notificationService;
    private final ConsoleView consoleView;
    private final PermissionService permissionService;
    private final Map<String, Future<BackupMetadata>> activeBackupFutures;
    
    public BackupController(ConsoleView consoleView) {
        this.backupService = BackupRecoveryService.getInstance();
        this.notificationService = NotificationService.getInstance();
        this.consoleView = consoleView;
        this.permissionService = PermissionService.getInstance();
        this.activeBackupFutures = new ConcurrentHashMap<>();
    }
    
    /**
     * Handle backup management menu
     */
    public void handleBackupManagement(User currentUser, UserDatabase userDatabase) {
        if (!permissionService.hasPermission(currentUser, PermissionService.BACKUP_SYSTEM)) {
            consoleView.displayErrorMessage("Access denied. Backup system permission required.");
            return;
        }
        
        boolean inBackupMenu = true;
        
        while (inBackupMenu) {
            displayBackupMenu(currentUser);
            int choice = consoleView.getMenuChoice();
            
            switch (choice) {
                case 1:
                    handleCreateBackup(currentUser, userDatabase);
                    break;
                case 2:
                    handleRestoreSystem(currentUser, userDatabase);
                    break;
                case 3:
                    handleViewBackups(currentUser);
                    break;
                case 4:
                    handleBackupStatus(currentUser);
                    break;
                case 5:
                    handleVerifyBackups(currentUser);
                    break;
                case 6:
                    handleBackupMaintenance(currentUser);
                    break;
                case 7:
                    if (permissionService.hasPermission(currentUser, PermissionService.SYSTEM_SETTINGS)) {
                        handleBackupConfiguration(currentUser);
                    } else {
                        consoleView.displayErrorMessage("Access denied. System settings permission required.");
                    }
                    break;
                case 8:
                    handleBackupStatistics(currentUser);
                    break;
                case 9:
                    handleScheduledBackups(currentUser);
                    break;
                case 0:
                    inBackupMenu = false;
                    break;
                default:
                    consoleView.displayErrorMessage("Invalid option. Please try again.");
                    break;
            }
        }
    }
    
    /**
     * Display backup management menu
     */
    private void displayBackupMenu(User user) {
        BackupRecoveryService.BackupStatistics stats = backupService.getStatistics();
        List<BackupRecoveryService.BackupTask> activeTasks = backupService.getActiveBackupTasks();
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("         BACKUP & RECOVERY SYSTEM");
        System.out.println("=".repeat(60));
        System.out.println("System Status: " + (activeTasks.isEmpty() ? "IDLE" : activeTasks.size() + " ACTIVE TASKS"));
        System.out.println("Total Backups: " + stats.getTotalBackupsCreated() + 
                          " | Success Rate: " + String.format("%.1f%%", stats.getSuccessRate()));
        System.out.println("Total Data Backed Up: " + stats.getFormattedTotalSize());
        if (stats.getLastBackupTime() != null) {
            System.out.println("Last Backup: " + stats.getLastBackupTime().toLocalDate());
        }
        
        System.out.println("\nBACKUP OPERATIONS:");
        System.out.println("1. Create Backup");
        System.out.println("2. Restore System");
        System.out.println("3. View All Backups");
        System.out.println("4. View Backup Status");
        System.out.println("5. Verify Backup Integrity");
        
        System.out.println("\nMAINTENANCE & ADMIN:");
        System.out.println("6. Backup Maintenance");
        
        if (permissionService.hasPermission(user, PermissionService.SYSTEM_SETTINGS)) {
            System.out.println("7. Backup Configuration");
        }
        
        System.out.println("8. View Statistics");
        System.out.println("9. Scheduled Backups");
        
        System.out.println("\n0. Back to Dashboard");
        System.out.println("=".repeat(60));
        System.out.print("Choose an option: ");
    }
    
    /**
     * Handle create backup
     */
    private void handleCreateBackup(User user, UserDatabase userDatabase) {
        System.out.println("\n=== CREATE BACKUP ===");
        
        System.out.println("Select backup type:");
        System.out.println("1. Full Backup (Complete system backup)");
        System.out.println("2. Incremental Backup (Changes since last backup)");
        System.out.println("3. Emergency Backup (Critical system state)");
        System.out.println("0. Cancel");
        
        System.out.print("Choose backup type (1-3): ");
        int typeChoice = consoleView.getMenuChoice();
        
        BackupType selectedType;
        switch (typeChoice) {
            case 1:
                selectedType = BackupType.FULL;
                break;
            case 2:
                selectedType = BackupType.INCREMENTAL;
                break;
            case 3:
                selectedType = BackupType.EMERGENCY;
                break;
            case 0:
                consoleView.displayInfoMessage("Backup cancelled.");
                return;
            default:
                consoleView.displayErrorMessage("Invalid backup type selected.");
                return;
        }
        
        System.out.print("Enter backup description (optional): ");
        String description = consoleView.getStringInput().trim();
        if (description.isEmpty()) {
            description = selectedType.getDisplayName() + " created by " + user.getUsername();
        }
        
        // Special handling for incremental backups
        String lastBackupId = null;
        if (selectedType == BackupType.INCREMENTAL) {
            List<BackupMetadata> fullBackups = backupService.getBackupsByType(BackupType.FULL).stream()
                .filter(b -> b.getStatus() == BackupStatus.COMPLETED)
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                .collect(Collectors.toList());
            
            if (fullBackups.isEmpty()) {
                consoleView.displayWarningMessage("No full backup found. Creating full backup instead.");
                selectedType = BackupType.FULL;
            } else {
                lastBackupId = fullBackups.get(0).getBackupId();
                System.out.println("Incremental backup will be based on: " + lastBackupId);
            }
        }
        
        // Special handling for emergency backups
        if (selectedType == BackupType.EMERGENCY) {
            System.out.print("Enter emergency reason: ");
            String reason = consoleView.getStringInput().trim();
            if (reason.isEmpty()) reason = "Manual emergency backup";
            description = description + " - Reason: " + reason;
        }
        
        if (!consoleView.getConfirmation("Create " + selectedType.getDisplayName().toLowerCase() + "?")) {
            consoleView.displayInfoMessage("Backup cancelled.");
            return;
        }
        
        // Start backup operation
        CompletableFuture<BackupMetadata> backupFuture = null;
        try {
            switch (selectedType) {
                case FULL:
                    backupFuture = backupService.createFullBackup(userDatabase, user.getUsername(), description);
                    break;
                case INCREMENTAL:
                    backupFuture = backupService.createIncrementalBackup(userDatabase, user.getUsername(), description, lastBackupId);
                    break;
                case EMERGENCY:
                    backupFuture = backupService.createEmergencyBackup(userDatabase, user.getUsername(), description);
                    break;
            }
            
            if (backupFuture != null) {
                String backupId = "PENDING_" + System.currentTimeMillis();
                activeBackupFutures.put(backupId, backupFuture);
                
                consoleView.displaySuccessMessage("Backup started. You can check progress in 'View Backup Status'.");
                
                // Option to wait for completion
                if (consoleView.getConfirmation("Wait for backup completion?")) {
                    consoleView.displayInfoMessage("Waiting for backup to complete...");
                    try {
                        BackupMetadata result = backupFuture.get(10, TimeUnit.MINUTES);
                        activeBackupFutures.remove(backupId);
                        
                        if (result.getStatus() == BackupStatus.COMPLETED) {
                            System.out.println("\n" + result.getDetailedInfo());
                            consoleView.displaySuccessMessage("Backup completed successfully!");
                        } else {
                            consoleView.displayErrorMessage("Backup failed: " + result.getErrorMessage());
                        }
                    } catch (TimeoutException e) {
                        consoleView.displayWarningMessage("Backup is taking longer than expected. Check status later.");
                    } catch (Exception e) {
                        consoleView.displayErrorMessage("Backup error: " + e.getMessage());
                        activeBackupFutures.remove(backupId);
                    }
                }
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Failed to start backup: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handle restore system
     */
    private void handleRestoreSystem(User user, UserDatabase userDatabase) {
        if (!permissionService.hasPermission(user, PermissionService.RESTORE_SYSTEM)) {
            consoleView.displayErrorMessage("Access denied. System restore permission required.");
            return;
        }
        
        System.out.println("\n=== SYSTEM RESTORE ===");
        consoleView.displayWarningMessage("CAUTION: System restore will replace current data!");
        
        List<BackupMetadata> availableBackups = backupService.getBackupsByStatus(BackupStatus.COMPLETED);
        if (availableBackups.isEmpty()) {
            consoleView.displayErrorMessage("No completed backups available for restore.");
            return;
        }
        
        // Sort by creation date (newest first)
        availableBackups.sort((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()));
        
        System.out.println("\nAvailable backups for restore:");
        for (int i = 0; i < Math.min(10, availableBackups.size()); i++) {
            BackupMetadata backup = availableBackups.get(i);
            System.out.printf("%d. %s (%s) - %s - %s%n",
                            i + 1,
                            backup.getBackupId(),
                            backup.getBackupType().getDisplayName(),
                            backup.getCreatedAt().toLocalDate(),
                            backup.getFormattedBackupSize());
        }
        
        System.out.print("Select backup to restore (1-" + Math.min(10, availableBackups.size()) + ") or 0 to cancel: ");
        int choice = consoleView.getMenuChoice();
        
        if (choice == 0) {
            consoleView.displayInfoMessage("Restore cancelled.");
            return;
        }
        
        if (choice < 1 || choice > Math.min(10, availableBackups.size())) {
            consoleView.displayErrorMessage("Invalid backup selection.");
            return;
        }
        
        BackupMetadata selectedBackup = availableBackups.get(choice - 1);
        System.out.println("\nSelected backup:");
        System.out.println(selectedBackup.getDetailedInfo());
        
        // Pre-restore backup option
        boolean createPreRestoreBackup = consoleView.getConfirmation(
            "Create emergency backup before restore? (Recommended)");
        
        // Final confirmation
        consoleView.displayWarningMessage("This will replace ALL current system data!");
        if (!consoleView.getConfirmation("Are you absolutely sure you want to restore from backup " + 
                                        selectedBackup.getBackupId() + "?")) {
            consoleView.displayInfoMessage("Restore cancelled.");
            return;
        }
        
        // Double confirmation for safety
        System.out.print("Type 'RESTORE' to confirm: ");
        String confirmation = consoleView.getStringInput().trim();
        if (!"RESTORE".equalsIgnoreCase(confirmation)) {
            consoleView.displayInfoMessage("Restore cancelled - confirmation failed.");
            return;
        }
        
        // Start restore operation
        consoleView.displayInfoMessage("Starting system restore...");
        try {
            CompletableFuture<BackupRecoveryService.RestoreResult> restoreFuture = 
                backupService.restoreFromBackup(selectedBackup.getBackupId(), userDatabase, 
                                              user.getUsername(), createPreRestoreBackup);
            
            BackupRecoveryService.RestoreResult result = restoreFuture.get(15, TimeUnit.MINUTES);
            
            if (result.isSuccess()) {
                System.out.println("\n=== RESTORE COMPLETED SUCCESSFULLY ===");
                System.out.println("Message: " + result.getMessage());
                if (!result.getRestoredItems().isEmpty()) {
                    System.out.println("\nRestored items:");
                    result.getRestoredItems().forEach((key, value) -> 
                        System.out.println("  " + key + ": " + value));
                }
                consoleView.displaySuccessMessage("System restore completed successfully!");
            } else {
                consoleView.displayErrorMessage("Restore failed: " + result.getErrorMessage());
            }
            
        } catch (TimeoutException e) {
            consoleView.displayErrorMessage("Restore operation timed out. Check system status.");
        } catch (Exception e) {
            consoleView.displayErrorMessage("Restore failed: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handle view backups
     */
    private void handleViewBackups(User user) {
        System.out.println("\n=== BACKUP INVENTORY ===");
        
        System.out.println("Filter options:");
        System.out.println("1. All backups");
        System.out.println("2. By status");
        System.out.println("3. By type");
        System.out.println("4. Recent backups (last 30 days)");
        System.out.println("5. Expired backups");
        
        System.out.print("Choose filter (1-5): ");
        int filterChoice = consoleView.getMenuChoice();
        
        List<BackupMetadata> backups = new ArrayList<>();
        String filterDescription = "";
        
        switch (filterChoice) {
            case 1:
                backups = backupService.getAllBackups();
                filterDescription = "All Backups";
                break;
            case 2:
                BackupStatus selectedStatus = selectBackupStatus();
                if (selectedStatus != null) {
                    backups = backupService.getBackupsByStatus(selectedStatus);
                    filterDescription = selectedStatus.getDisplayName() + " Backups";
                }
                break;
            case 3:
                BackupType selectedType = selectBackupType();
                if (selectedType != null) {
                    backups = backupService.getBackupsByType(selectedType);
                    filterDescription = selectedType.getDisplayName() + "s";
                }
                break;
            case 4:
                backups = backupService.getAllBackups().stream()
                    .filter(b -> b.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
                    .collect(Collectors.toList());
                filterDescription = "Recent Backups (Last 30 Days)";
                break;
            case 5:
                backups = backupService.getExpiredBackups();
                filterDescription = "Expired Backups";
                break;
            default:
                consoleView.displayErrorMessage("Invalid filter option.");
                return;
        }
        
        if (backups.isEmpty()) {
            consoleView.displayInfoMessage("No backups found matching the selected criteria.");
            consoleView.waitForEnter();
            return;
        }
        
        // Sort by creation date (newest first)
        backups.sort((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()));
        
        displayBackupList(backups, filterDescription, user);
    }
    
    /**
     * Handle backup status monitoring
     */
    private void handleBackupStatus(User user) {
        System.out.println("\n=== BACKUP STATUS MONITOR ===");
        
        List<BackupRecoveryService.BackupTask> activeTasks = backupService.getActiveBackupTasks();
        
        if (activeTasks.isEmpty()) {
            consoleView.displayInfoMessage("No active backup operations.");
        } else {
            System.out.println("Active backup operations:");
            System.out.println("=".repeat(70));
            
            for (BackupRecoveryService.BackupTask task : activeTasks) {
                BackupMetadata metadata = task.getMetadata();
                System.out.printf("ID: %s | Type: %s | Progress: %d%% | Step: %s%n",
                                metadata.getBackupId(),
                                metadata.getBackupType().getDisplayName(),
                                task.getProgress(),
                                task.getCurrentStep());
                System.out.printf("Started: %s | Created by: %s%n",
                                metadata.getStartTime(),
                                metadata.getCreatedBy());
                System.out.println("-".repeat(70));
            }
        }
        
        // Show recent completed backups
        List<BackupMetadata> recentCompleted = backupService.getAllBackups().stream()
            .filter(b -> b.getStatus() == BackupStatus.COMPLETED || b.getStatus() == BackupStatus.FAILED)
            .filter(b -> b.getCompletionTime() != null && 
                        b.getCompletionTime().isAfter(java.time.LocalDateTime.now().minusHours(24)))
            .sorted((b1, b2) -> b2.getCompletionTime().compareTo(b1.getCompletionTime()))
            .limit(5)
            .collect(Collectors.toList());
        
        if (!recentCompleted.isEmpty()) {
            System.out.println("\nRecent completed operations (last 24 hours):");
            System.out.println("=".repeat(70));
            
            for (BackupMetadata backup : recentCompleted) {
                String statusIcon = backup.getStatus() == BackupStatus.COMPLETED ? "✓" : "✗";
                System.out.printf("%s %s (%s) - %s - %s%n",
                                statusIcon,
                                backup.getBackupId(),
                                backup.getBackupType().getDisplayName(),
                                backup.getCompletionTime().toLocalDate(),
                                backup.getStatus().getDisplayName());
            }
        }
        
        consoleView.waitForEnter();
    }