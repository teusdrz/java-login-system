package com.loginapp.controller;

import com.loginapp.model.*;
import com.loginapp.services.*;
import com.loginapp.view.ConsoleView;

import java.util.*;
import java.util.concurrent.*;

/**
 * BackupController - Simplified backup and recovery management controller
 */
public class BackupController {
    
    private final BackupRecoveryService backupService;
    private final ConsoleView consoleView;
    private final PermissionService permissionService;
    
    public BackupController(ConsoleView consoleView) {
        this.backupService = BackupRecoveryService.getInstance();
        this.consoleView = consoleView;
        this.permissionService = PermissionService.getInstance();
    }
    
    /**
     * Main backup menu handler
     */
    public void handleBackupManagement(User currentUser) {
        boolean managing = true;
        
        while (managing) {
            displayBackupMenu(currentUser);
            int choice = consoleView.getMenuChoice();
            
            switch (choice) {
                case 1:
                    handleCreateBackup(currentUser);
                    break;
                case 2:
                    handleRestoreSystem(currentUser);
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
                case 0:
                    managing = false;
                    break;
                default:
                    consoleView.displayErrorMessage("Invalid option.");
            }
        }
    }
    
    private void displayBackupMenu(User user) {
        System.out.println("\n" + "=".repeat(50));
        System.out.println("         BACKUP & RECOVERY MANAGEMENT");
        System.out.println("=".repeat(50));
        System.out.println("1. Create backup");
        System.out.println("2. Restore system");
        System.out.println("3. View backups");
        System.out.println("4. Backup status");
        System.out.println("5. Verify backup integrity");
        System.out.println("6. Backup maintenance");
        System.out.println("0. Back to main menu");
        System.out.print("\nChoose an option: ");
    }
    
    private void handleCreateBackup(User user) {
        System.out.println("\n=== CREATE BACKUP ===");
        
        if (!permissionService.hasPermission(user, "BACKUP_SYSTEM")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        // Select backup type
        System.out.println("Select backup type:");
        System.out.println("1. Full Backup");
        System.out.println("2. Incremental Backup");
        System.out.println("3. Emergency Backup");
        System.out.println("0. Cancel");
        
        int choice = consoleView.getMenuChoice();
        BackupMetadata.BackupType selectedType = null;
        
        switch (choice) {
            case 1:
                selectedType = BackupMetadata.BackupType.FULL;
                break;
            case 2:
                selectedType = BackupMetadata.BackupType.INCREMENTAL;
                break;
            case 3:
                selectedType = BackupMetadata.BackupType.EMERGENCY;
                break;
            case 0:
                return;
            default:
                consoleView.displayErrorMessage("Invalid option.");
                return;
        }
        
        System.out.print("Enter backup description: ");
        String description = consoleView.getStringInput();
        
        // Start backup
        System.out.println("\nStarting " + selectedType.getDisplayName().toLowerCase() + "...");
        
        try {
            CompletableFuture<BackupMetadata> backupFuture = null;
            
            switch (selectedType) {
                case FULL:
                    backupFuture = backupService.createFullBackup(null, user.getUsername(), description);
                    break;
                case INCREMENTAL:
                    backupFuture = backupService.createIncrementalBackup(null, user.getUsername(), description, null);
                    break;
                case EMERGENCY:
                    backupFuture = backupService.createEmergencyBackup(null, user.getUsername(), description);
                    break;
            }
            
            if (backupFuture != null) {
                try {
                    BackupMetadata result = backupFuture.get(10, TimeUnit.MINUTES);
                    
                    consoleView.displaySuccessMessage("Backup completed successfully!");
                    System.out.println("Backup ID: " + result.getBackupId());
                    
                } catch (TimeoutException e) {
                    consoleView.displayInfoMessage("Backup is taking longer than expected.");
                } catch (Exception e) {
                    consoleView.displayErrorMessage("Backup failed: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Failed to start backup: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleRestoreSystem(User user) {
        System.out.println("\n=== RESTORE SYSTEM ===");
        
        if (!permissionService.hasPermission(user, "RESTORE_SYSTEM")) {
            consoleView.displayErrorMessage("Access denied. Insufficient permissions.");
            return;
        }
        
        List<BackupMetadata> availableBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
        
        if (availableBackups.isEmpty()) {
            consoleView.displayInfoMessage("No completed backups available for restore.");
            return;
        }
        
        System.out.println("\nAvailable backups:");
        for (int i = 0; i < availableBackups.size(); i++) {
            BackupMetadata backup = availableBackups.get(i);
            System.out.printf("%d. %s - %s (%s)\n", 
                i + 1, backup.getBackupId(), backup.getDescription(), backup.getCreatedAt());
        }
        
        System.out.print("Select backup to restore (0 to cancel): ");
        int choice = consoleView.getMenuChoice();
        
        if (choice > 0 && choice <= availableBackups.size()) {
            BackupMetadata selectedBackup = availableBackups.get(choice - 1);
            
            if (consoleView.getConfirmation("Are you sure you want to restore from backup " + 
                                           selectedBackup.getBackupId() + "?")) {
                
                System.out.println("Starting system restore...");
                
                try {
                    CompletableFuture<Boolean> restoreFuture = 
                        backupService.restoreFromBackup(selectedBackup.getBackupId(), null, user.getUsername(), true);
                    
                    Boolean result = restoreFuture.get(15, TimeUnit.MINUTES);
                    
                    if (result) {
                        consoleView.displaySuccessMessage("System restore completed successfully!");
                        consoleView.displayInfoMessage("Please restart the application to use restored data.");
                    } else {
                        consoleView.displayErrorMessage("Restore failed");
                    }
                    
                } catch (Exception e) {
                    consoleView.displayErrorMessage("Restore failed: " + e.getMessage());
                }
            }
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleViewBackups(User user) {
        System.out.println("\n=== VIEW BACKUPS ===");
        
        List<BackupMetadata> backups = backupService.getAllBackups();
        
        if (backups.isEmpty()) {
            consoleView.displayInfoMessage("No backups found.");
        } else {
            displayBackupList(backups, "All Backups");
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleBackupStatus(User user) {
        System.out.println("\n=== BACKUP STATUS ===");
        
        String summary = backupService.getBackupStatusSummary();
        System.out.println(summary);
        
        consoleView.waitForEnter();
    }
    
    private void handleVerifyBackups(User user) {
        System.out.println("\n=== VERIFY BACKUP INTEGRITY ===");
        
        List<BackupMetadata> backups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
        
        if (backups.isEmpty()) {
            consoleView.displayInfoMessage("No completed backups to verify.");
            return;
        }
        
        System.out.println("Verifying " + backups.size() + " backup(s)...");
        
        int verified = 0, failed = 0;
        for (BackupMetadata backup : backups) {
            System.out.print("Verifying " + backup.getBackupId() + "... ");
            if (backupService.verifyBackupIntegrity(backup)) {
                System.out.println("OK");
                verified++;
            } else {
                System.out.println("FAILED");
                failed++;
            }
        }
        
        System.out.println("\nVerification completed:");
        System.out.println("Verified: " + verified);
        System.out.println("Failed: " + failed);
        
        consoleView.waitForEnter();
    }
    
    private void handleBackupMaintenance(User user) {
        System.out.println("\n=== BACKUP MAINTENANCE ===");
        
        System.out.println("Maintenance options:");
        System.out.println("1. Clean expired backups");
        System.out.println("2. Delete specific backup");
        System.out.println("0. Back");
        
        int choice = consoleView.getMenuChoice();
        
        switch (choice) {
            case 1:
                handleCleanExpiredBackups(user);
                break;
            case 2:
                handleDeleteSpecificBackup(user);
                break;
        }
    }
    
    private void handleCleanExpiredBackups(User user) {
        System.out.println("\n=== CLEAN EXPIRED BACKUPS ===");
        
        List<BackupMetadata> expired = backupService.getExpiredBackups();
        
        if (expired.isEmpty()) {
            consoleView.displayInfoMessage("No expired backups found.");
            return;
        }
        
        System.out.println("Found " + expired.size() + " expired backup(s):");
        displayBackupList(expired, "Expired Backups");
        
        if (consoleView.getConfirmation("Delete all expired backups?")) {
            int deleted = backupService.cleanExpiredBackups();
            consoleView.displaySuccessMessage("Deleted " + deleted + " expired backup(s).");
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleDeleteSpecificBackup(User user) {
        System.out.println("\n=== DELETE SPECIFIC BACKUP ===");
        
        List<BackupMetadata> backups = backupService.getAllBackups();
        
        if (backups.isEmpty()) {
            consoleView.displayInfoMessage("No backups found.");
            return;
        }
        
        System.out.println("\nAvailable backups:");
        for (int i = 0; i < backups.size(); i++) {
            BackupMetadata backup = backups.get(i);
            System.out.printf("%d. %s - %s\n", i + 1, backup.getBackupId(), backup.getDescription());
        }
        
        System.out.print("Select backup to delete (0 to cancel): ");
        int choice = consoleView.getMenuChoice();
        
        if (choice > 0 && choice <= backups.size()) {
            BackupMetadata selectedBackup = backups.get(choice - 1);
            
            if (consoleView.getConfirmation("Are you sure you want to delete backup " + 
                                           selectedBackup.getBackupId() + "?")) {
                if (backupService.deleteBackup(selectedBackup.getBackupId())) {
                    consoleView.displaySuccessMessage("Backup deleted successfully.");
                } else {
                    consoleView.displayErrorMessage("Failed to delete backup.");
                }
            }
        }
        
        consoleView.waitForEnter();
    }
    
    private void displayBackupList(List<BackupMetadata> backups, String title) {
        System.out.println("\n" + title + ":");
        System.out.println("=".repeat(80));
        
        for (BackupMetadata backup : backups) {
            System.out.printf("ID: %s\n", backup.getBackupId());
            System.out.printf("Type: %s\n", backup.getBackupType().getDisplayName());
            System.out.printf("Status: %s\n", backup.getStatus().getDisplayName());
            System.out.printf("Created: %s by %s\n", backup.getCreatedAt(), backup.getCreatedBy());
            System.out.printf("Description: %s\n", backup.getDescription());
            System.out.println("-".repeat(80));
        }
    }
    
    /**
     * Get backup operation status for dashboard display
     */
    public String getBackupStatusSummary() {
        return backupService.getBackupStatusSummary();
    }
    
    /**
     * Check if user has backup-related notifications
     */
    public void checkBackupNotifications(User user) {
        // Simplified implementation - no notifications to check
    }
}
