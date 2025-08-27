package com.loginapp.controller;

import com.loginapp.model.BackupMetadata;
import com.loginapp.model.User;
import com.loginapp.services.BackupRecoveryService;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

import java.util.*;
import java.util.concurrent.*;

/**
 * BackupController - Professional backup and recovery management controller
 * Handles backup operations, recovery, monitoring, and maintenance tasks
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
                    case 1 -> handleCreateBackup(currentUser);
                    case 2 -> handleRestoreSystem(currentUser);
                    case 3 -> handleViewBackups(currentUser);
                    case 4 -> handleBackupStatus(currentUser);
                    case 5 -> handleVerifyBackups(currentUser);
                    case 6 -> handleBackupMaintenance(currentUser);
                    case 0 -> managing = false;
                    default -> consoleView.displayErrorMessage("Invalid option. Please select 0-6.");
                }
            } catch (Exception e) {
                consoleView.displayErrorMessage("An error occurred in backup management: " + e.getMessage());
                System.err.println("BackupController error: " + e.getMessage());
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
        
        try {
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
            BackupMetadata.BackupType selectedType = switch (choice) {
                case 1 -> BackupMetadata.BackupType.FULL;
                case 2 -> BackupMetadata.BackupType.INCREMENTAL;
                case 3 -> BackupMetadata.BackupType.EMERGENCY;
                case 0 -> null;
                default -> null;
            };
            
            if (selectedType == null) {
                return;
            }
            
            System.out.print("Enter backup description: ");
            String description = consoleView.getStringInput();
            
            // Start backup
            System.out.println("\nStarting " + selectedType.getDisplayName().toLowerCase() + "...");
            
            CompletableFuture<BackupMetadata> backupFuture = switch (selectedType) {
                case FULL -> backupService.createFullBackup(null, user.getUsername(), description);
                case INCREMENTAL -> backupService.createIncrementalBackup(null, user.getUsername(), description, null);
                case EMERGENCY -> backupService.createEmergencyBackup(null, user.getUsername(), description);
                default -> null;
            };
            
            if (backupFuture != null) {
                try {
                    BackupMetadata result = backupFuture.get(10, TimeUnit.MINUTES);
                    consoleView.displaySuccessMessage("Backup completed successfully!");
                    System.out.println("Backup ID: " + result.getBackupId());
                } catch (TimeoutException e) {
                    consoleView.displayInfoMessage("Backup is taking longer than expected.");
                } catch (ExecutionException | InterruptedException e) {
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
        
        try {
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
                        
                    } catch (TimeoutException e) {
                        consoleView.displayErrorMessage("Restore timeout - operation may still be running.");
                    } catch (ExecutionException | InterruptedException e) {
                        consoleView.displayErrorMessage("Restore failed: " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error in restore operation: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleViewBackups(User user) {
        System.out.println("\n=== VIEW BACKUPS ===");
        
        try {
            List<BackupMetadata> backups = backupService.getAllBackups();
            
            if (backups.isEmpty()) {
                consoleView.displayInfoMessage("No backups found.");
            } else {
                displayBackupList(backups, "All Backups");
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error retrieving backups: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleBackupStatus(User user) {
        System.out.println("\n=== BACKUP STATUS ===");
        
        try {
            // Simple status display since we don't have getBackupStatusSummary()
            List<BackupMetadata> allBackups = backupService.getAllBackups();
            long completed = allBackups.stream().filter(b -> b.getStatus() == BackupMetadata.BackupStatus.COMPLETED).count();
            long failed = allBackups.stream().filter(b -> b.getStatus() == BackupMetadata.BackupStatus.FAILED).count();
            long inProgress = allBackups.stream().filter(b -> b.getStatus() == BackupMetadata.BackupStatus.IN_PROGRESS).count();
            
            System.out.println("Backup System Status:");
            System.out.println("Total backups: " + allBackups.size());
            System.out.println("Completed: " + completed);
            System.out.println("Failed: " + failed);
            System.out.println("In Progress: " + inProgress);
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error retrieving backup status: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleVerifyBackups(User user) {
        System.out.println("\n=== VERIFY BACKUP INTEGRITY ===");
        
        try {
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
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error during verification: " + e.getMessage());
        }
        
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
            case 1 -> handleCleanExpiredBackups(user);
            case 2 -> handleDeleteSpecificBackup(user);
        }
    }
    
    private void handleCleanExpiredBackups(User user) {
        System.out.println("\n=== CLEAN EXPIRED BACKUPS ===");
        
        try {
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
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error cleaning expired backups: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleDeleteSpecificBackup(User user) {
        System.out.println("\n=== DELETE SPECIFIC BACKUP ===");
        
        try {
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
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error deleting backup: " + e.getMessage());
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
        try {
            List<BackupMetadata> allBackups = backupService.getAllBackups();
            long completed = allBackups.stream().filter(b -> b.getStatus() == BackupMetadata.BackupStatus.COMPLETED).count();
            return String.format("Backups: %d total, %d completed", allBackups.size(), completed);
        } catch (Exception e) {
            return "Backup status unavailable: " + e.getMessage();
        }
    }
    
    /**
     * Check if user has backup-related notifications
     */
    public void checkBackupNotifications(User user) {
        // Simplified implementation - no notifications to check
    }
}
