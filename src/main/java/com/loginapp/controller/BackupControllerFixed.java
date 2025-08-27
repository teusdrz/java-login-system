package com.loginapp.controller;

import com.loginapp.model.BackupMetadata;
import com.loginapp.model.User;
import com.loginapp.services.BackupRecoveryService;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

import java.util.*;
import java.util.concurrent.*;

/**
 * BackupControllerFixed - Professional backup and recovery management controller
 * Enhanced version with comprehensive error handling and advanced features
 * Handles backup operations, recovery, monitoring, and maintenance tasks
 */
public class BackupControllerFixed {
    
    private final BackupRecoveryService backupService;
    private final ConsoleView consoleView;
    private final PermissionService permissionService;
    
    public BackupControllerFixed(ConsoleView consoleView) {
        this.backupService = BackupRecoveryService.getInstance();
        this.consoleView = consoleView;
        this.permissionService = PermissionService.getInstance();
    }
    
    /**
     * Main backup menu handler with comprehensive error handling
     */
    public void handleBackupManagement(User currentUser) {
        if (currentUser == null) {
            consoleView.displayErrorMessage("Invalid user session. Cannot access backup management.");
            return;
        }
        
        boolean managing = true;
        
        while (managing) {
            try {
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
                        consoleView.displayErrorMessage("Invalid option. Please select 0-6.");
                }
            } catch (Exception e) {
                consoleView.displayErrorMessage("An error occurred in backup management: " + e.getMessage());
                System.err.println("BackupController error: " + e.getMessage());
            }
        }
    }
    
    private void displayBackupMenu(User user) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("           BACKUP & RECOVERY MANAGEMENT CENTER");
        System.out.println("=".repeat(60));
        System.out.println("Welcome, " + user.getUsername() + " (" + user.getRole() + ")");
        System.out.println("-".repeat(60));
        System.out.println("1. Create Backup        - Create new system backup");
        System.out.println("2. Restore System       - Restore from existing backup");
        System.out.println("3. View Backups         - List all available backups");
        System.out.println("4. Backup Status        - Check backup system status");
        System.out.println("5. Verify Integrity     - Verify backup file integrity");
        System.out.println("6. Maintenance          - Cleanup and management tools");
        System.out.println("0. Back to Main Menu    - Return to previous menu");
        System.out.println("=".repeat(60));
        System.out.print("Choose an option (0-6): ");
    }
    
    /**
     * Create backup with professional error handling
     */
    private void handleCreateBackup(User user) {
        System.out.println("\n=== BACKUP CREATION SYSTEM ===");
        
        // Permission validation
        if (!permissionService.hasPermission(user, "BACKUP_SYSTEM")) {
            consoleView.displayErrorMessage("Access denied. You need BACKUP_SYSTEM permissions.");
            return;
        }
        
        try {
            // Backup type selection
            System.out.println("Select backup type:");
            System.out.println("1. Full Backup     - Complete system backup");
            System.out.println("2. Incremental     - Changes since last backup");
            System.out.println("3. Emergency       - Critical state backup");
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
            System.out.println("\n🔄 Starting " + selectedType.getDisplayName() + "...");
            
            CompletableFuture<BackupMetadata> backupFuture = null;
            
            switch (selectedType) {
                case FULL:
                    backupFuture = backupService.createFullBackup(null, user.getUsername(), description);
                    break;
                case INCREMENTAL:
                    backupFuture = backupService.createIncrementalBackup(null, user.getUsername(), description, null);
                    break;
                case DIFFERENTIAL:
                    // Differential backup: use incremental with special handling
                    backupFuture = backupService.createIncrementalBackup(null, user.getUsername(), description, null);
                    break;
                case EMERGENCY:
                    backupFuture = backupService.createEmergencyBackup(null, user.getUsername(), description);
                    break;
            }
            
            if (backupFuture != null) {
                try {
                    BackupMetadata result = backupFuture.get(10, TimeUnit.MINUTES);
                    
                    System.out.println("\n✅ BACKUP COMPLETED");
                    System.out.println("Backup ID: " + result.getBackupId());
                    System.out.println("Type: " + result.getBackupType().getDisplayName());
                    System.out.println("Status: " + result.getStatus().getDisplayName());
                    
                    consoleView.displaySuccessMessage("Backup completed successfully!");
                    
                } catch (TimeoutException e) {
                    consoleView.displayInfoMessage("⏱️ Backup taking longer than expected.");
                } catch (Exception e) {
                    consoleView.displayErrorMessage("❌ Backup failed: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Failed to start backup: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Restore system with confirmation and safety checks
     */
    private void handleRestoreSystem(User user) {
        System.out.println("\n=== SYSTEM RESTORE CENTER ===");
        
        if (!permissionService.hasPermission(user, "RESTORE_SYSTEM")) {
            consoleView.displayErrorMessage("Access denied. You need RESTORE_SYSTEM permissions.");
            return;
        }
        
        try {
            List<BackupMetadata> availableBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
            
            if (availableBackups.isEmpty()) {
                consoleView.displayInfoMessage("No completed backups available for restore.");
                return;
            }
            
            System.out.println("\nAvailable backups for restore:");
            System.out.println("-".repeat(80));
            
            for (int i = 0; i < availableBackups.size(); i++) {
                BackupMetadata backup = availableBackups.get(i);
                System.out.printf("%d. %s - %s (%s) - %s\n", 
                    i + 1, 
                    backup.getBackupId(), 
                    backup.getBackupType().getDisplayName(),
                    backup.getDescription(), 
                    backup.getCreatedAt());
            }
            
            System.out.print("\nSelect backup to restore (0 to cancel): ");
            int choice = consoleView.getMenuChoice();
            
            if (choice > 0 && choice <= availableBackups.size()) {
                BackupMetadata selectedBackup = availableBackups.get(choice - 1);
                
                // Safety confirmation
                System.out.println("\n⚠️  CRITICAL OPERATION WARNING ⚠️");
                System.out.println("This will restore the system to the state from:");
                System.out.println("Backup: " + selectedBackup.getBackupId());
                System.out.println("Date: " + selectedBackup.getCreatedAt());
                System.out.println("Type: " + selectedBackup.getBackupType().getDisplayName());
                
                if (consoleView.getConfirmation("\nAre you absolutely sure you want to proceed?")) {
                    System.out.println("\n🔄 Starting system restore...");
                    
                    try {
                        CompletableFuture<Boolean> restoreFuture = 
                            backupService.restoreFromBackup(selectedBackup.getBackupId(), null, user.getUsername(), true);
                        
                        Boolean result = restoreFuture.get(15, TimeUnit.MINUTES);
                        
                        if (result) {
                            System.out.println("\n✅ RESTORE COMPLETED SUCCESSFULLY");
                            consoleView.displaySuccessMessage("System restored successfully!");
                            consoleView.displayInfoMessage("Please restart the application to use restored data.");
                        } else {
                            consoleView.displayErrorMessage("❌ Restore operation failed.");
                        }
                        
                    } catch (Exception e) {
                        consoleView.displayErrorMessage("❌ Restore failed: " + e.getMessage());
                    }
                } else {
                    System.out.println("Restore operation cancelled by user.");
                }
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error accessing backups: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Display all backups with detailed information
     */
    private void handleViewBackups(User user) {
        System.out.println("\n=== BACKUP INVENTORY ===");
        
        try {
            List<BackupMetadata> backups = backupService.getAllBackups();
            
            if (backups.isEmpty()) {
                consoleView.displayInfoMessage("No backups found in the system.");
            } else {
                displayBackupList(backups, "All System Backups (" + backups.size() + " total)");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error retrieving backups: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Show backup system status and statistics
     */
    private void handleBackupStatus(User user) {
        System.out.println("\n=== BACKUP SYSTEM STATUS ===");
        
        try {
            String summary = backupService.getBackupStatusSummary();
            System.out.println("\n📊 System Statistics:");
            System.out.println(summary);
            
            // Additional status information
            List<BackupMetadata> recentBackups = backupService.getAllBackups()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .toList();
            
            if (!recentBackups.isEmpty()) {
                System.out.println("\n📅 Recent Backup Activity:");
                System.out.println("-".repeat(60));
                for (BackupMetadata backup : recentBackups) {
                    System.out.printf("• %s - %s (%s)\n", 
                        backup.getBackupId(),
                        backup.getBackupType().getDisplayName(),
                        backup.getCreatedAt());
                }
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error retrieving backup status: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Verify backup file integrity
     */
    private void handleVerifyBackups(User user) {
        System.out.println("\n=== BACKUP INTEGRITY VERIFICATION ===");
        
        try {
            List<BackupMetadata> backups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
            
            if (backups.isEmpty()) {
                consoleView.displayInfoMessage("No completed backups to verify.");
                return;
            }
            
            System.out.println("🔍 Verifying " + backups.size() + " backup(s)...");
            System.out.println("-".repeat(60));
            
            int verified = 0, failed = 0;
            for (BackupMetadata backup : backups) {
                System.out.print("Verifying " + backup.getBackupId() + "... ");
                if (backupService.verifyBackupIntegrity(backup)) {
                    System.out.println("✅ OK");
                    verified++;
                } else {
                    System.out.println("❌ FAILED");
                    failed++;
                }
            }
            
            System.out.println("\n📊 Verification Results:");
            System.out.println("✅ Verified: " + verified);
            System.out.println("❌ Failed: " + failed);
            
            if (failed > 0) {
                consoleView.displayErrorMessage("Some backups failed verification. Consider recreating them.");
            } else {
                consoleView.displaySuccessMessage("All backups verified successfully!");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error during verification: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Backup maintenance operations
     */
    private void handleBackupMaintenance(User user) {
        System.out.println("\n=== BACKUP MAINTENANCE CENTER ===");
        
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
            default:
                System.out.println("Returning to backup menu...");
        }
    }
    
    /**
     * Clean expired backups with safety confirmation
     */
    private void handleCleanExpiredBackups(User user) {
        System.out.println("\n=== CLEANUP EXPIRED BACKUPS ===");
        
        try {
            List<BackupMetadata> expired = backupService.getExpiredBackups();
            
            if (expired.isEmpty()) {
                consoleView.displayInfoMessage("✅ No expired backups found. System is clean.");
                return;
            }
            
            System.out.println("🗑️  Found " + expired.size() + " expired backup(s):");
            displayBackupList(expired, "Expired Backups");
            
            if (consoleView.getConfirmation("\nDelete all expired backups?")) {
                int deleted = backupService.cleanExpiredBackups();
                consoleView.displaySuccessMessage("🗑️  Deleted " + deleted + " expired backup(s).");
            } else {
                System.out.println("Cleanup cancelled by user.");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error during cleanup: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Delete specific backup with confirmation
     */
    private void handleDeleteSpecificBackup(User user) {
        System.out.println("\n=== DELETE SPECIFIC BACKUP ===");
        
        try {
            List<BackupMetadata> backups = backupService.getAllBackups();
            
            if (backups.isEmpty()) {
                consoleView.displayInfoMessage("No backups found to delete.");
                return;
            }
            
            System.out.println("\nAvailable backups:");
            for (int i = 0; i < backups.size(); i++) {
                BackupMetadata backup = backups.get(i);
                System.out.printf("%d. %s - %s (%s)\n", 
                    i + 1, 
                    backup.getBackupId(), 
                    backup.getBackupType().getDisplayName(),
                    backup.getDescription());
            }
            
            System.out.print("Select backup to delete (0 to cancel): ");
            int choice = consoleView.getMenuChoice();
            
            if (choice > 0 && choice <= backups.size()) {
                BackupMetadata selectedBackup = backups.get(choice - 1);
                
                System.out.println("\n⚠️  WARNING: PERMANENT DELETION");
                System.out.println("Backup: " + selectedBackup.getBackupId());
                System.out.println("Type: " + selectedBackup.getBackupType().getDisplayName());
                System.out.println("Created: " + selectedBackup.getCreatedAt());
                
                if (consoleView.getConfirmation("\nAre you sure you want to delete this backup?")) {
                    if (backupService.deleteBackup(selectedBackup.getBackupId())) {
                        consoleView.displaySuccessMessage("🗑️  Backup deleted successfully.");
                    } else {
                        consoleView.displayErrorMessage("❌ Failed to delete backup.");
                    }
                } else {
                    System.out.println("Deletion cancelled by user.");
                }
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error during deletion: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Display formatted backup list
     */
    private void displayBackupList(List<BackupMetadata> backups, String title) {
        System.out.println("\n📋 " + title);
        System.out.println("=".repeat(80));
        
        if (backups.isEmpty()) {
            System.out.println("No backups to display.");
            return;
        }
        
        for (BackupMetadata backup : backups) {
            System.out.printf("ID:          %s\n", backup.getBackupId());
            System.out.printf("Type:        %s\n", backup.getBackupType().getDisplayName());
            System.out.printf("Status:      %s\n", backup.getStatus().getDisplayName());
            System.out.printf("Created:     %s by %s\n", backup.getCreatedAt(), backup.getCreatedBy());
            System.out.printf("Description: %s\n", backup.getDescription());
            System.out.println("-".repeat(80));
        }
    }
    
    /**
     * Get backup operation status for dashboard display
     */
    public String getBackupStatusSummary() {
        try {
            return backupService.getBackupStatusSummary();
        } catch (Exception e) {
            return "Backup status unavailable: " + e.getMessage();
        }
    }
    
    /**
     * Check if user has backup-related notifications
     */
    public void checkBackupNotifications(User user) {
        // Professional implementation would check for:
        // - Failed backup notifications
        // - Backup schedule reminders
        // - Storage space warnings
        // - Integrity check failures
        // Currently simplified - no actual notifications to check
    }
}
