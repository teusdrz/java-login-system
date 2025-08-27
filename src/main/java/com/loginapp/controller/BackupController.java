package com.loginapp.controller;

import com.loginapp.model.*;
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
                    handleRestoreSystem(currentUser, null);
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
                    handleBackupStatistics(currentUser);
                    break;
                case 8:
                    handleScheduledBackups(currentUser);
                    break;
                case 9:
                    handleBackupConfiguration(currentUser);
                    break;
                case 0:
                    managing = false;
                    break;
                default:
                    consoleView.displayErrorMessage("Invalid option. Please try again.");
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
        System.out.println("7. Backup statistics");
        
        if (permissionService.hasPermission(user, "SYSTEM_SETTINGS")) {
            System.out.println("8. Scheduled backups");
            System.out.println("9. Backup configuration");
        }
        
        System.out.println("0. Back to main menu");
        System.out.print("\nChoose an option: ");
    }
    
    private void handleCreateBackup(User user) {
        System.out.println("\n=== CREATE BACKUP ===");
        
        if (!permissionService.hasPermission(user, "BACKUP_SYSTEM")) {
            consoleView.displayErrorMessage("You don't have permission to create backups.");
            consoleView.waitForEnter();
            return;
        }
        
        // Select backup type
        BackupMetadata.BackupType selectedType = selectBackupType();
        if (selectedType == null) {
            consoleView.displayErrorMessage("Invalid backup type selection.");
            consoleView.waitForEnter();
            return;
        }
        
        // Get backup description
        System.out.print("Enter backup description (optional): ");
        String description = consoleView.getStringInput();
        if (description.trim().isEmpty()) {
            description = "Manual backup created by " + user.getUsername();
        }
        
        // For incremental backups, check if there's a full backup
        if (selectedType == BackupMetadata.BackupType.INCREMENTAL) {
            List<BackupMetadata> fullBackups = backupService.getBackupsByType(BackupMetadata.BackupType.FULL).stream()
                .filter(b -> b.getStatus() == BackupMetadata.BackupStatus.COMPLETED)
                .collect(Collectors.toList());
            
            if (fullBackups.isEmpty()) {
                consoleView.displayWarningMessage("No full backup found. Creating full backup instead.");
                selectedType = BackupMetadata.BackupType.FULL;
            }
        }
        
        // Check for active backups
        if (!activeBackupFutures.isEmpty()) {
            if (!consoleView.getConfirmation("Another backup is in progress. Continue anyway?")) {
                return;
            }
        }
        
        // Emergency backup warning
        if (selectedType == BackupMetadata.BackupType.EMERGENCY) {
            consoleView.displayWarningMessage("Emergency backup will capture current critical system state.");
            if (!consoleView.getConfirmation("Continue with emergency backup?")) {
                return;
            }
        }
        
        // Start backup
        System.out.println("\nStarting " + selectedType.getDisplayName().toLowerCase() + "...");
        
        try {
            CompletableFuture<BackupMetadata> backupFuture = null;
            String taskId = UUID.randomUUID().toString();
            
            switch (selectedType) {
                case FULL:
                    backupFuture = backupService.createFullBackupAsync(user.getUsername(), description);
                    break;
                case INCREMENTAL:
                    backupFuture = backupService.createIncrementalBackupAsync(user.getUsername(), description);
                    break;
                case DIFFERENTIAL:
                    backupFuture = backupService.createDifferentialBackupAsync(user.getUsername(), description);
                    break;
                case EMERGENCY:
                    backupFuture = backupService.createEmergencyBackupAsync(user.getUsername(), description);
                    break;
            }
            
            if (backupFuture != null) {
                activeBackupFutures.put(taskId, backupFuture);
                
                // Show progress or wait for completion
                if (consoleView.getConfirmation("Wait for backup completion? (No = run in background)")) {
                    try {
                        BackupMetadata result = backupFuture.get(10, TimeUnit.MINUTES);
                        activeBackupFutures.remove(taskId);
                        
                        if (result.getStatus() == BackupMetadata.BackupStatus.COMPLETED) {
                            consoleView.displaySuccessMessage("Backup completed successfully!");
                            System.out.println("Backup ID: " + result.getBackupId());
                            System.out.println("Size: " + result.getFormattedBackupSize());
                        } else {
                            consoleView.displayErrorMessage("Backup failed: " + result.getErrorMessage());
                        }
                    } catch (TimeoutException e) {
                        consoleView.displayInfoMessage("Backup is taking longer than expected. Running in background.");
                    } catch (Exception e) {
                        activeBackupFutures.remove(taskId);
                        consoleView.displayErrorMessage("Backup failed: " + e.getMessage());
                    }
                } else {
                    consoleView.displayInfoMessage("Backup started in background. Check status menu for progress.");
                }
            }
        } catch (Exception e) {
            consoleView.displayErrorMessage("Failed to start backup: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleRestoreSystem(User user, UserDatabase userDatabase) {
        System.out.println("\n=== SYSTEM RESTORE ===");
        
        if (!permissionService.hasPermission(user, "RESTORE_SYSTEM")) {
            consoleView.displayErrorMessage("You don't have permission to restore the system.");
            consoleView.waitForEnter();
            return;
        }
        
        List<BackupMetadata> availableBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
        if (availableBackups.isEmpty()) {
            consoleView.displayErrorMessage("No completed backups available for restore.");
            consoleView.waitForEnter();
            return;
        }
        
        System.out.println("Available backups for restore:");
        for (int i = 0; i < Math.min(10, availableBackups.size()); i++) {
            BackupMetadata backup = availableBackups.get(i);
            System.out.println((i + 1) + ". " + backup.getSummary());
        }
        
        System.out.print("Select backup to restore (1-" + Math.min(10, availableBackups.size()) + "): ");
        try {
            int choice = Integer.parseInt(consoleView.getStringInput().trim());
            if (choice >= 1 && choice <= Math.min(10, availableBackups.size())) {
                BackupMetadata selectedBackup = availableBackups.get(choice - 1);
                
                consoleView.displayWarningMessage("WARNING: System restore will overwrite current data!");
                consoleView.displayWarningMessage("This operation cannot be undone!");
                
                if (consoleView.getConfirmation("Are you sure you want to restore from backup " + 
                                               selectedBackup.getBackupId() + "?")) {
                    
                    System.out.println("Starting system restore...");
                    
                    try {
                        CompletableFuture<BackupRecoveryService.RestoreResult> restoreFuture = 
                            backupService.restoreFromBackupAsync(selectedBackup.getBackupId(), user.getUsername());
                        
                        BackupRecoveryService.RestoreResult result = restoreFuture.get(15, TimeUnit.MINUTES);
                        
                        if (result.isSuccess()) {
                            consoleView.displaySuccessMessage("System restore completed successfully!");
                            consoleView.displayInfoMessage("Please restart the application to use restored data.");
                        } else {
                            consoleView.displayErrorMessage("Restore failed: " + result.getErrorMessage());
                        }
                    } catch (TimeoutException e) {
                        consoleView.displayErrorMessage("Restore operation timed out.");
                    } catch (Exception e) {
                        consoleView.displayErrorMessage("Restore failed: " + e.getMessage());
                    }
                }
            } else {
                consoleView.displayErrorMessage("Invalid selection.");
            }
        } catch (NumberFormatException e) {
            consoleView.displayErrorMessage("Invalid input.");
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleViewBackups(User user) {
        System.out.println("\n=== VIEW BACKUPS ===");
        
        System.out.println("Filter options:");
        System.out.println("1. All backups");
        System.out.println("2. Completed backups");
        System.out.println("3. Failed backups");
        System.out.println("4. In progress backups");
        System.out.println("5. By backup type");
        System.out.println("6. Recent backups (last 7 days)");
        System.out.println("0. Back");
        
        System.out.print("Choose filter (1-6): ");
        int choice = consoleView.getMenuChoice();
        
        List<BackupMetadata> backups = new ArrayList<>();
        String title = "";
        
        switch (choice) {
            case 1:
                backups = backupService.getAllBackups();
                title = "All Backups";
                break;
            case 2:
                backups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
                title = "Completed Backups";
                break;
            case 3:
                backups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.FAILED);
                title = "Failed Backups";
                break;
            case 4:
                backups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.IN_PROGRESS);
                title = "In Progress Backups";
                break;
            case 5:
                BackupMetadata.BackupType selectedType = selectBackupType();
                if (selectedType != null) {
                    backups = backupService.getBackupsByType(selectedType);
                    title = selectedType.getDisplayName() + " Backups";
                }
                break;
            case 6:
                backups = backupService.getAllBackups().stream()
                    .filter(b -> b.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(7)))
                    .collect(Collectors.toList());
                title = "Recent Backups";
                break;
            case 0:
                return;
        }
        
        if (!backups.isEmpty()) {
            displayBackupList(backups, title, user);
        } else {
            consoleView.displayInfoMessage("No backups found with the selected filter.");
            consoleView.waitForEnter();
        }
    }
    
    private void handleBackupStatus(User user) {
        System.out.println("\n=== BACKUP STATUS ===");
        
        // Active backup tasks
        List<BackupRecoveryService.BackupTask> activeTasks = backupService.getActiveBackupTasks();
        
        if (activeTasks.isEmpty()) {
            System.out.println("No active backup operations.");
        } else {
            System.out.println("Active backup operations:");
            for (BackupRecoveryService.BackupTask task : activeTasks) {
                BackupMetadata metadata = task.getMetadata();
                System.out.println("- " + metadata.getBackupType().getDisplayName() + 
                                 " (Started: " + metadata.getStartTime() + ")");
            }
        }
        
        // Recent completed/failed backups
        List<BackupMetadata> recentCompleted = backupService.getAllBackups().stream()
            .filter(b -> b.getCompletionTime() != null)
            .filter(b -> b.getCompletionTime().isAfter(java.time.LocalDateTime.now().minusDays(1)))
            .sorted((a, b) -> b.getCompletionTime().compareTo(a.getCompletionTime()))
            .limit(5)
            .collect(Collectors.toList());
        
        if (!recentCompleted.isEmpty()) {
            System.out.println("\nRecent completed operations:");
            for (BackupMetadata backup : recentCompleted) {
                System.out.println("- " + backup.getBackupType().getDisplayName() + 
                                 " (" + backup.getStatus().getDisplayName() + ") - " +
                                 backup.getCompletionTime().toLocalDate());
            }
        }
        
        consoleView.waitForEnter();
    }
    
    private BackupMetadata.BackupType selectBackupType() {
        System.out.println("\nSelect backup type:");
        BackupMetadata.BackupType[] types = BackupMetadata.BackupType.values();
        for (int i = 0; i < types.length; i++) {
            System.out.println((i + 1) + ". " + types[i].getDisplayName() + " - " + types[i].getDescription());
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
    
    private void displayBackupList(List<BackupMetadata> backups, String title, User user) {
        System.out.println("\n=== " + title.toUpperCase() + " ===");
        System.out.println("Total: " + backups.size());
        System.out.println("=".repeat(80));
        
        if (backups.isEmpty()) {
            System.out.println("No backups found.");
            return;
        }
        
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
        if (backup.getStatus() == BackupMetadata.BackupStatus.COMPLETED) {
            System.out.println("[V] Verify integrity");
            if (permissionService.hasPermission(user, "RESTORE_SYSTEM")) {
                System.out.println("[R] Restore from this backup");
            }
        }
        if (permissionService.hasPermission(user, "SYSTEM_SETTINGS")) {
            System.out.println("[D] Delete backup");
        }
        System.out.println("[B] Back");
        
        System.out.print("Choose action: ");
        String action = consoleView.getStringInput().trim().toUpperCase();
        
        switch (action) {
            case "V":
                if (backup.getStatus() == BackupMetadata.BackupStatus.COMPLETED) {
                    System.out.print("Verifying backup... ");
                    boolean valid = backupService.verifyBackupIntegrity(backup);
                    System.out.println(valid ? "OK" : "CORRUPTED");
                    consoleView.waitForEnter();
                }
                break;
            case "D":
                if (permissionService.hasPermission(user, "SYSTEM_SETTINGS")) {
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
    
    private void handleVerifyBackups(User user) {
        System.out.println("\n=== BACKUP INTEGRITY VERIFICATION ===");
        
        List<BackupMetadata> backups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
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
                } else {
                    consoleView.displayErrorMessage("Failed to delete backup.");
                }
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
                          b.getStatus() == BackupMetadata.BackupStatus.COMPLETED);
        
        if (!hasRecentBackup) {
            healthIssues.add("No successful backup in the last 7 days");
        }
        
        // Check for corrupted backups
        long corruptedCount = allBackups.stream()
            .filter(b -> b.getStatus() == BackupMetadata.BackupStatus.CORRUPTED)
            .count();
        
        if (corruptedCount > 0) {
            healthIssues.add(corruptedCount + " corrupted backup(s) found");
        }
        
        // Check for failed backups
        long failedCount = allBackups.stream()
            .filter(b -> b.getStatus() == BackupMetadata.BackupStatus.FAILED)
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
        Map<BackupMetadata.BackupType, Long> typeCount = stats.getBackupTypeCount();
        for (Map.Entry<BackupMetadata.BackupType, Long> entry : typeCount.entrySet()) {
            System.out.println(entry.getKey().getDisplayName() + ": " + entry.getValue());
        }
        
        // Current backup status overview
        List<BackupMetadata> allBackups = backupService.getAllBackups();
        Map<BackupMetadata.BackupStatus, Long> statusCount = allBackups.stream()
            .collect(Collectors.groupingBy(BackupMetadata::getStatus, Collectors.counting()));
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("CURRENT BACKUP STATUS");
        System.out.println("=".repeat(50));
        for (Map.Entry<BackupMetadata.BackupStatus, Long> entry : statusCount.entrySet()) {
            System.out.println(entry.getKey().getDisplayName() + ": " + entry.getValue());
        }
        
        consoleView.waitForEnter();
    }
    
    private void handleScheduledBackups(User user) {
        System.out.println("\n=== SCHEDULED BACKUPS ===");
        consoleView.displayInfoMessage("Scheduled backup functionality would be implemented here.");
        consoleView.displayInfoMessage("This would include automatic daily/weekly/monthly backup scheduling.");
        consoleView.waitForEnter();
    }
    
    private void handleBackupConfiguration(User user) {
        System.out.println("\n=== BACKUP CONFIGURATION ===");
        consoleView.displayInfoMessage("Backup configuration functionality would be implemented here.");
        consoleView.displayInfoMessage("This would include settings for compression, encryption, retention, etc.");
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
        if (permissionService.hasPermission(user, "BACKUP_SYSTEM")) {
            // Check for backup health issues
            List<BackupMetadata> expiredBackups = backupService.getExpiredBackups();
            if (!expiredBackups.isEmpty()) {
                notificationService.sendNotification(user.getUsername(),
                    Notification.NotificationType.SYSTEM_MAINTENANCE,
                    "Backup Maintenance Required",
                    expiredBackups.size() + " expired backups should be cleaned up");
            }
            
            // Check for corrupted backups
            List<BackupMetadata> corruptedBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.CORRUPTED);
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
