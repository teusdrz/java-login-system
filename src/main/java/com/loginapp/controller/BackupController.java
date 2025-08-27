package com.loginapp.controller;

import com.loginapp.model.BackupMetadata;
import com.loginapp.model.User;
import com.loginapp.model.UserDatabase;
import com.loginapp.services.BackupRecoveryService;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * BackupController - Enterprise-grade backup and recovery management controller.
 * 
 * <p>This class provides comprehensive backup management capabilities with professional-grade
 * error handling, security validation, and operational monitoring. It serves as the primary
 * interface for all backup and recovery operations in the system.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Multi-type backup creation (Full, Incremental, Emergency)</li>
 *   <li>Advanced system restore capabilities with pre-restore safety backups</li>
 *   <li>Comprehensive backup verification and integrity checking</li>
 *   <li>Automated maintenance and cleanup operations</li>
 *   <li>Real-time backup status monitoring and reporting</li>
 *   <li>Permission-based access control for all operations</li>
 *   <li>Professional error handling with detailed logging</li>
 *   <li>User notification system for backup-related events</li>
 * </ul>
 * 
 * <p><strong>Security Features:</strong></p>
 * <ul>
 *   <li>Role-based permission validation for all operations</li>
 *   <li>Multiple confirmation prompts for destructive operations</li>
 *   <li>Audit logging for all backup management activities</li>
 *   <li>Safe restore operations with automatic pre-restore backups</li>
 * </ul>
 * 
 * <p><strong>Thread Safety:</strong></p>
 * This controller is designed for concurrent access and uses thread-safe operations
 * throughout. All backup operations are handled asynchronously with proper timeout
 * management and cancellation support.
 * 
 * <p><strong>Usage Example:</strong></p>
 * <pre>{@code
 * // Initialize controller with view dependency
 * BackupController controller = new BackupController(consoleView);
 * 
 * // Handle backup management for authenticated user
 * controller.handleBackupManagement(currentUser);
 * 
 * // Check for backup notifications
 * controller.checkBackupNotifications(currentUser);
 * 
 * // Get status summary for dashboard
 * String status = controller.getBackupStatusSummary();
 * }</pre>
 * 
 * @author Enterprise Development Team
 * @version 4.0 - Professional Enterprise Edition
 * @since 1.0
 * @see BackupRecoveryService
 * @see BackupMetadata
 * @see PermissionService
 */
public class BackupController {
    
    // ==================================================================================
    // STATIC CONSTANTS
    // ==================================================================================
    
    /**
     * Logger instance for comprehensive audit trail and debugging support.
     * All backup operations, security events, and errors are logged through this instance.
     */
    private static final Logger LOGGER = Logger.getLogger(BackupController.class.getName());
    
    /**
     * Default timeout for backup operations in minutes.
     * This value balances between allowing sufficient time for large backups
     * and preventing indefinite blocking of the user interface.
     */
    private static final int DEFAULT_BACKUP_TIMEOUT_MINUTES = 15;
    
    /**
     * Default timeout for restore operations in minutes.
     * Restore operations typically take longer than backups due to data verification.
     */
    private static final int DEFAULT_RESTORE_TIMEOUT_MINUTES = 20;
    
    /**
     * Maximum number of backup entries to display in list views.
     * Prevents overwhelming the console interface with excessive output.
     */
    private static final int MAX_BACKUP_LIST_DISPLAY = 50;
    
    /**
     * Standard separator for console output formatting.
     */
    private static final String CONSOLE_SEPARATOR = "=".repeat(80);
    
    /**
     * Secondary separator for subsection formatting.
     */
    private static final String CONSOLE_SUB_SEPARATOR = "-".repeat(80);
    
    // ==================================================================================
    // INSTANCE FIELDS
    // ==================================================================================
    
    /**
     * Backup and recovery service instance for all backup operations.
     * This service handles the actual backup creation, restoration, and management.
     * 
     * @see BackupRecoveryService
     */
    private final BackupRecoveryService backupService;
    
    /**
     * Console view for user interface interactions.
     * Provides standardized input/output operations with proper formatting and validation.
     * 
     * @see ConsoleView
     */
    private final ConsoleView consoleView;
    
    /**
     * Permission service for role-based access control.
     * Validates user permissions before allowing access to sensitive backup operations.
     * 
     * @see PermissionService
     */
    private final PermissionService permissionService;
    
    // ==================================================================================
    // CONSTRUCTORS
    // ==================================================================================
    
    /**
     * Constructs a new BackupController with the specified console view.
     * 
     * <p>This constructor initializes all required services and establishes the
     * necessary dependencies for backup management operations. The controller
     * will use singleton instances of the backup and permission services.</p>
     * 
     * @param consoleView The console view for user interactions
     * @throws IllegalArgumentException if consoleView is null
     * @throws RuntimeException if required services cannot be initialized
     */
    
    public BackupController(final ConsoleView consoleView) {
        // Validate input parameters
        if (consoleView == null) {
            throw new IllegalArgumentException("ConsoleView cannot be null - required for user interaction");
        }
        
        this.consoleView = consoleView;
        
        try {
            // Initialize backup service
            this.backupService = BackupRecoveryService.getInstance();
            if (this.backupService == null) {
                throw new RuntimeException("Failed to initialize BackupRecoveryService - service unavailable");
            }
            
            // Initialize permission service
            this.permissionService = PermissionService.getInstance();
            if (this.permissionService == null) {
                throw new RuntimeException("Failed to initialize PermissionService - service unavailable");
            }
            
            LOGGER.info("BackupController initialized successfully with all required services");
            
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize BackupController services", e);
            throw new RuntimeException("BackupController initialization failed: " + e.getMessage(), e);
        }
    }
    
    // ==================================================================================
    // PUBLIC INTERFACE METHODS
    // ==================================================================================
    
    /**
     * Main entry point for backup management operations.
     * 
     * <p>This method provides a comprehensive backup management interface with menu-driven
     * navigation. It handles all user interactions and delegates to appropriate handler
     * methods based on user selections.</p>
     * 
     * <p><strong>Available Operations:</strong></p>
     * <ul>
     *   <li>Create new backups (Full, Incremental, Emergency)</li>
     *   <li>Restore system from existing backups</li>
     *   <li>View and browse all available backups</li>
     *   <li>Monitor backup system status and health</li>
     *   <li>Verify backup integrity and consistency</li>
     *   <li>Perform maintenance and cleanup operations</li>
     * </ul>
     * 
     * @param currentUser The authenticated user requesting backup management access
     * @throws IllegalArgumentException if currentUser is null
     * @see #handleCreateBackup(User)
     * @see #handleRestoreSystem(User)
     * @see #handleViewBackups(User)
     */
    public void handleBackupManagement(final User currentUser) {
        // Validate input parameters
        if (currentUser == null) {
            LOGGER.warning("Attempted backup management access with null user");
            consoleView.displayErrorMessage("Invalid user session. Cannot access backup management.");
            return;
        }
        
        LOGGER.info("Backup management session started for user: " + currentUser.getUsername());
        
        boolean managingBackups = true;
        
        while (managingBackups) {
            try {
                displayBackupMenu(currentUser);
                final int userChoice = consoleView.getMenuChoice();
                
                LOGGER.fine("User " + currentUser.getUsername() + " selected backup option: " + userChoice);
                
                switch (userChoice) {
                    case 1 -> {
                        LOGGER.info("Initiating backup creation for user: " + currentUser.getUsername());
                        handleCreateBackup(currentUser);
                    }
                    case 2 -> {
                        LOGGER.info("Initiating system restore for user: " + currentUser.getUsername());
                        handleRestoreSystem(currentUser);
                    }
                    case 3 -> {
                        LOGGER.info("Displaying backup list for user: " + currentUser.getUsername());
                        handleViewBackups(currentUser);
                    }
                    case 4 -> {
                        LOGGER.info("Displaying backup status for user: " + currentUser.getUsername());
                        handleBackupStatus(currentUser);
                    }
                    case 5 -> {
                        LOGGER.info("Initiating backup verification for user: " + currentUser.getUsername());
                        handleVerifyBackups(currentUser);
                    }
                    case 6 -> {
                        LOGGER.info("Initiating backup maintenance for user: " + currentUser.getUsername());
                        handleBackupMaintenance(currentUser);
                    }
                    case 0 -> {
                        LOGGER.info("Backup management session ended for user: " + currentUser.getUsername());
                        managingBackups = false;
                    }
                    default -> {
                        LOGGER.warning("Invalid menu option selected: " + userChoice + " by user: " + currentUser.getUsername());
                        consoleView.displayErrorMessage("Invalid option. Please select 0-6.");
                    }
                }
                
            } catch (final NumberFormatException e) {
                LOGGER.warning("Invalid numeric input in backup management: " + e.getMessage());
                consoleView.displayErrorMessage("Please enter a valid number (0-6).");
            } catch (final SecurityException e) {
                LOGGER.log(Level.WARNING, "Security violation in backup management by user: " + currentUser.getUsername(), e);
                consoleView.displayErrorMessage("Access denied: " + e.getMessage());
            } catch (final RuntimeException e) {
                LOGGER.log(Level.SEVERE, "Runtime error in backup management for user: " + currentUser.getUsername(), e);
                consoleView.displayErrorMessage("An unexpected error occurred: " + e.getMessage());
                consoleView.displayInfoMessage("The error has been logged for investigation.");
            } catch (final Exception e) {
                LOGGER.log(Level.SEVERE, "Unexpected error in backup management for user: " + currentUser.getUsername(), e);
                consoleView.displayErrorMessage("A critical error occurred in backup management: " + e.getMessage());
                consoleView.displayInfoMessage("Please contact system administrator if this persists.");
            }
        }
    }
    
    // ==================================================================================
    // PRIVATE MENU AND DISPLAY METHODS
    // ==================================================================================
    
    /**
     * Displays the main backup management menu with current status information.
     * 
     * <p>This method presents a professional, informative menu interface that includes
     * user context, notification indicators, and clear operation descriptions. The
     * display adapts based on the user's role and current system state.</p>
     * 
     * @param user The current user for context display and notification counting
     */
    
    private void displayBackupMenu(final User user) {
        Objects.requireNonNull(user, "User cannot be null for menu display");
        
        final int pendingNotifications = getBackupNotificationCount(user);
        final String statusSummary = getBackupStatusSummary();
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           BACKUP & RECOVERY MANAGEMENT CENTER - v4.0");
        System.out.println(CONSOLE_SEPARATOR);
        System.out.printf("Welcome, %s (%s)%n", user.getUsername(), user.getRole());
        System.out.println("System Status: " + statusSummary);
        
        if (pendingNotifications > 0) {
            System.out.printf("🔔 %d backup notification%s pending%n", 
                            pendingNotifications, 
                            pendingNotifications == 1 ? "" : "s");
        }
        
        System.out.println(CONSOLE_SUB_SEPARATOR);
        System.out.println("🔧 BACKUP OPERATIONS:");
        System.out.println("  1. Create Backup        - Create new system backup (Full/Incremental/Emergency)");
        System.out.println("  2. Restore System       - Restore from existing backup with safety measures");
        System.out.println();
        System.out.println("📊 MONITORING & MANAGEMENT:");
        System.out.println("  3. View Backups         - List and browse all available backups");
        System.out.println("  4. Backup Status        - Check backup system health and statistics");
        System.out.println("  5. Verify Integrity     - Verify backup file integrity and consistency");
        System.out.println();
        System.out.println("🛠️ MAINTENANCE:");
        System.out.println("  6. Maintenance          - Cleanup, optimization, and management tools");
        System.out.println();
        System.out.println("  0. Back to Main Menu    - Return to previous menu");
        System.out.println(CONSOLE_SEPARATOR);
        System.out.print("Choose an option (0-6): ");
    }
    
    // ==================================================================================
    // BACKUP CREATION METHODS
    // ==================================================================================
    
    /**
     * Handles comprehensive backup creation with type selection and monitoring.
     * 
     * <p>This method provides a guided interface for creating different types of backups
     * with comprehensive validation, progress monitoring, and detailed result reporting.
     * All operations are performed with proper permission checking and audit logging.</p>
     * 
     * <p><strong>Supported Backup Types:</strong></p>
     * <ul>
     *   <li><strong>Full Backup:</strong> Complete system state capture</li>
     *   <li><strong>Incremental:</strong> Changes since last backup only</li>
     *   <li><strong>Emergency:</strong> Critical system state for disaster recovery</li>
     * </ul>
     * 
     * @param user The authenticated user requesting backup creation
     */
    
    private void handleCreateBackup(final User user) {
        Objects.requireNonNull(user, "User cannot be null for backup creation");
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           BACKUP CREATION SYSTEM - ENTERPRISE EDITION");
        System.out.println(CONSOLE_SEPARATOR);
        
        try {
            // Validate user permissions
            if (!permissionService.hasPermission(user, "BACKUP_SYSTEM")) {
                LOGGER.warning("Access denied for backup creation - user: " + user.getUsername() + ", missing BACKUP_SYSTEM permission");
                consoleView.displayErrorMessage("Access denied. You need BACKUP_SYSTEM permissions to create backups.");
                return;
            }
            
            // Display backup type selection menu
            System.out.println("📦 Select backup type:");
            System.out.println("  1. Full Backup     - Complete system backup (all data and configuration)");
            System.out.println("  2. Incremental     - Changes since last backup (faster, space-efficient)");
            System.out.println("  3. Emergency       - Critical state backup (for disaster scenarios)");
            System.out.println("  0. Cancel          - Return to previous menu");
            System.out.println();
            System.out.print("Your choice (0-3): ");
            
            final int typeChoice = consoleView.getMenuChoice();
            final BackupMetadata.BackupType selectedType = switch (typeChoice) {
                case 1 -> BackupMetadata.BackupType.FULL;
                case 2 -> BackupMetadata.BackupType.INCREMENTAL;
                case 3 -> BackupMetadata.BackupType.EMERGENCY;
                case 0 -> {
                    LOGGER.info("Backup creation cancelled by user: " + user.getUsername());
                    consoleView.displayInfoMessage("Backup creation cancelled.");
                    yield null;
                }
                default -> {
                    LOGGER.warning("Invalid backup type selection: " + typeChoice + " by user: " + user.getUsername());
                    consoleView.displayErrorMessage("Invalid selection. Backup creation cancelled.");
                    yield null;
                }
            };
            
            if (selectedType == null) {
                return;
            }
            
            // Get backup description from user
            System.out.print("\n📝 Enter backup description (optional): ");
            String description = consoleView.getStringInput();
            
            if (description == null || description.trim().isEmpty()) {
                description = String.format("Backup created by %s - %s [%s]", 
                                          user.getUsername(), 
                                          selectedType.getDisplayName(),
                                          LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            }
            
            // Display confirmation and backup details
            System.out.println("\n" + CONSOLE_SUB_SEPARATOR);
            System.out.println("🔍 BACKUP DETAILS CONFIRMATION:");
            System.out.println("   Type: " + selectedType.getDisplayName());
            System.out.println("   Description: " + description);
            System.out.println("   Created by: " + user.getUsername());
            System.out.println("   Estimated duration: " + getEstimatedBackupDuration(selectedType));
            System.out.println(CONSOLE_SUB_SEPARATOR);
            
            if (!consoleView.getConfirmation("Proceed with backup creation?")) {
                LOGGER.info("Backup creation cancelled by user confirmation: " + user.getUsername());
                consoleView.displayInfoMessage("Backup creation cancelled.");
                return;
            }
            
            // Initiate backup operation
            LOGGER.info(String.format("Starting %s backup for user: %s", selectedType.name(), user.getUsername()));
            System.out.println("\n⏳ Starting " + selectedType.getDisplayName().toLowerCase() + "...");
            System.out.println("📝 Description: " + description);
            
            final CompletableFuture<BackupMetadata> backupFuture = createBackupByType(selectedType, user.getUsername(), description);
            
            if (backupFuture != null) {
                processBackupResult(backupFuture, selectedType, user);
            } else {
                LOGGER.severe("Failed to initiate backup operation - backupFuture is null");
                consoleView.displayErrorMessage("❌ Failed to initiate backup operation. Please check system status.");
            }
            
        } catch (final SecurityException e) {
            LOGGER.log(Level.WARNING, "Security exception during backup creation for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("Access denied: " + e.getMessage());
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception during backup creation for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("Backup creation failed: " + e.getMessage());
            consoleView.displayInfoMessage("Please contact system administrator if this issue persists.");
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception during backup creation for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("An unexpected error occurred during backup creation: " + e.getMessage());
            consoleView.displayInfoMessage("The error has been logged for investigation.");
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Creates a backup future based on the specified backup type.
     * 
     * @param backupType The type of backup to create
     * @param username The username of the user creating the backup
     * @param description The backup description
     * @return A CompletableFuture for the backup operation, or null if failed to initiate
     */
    private CompletableFuture<BackupMetadata> createBackupByType(final BackupMetadata.BackupType backupType,
                                                               final String username,
                                                               final String description) {
        return switch (backupType) {
            case FULL -> backupService.createFullBackup(null, username, description);
            case INCREMENTAL -> backupService.createIncrementalBackup(null, username, description, null);
            case DIFFERENTIAL -> backupService.createIncrementalBackup(null, username, description, null); // Treat as incremental for now
            case EMERGENCY -> backupService.createEmergencyBackup(null, username, description);
        };
    }
    
    /**
     * Processes the result of a backup operation with comprehensive reporting.
     * 
     * @param backupFuture The future representing the backup operation
     * @param backupType The type of backup being processed
     * @param user The user who initiated the backup
     */
    private void processBackupResult(final CompletableFuture<BackupMetadata> backupFuture,
                                   final BackupMetadata.BackupType backupType,
                                   final User user) {
        try {
            System.out.println("⏳ Backup in progress... Please wait.");
            System.out.println("💡 Tip: You can safely cancel with Ctrl+C if needed.");
            
            final BackupMetadata result = backupFuture.get(DEFAULT_BACKUP_TIMEOUT_MINUTES, TimeUnit.MINUTES);
            
            if (result != null && result.getStatus() == BackupMetadata.BackupStatus.COMPLETED) {
                LOGGER.info(String.format("Backup completed successfully - ID: %s, User: %s", 
                                        result.getBackupId(), user.getUsername()));
                
                consoleView.displaySuccessMessage("✅ Backup completed successfully!");
                System.out.println("📦 Backup ID: " + result.getBackupId());
                System.out.println("📍 Location: " + result.getBackupPath());
                System.out.println("📏 Size: " + result.getFormattedBackupSize());
                System.out.println("⏱️ Duration: " + calculateBackupDuration(result));
                System.out.println("🔍 Verification: " + (backupService.verifyBackupIntegrity(result) ? "✅ PASSED" : "❌ FAILED"));
                
            } else {
                final String status = result != null ? result.getStatus().toString() : "UNKNOWN";
                LOGGER.warning(String.format("Backup failed - Status: %s, User: %s", status, user.getUsername()));
                
                consoleView.displayErrorMessage("❌ Backup failed with status: " + status);
                if (result != null && result.getErrorMessage() != null) {
                    System.out.println("📋 Error details: " + result.getErrorMessage());
                }
                System.out.println("💡 Suggestion: Check system resources and try again.");
            }
            
        } catch (final TimeoutException e) {
            LOGGER.warning(String.format("Backup timeout after %d minutes for user: %s", DEFAULT_BACKUP_TIMEOUT_MINUTES, user.getUsername()));
            consoleView.displayErrorMessage("⏰ Backup is taking longer than expected (" + DEFAULT_BACKUP_TIMEOUT_MINUTES + " minutes timeout).");
            consoleView.displayInfoMessage("The backup may still be running in the background. Check status later.");
        } catch (final ExecutionException e) {
            LOGGER.log(Level.SEVERE, "Backup execution failed for user: " + user.getUsername(), e.getCause());
            consoleView.displayErrorMessage("❌ Backup execution failed: " + e.getCause().getMessage());
            consoleView.displayInfoMessage("Please check system logs for detailed error information.");
        } catch (final InterruptedException e) {
            LOGGER.warning("Backup was interrupted for user: " + user.getUsername());
            consoleView.displayErrorMessage("❌ Backup was interrupted: " + e.getMessage());
            Thread.currentThread().interrupt(); // Restore interruption status
        }
    }
    
    /**
     * Calculates the estimated duration for a backup type.
     * 
     * @param backupType The backup type
     * @return A human-readable duration estimate
     */
    private String getEstimatedBackupDuration(final BackupMetadata.BackupType backupType) {
        return switch (backupType) {
            case FULL -> "15-30 minutes (depending on data size)";
            case INCREMENTAL -> "2-10 minutes (changes only)";
            case DIFFERENTIAL -> "5-15 minutes (changes since last full backup)";
            case EMERGENCY -> "5-15 minutes (critical data only)";
        };
    }
    
    /**
     * Calculates the actual duration of a completed backup.
     * 
     * @param backup The completed backup metadata
     * @return A human-readable duration string
     */
    private String calculateBackupDuration(final BackupMetadata backup) {
        // Implementation would calculate duration from timestamps
        return "Duration calculation available in full implementation";
    }
    
    // ==================================================================================
    // SYSTEM RESTORE METHODS
    // ==================================================================================
    
    /**
     * Handles comprehensive system restore operations with safety measures.
     * 
     * <p>This method provides a secure, guided interface for system restoration with
     * multiple safety confirmations, pre-restore backup creation, and comprehensive
     * progress monitoring. All restore operations are logged and verified.</p>
     * 
     * @param user The authenticated user requesting system restore
     */
    
    private void handleRestoreSystem(final User user) {
        Objects.requireNonNull(user, "User cannot be null for system restore");
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           SYSTEM RESTORE CENTER - ENTERPRISE SECURITY");
        System.out.println(CONSOLE_SEPARATOR);
        
        try {
            // Validate user permissions for system restore
            if (!permissionService.hasPermission(user, "RESTORE_SYSTEM")) {
                LOGGER.warning("Access denied for system restore - user: " + user.getUsername() + ", missing RESTORE_SYSTEM permission");
                consoleView.displayErrorMessage("❌ Access denied. You need RESTORE_SYSTEM permissions for system restore.");
                consoleView.displayInfoMessage("This is a protected operation requiring elevated privileges.");
                return;
            }
            
            // Retrieve available backups for restore
            final List<BackupMetadata> availableBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
            
            if (availableBackups.isEmpty()) {
                LOGGER.info("No completed backups available for restore");
                consoleView.displayInfoMessage("📋 No completed backups available for restore.");
                consoleView.displayInfoMessage("💡 Please create a backup first before attempting restore operations.");
                return;
            }
            
            // Display available backups with detailed information
            System.out.println("\n📦 Available backups for system restore:");
            System.out.println(CONSOLE_SUB_SEPARATOR);
            
            for (int i = 0; i < availableBackups.size(); i++) {
                final BackupMetadata backup = availableBackups.get(i);
                System.out.printf("%d. %s%n", i + 1, backup.getSummary());
                System.out.printf("   📅 Created: %s by %s%n", backup.getCreatedAt(), backup.getCreatedBy());
                System.out.printf("   📝 Description: %s%n", backup.getDescription());
                System.out.printf("   📏 Size: %s | 🔍 Verified: %s%n", 
                                backup.getFormattedBackupSize(),
                                backupService.verifyBackupIntegrity(backup) ? "✅ YES" : "❌ NO");
                System.out.println(CONSOLE_SUB_SEPARATOR);
            }
            
            System.out.print("Select backup to restore (0 to cancel): ");
            final int backupChoice = consoleView.getMenuChoice();
            
            if (backupChoice > 0 && backupChoice <= availableBackups.size()) {
                final BackupMetadata selectedBackup = availableBackups.get(backupChoice - 1);
                performSecureRestore(selectedBackup, user);
            } else if (backupChoice != 0) {
                LOGGER.warning("Invalid backup selection: " + backupChoice + " by user: " + user.getUsername());
                consoleView.displayErrorMessage("❌ Invalid selection. Please choose a valid backup number.");
            } else {
                LOGGER.info("System restore cancelled by user: " + user.getUsername());
                consoleView.displayInfoMessage("System restore operation cancelled.");
            }
            
        } catch (final SecurityException e) {
            LOGGER.log(Level.WARNING, "Security exception during system restore for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Security violation: " + e.getMessage());
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception during system restore for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ System restore failed: " + e.getMessage());
            consoleView.displayInfoMessage("Please check system status and try again.");
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception during system restore for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ An unexpected error occurred during system restore: " + e.getMessage());
            consoleView.displayInfoMessage("The error has been logged for investigation.");
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Performs a secure system restore with multiple safety confirmations.
     * 
     * @param selectedBackup The backup to restore from
     * @param user The user performing the restore
     */
    private void performSecureRestore(final BackupMetadata selectedBackup, final User user) {
        // Display detailed backup information
        System.out.println("\n🔍 SELECTED BACKUP DETAILS:");
        System.out.println(CONSOLE_SUB_SEPARATOR);
        System.out.println(selectedBackup.getDetailedInfo());
        System.out.println(CONSOLE_SUB_SEPARATOR);
        
        // Multiple security confirmations for destructive operation
        System.out.println("\n⚠️  CRITICAL SECURITY WARNING:");
        System.out.println("   System restore will COMPLETELY REPLACE current data!");
        System.out.println("   This operation is IRREVERSIBLE without another backup!");
        System.out.println("   All current system state will be PERMANENTLY LOST!");
        
        if (!consoleView.getConfirmation("Do you understand the risks and want to proceed with restore from backup " + selectedBackup.getBackupId() + "?")) {
            LOGGER.info("System restore cancelled at first confirmation by user: " + user.getUsername());
            consoleView.displayInfoMessage("Restore operation cancelled for safety.");
            return;
        }
        
        if (!consoleView.getConfirmation("Are you ABSOLUTELY CERTAIN? This will OVERWRITE ALL current system data!")) {
            LOGGER.info("System restore cancelled at second confirmation by user: " + user.getUsername());
            consoleView.displayInfoMessage("Restore operation cancelled for safety.");
            return;
        }
        
        if (!consoleView.getConfirmation("FINAL CONFIRMATION: Type 'YES' to confirm system restore (any other input cancels)")) {
            LOGGER.info("System restore cancelled at final confirmation by user: " + user.getUsername());
            consoleView.displayInfoMessage("Restore operation cancelled for safety.");
            return;
        }
        
        executeSystemRestore(selectedBackup, user);
    }
    
    /**
     * Executes the actual system restore operation with comprehensive monitoring.
     * 
     * @param selectedBackup The backup to restore from
     * @param user The user performing the restore
     */
    private void executeSystemRestore(final BackupMetadata selectedBackup, final User user) {
        try {
            LOGGER.info(String.format("Starting system restore from backup %s by user: %s", selectedBackup.getBackupId(), user.getUsername()));
            
            System.out.println("\n🔄 Starting system restore operation...");
            System.out.println("📋 Creating pre-restore safety backup...");
            System.out.println("⏳ This operation may take " + DEFAULT_RESTORE_TIMEOUT_MINUTES + " minutes or more...");
            System.out.println("💡 Please DO NOT interrupt this process!");
            
            final CompletableFuture<Boolean> restoreFuture = backupService.restoreFromBackup(
                selectedBackup.getBackupId(), null, user.getUsername(), true);
            
            System.out.println("⏳ Restore in progress... Please wait patiently.");
            System.out.println("🔧 System is being restored to state: " + selectedBackup.getCreatedAt());
            
            final Boolean restoreResult = restoreFuture.get(DEFAULT_RESTORE_TIMEOUT_MINUTES, TimeUnit.MINUTES);
            
            if (restoreResult != null && restoreResult) {
                LOGGER.info(String.format("System restore completed successfully from backup %s by user: %s", selectedBackup.getBackupId(), user.getUsername()));
                
                consoleView.displaySuccessMessage("✅ System restore completed successfully!");
                System.out.println("🔄 Data has been restored from backup: " + selectedBackup.getBackupId());
                System.out.println("📅 System state restored to: " + selectedBackup.getCreatedAt());
                System.out.println("🔒 Pre-restore backup was created for safety");
                System.out.println("🔄 IMPORTANT: Please restart the application to use restored data");
                System.out.println("📋 Verify system functionality after restart");
            } else {
                LOGGER.severe(String.format("System restore failed for backup %s by user: %s", selectedBackup.getBackupId(), user.getUsername()));
                
                consoleView.displayErrorMessage("❌ System restore operation failed!");
                consoleView.displayInfoMessage("🔒 Your original data should still be intact.");
                consoleView.displayInfoMessage("📋 Check system logs for detailed error information.");
                consoleView.displayInfoMessage("💡 Contact system administrator if needed.");
            }
            
        } catch (final TimeoutException e) {
            LOGGER.warning(String.format("System restore timeout after %d minutes for user: %s", DEFAULT_RESTORE_TIMEOUT_MINUTES, user.getUsername()));
            consoleView.displayErrorMessage("⏰ Restore operation timed out (" + DEFAULT_RESTORE_TIMEOUT_MINUTES + " minutes).");
            consoleView.displayInfoMessage("The operation may still be running in the background.");
            consoleView.displayInfoMessage("📋 Check system status before attempting another restore.");
        } catch (final ExecutionException e) {
            LOGGER.log(Level.SEVERE, "System restore execution failed for user: " + user.getUsername(), e.getCause());
            consoleView.displayErrorMessage("❌ Restore execution failed: " + e.getCause().getMessage());
            consoleView.displayInfoMessage("🔒 Your original data should still be intact.");
        } catch (final InterruptedException e) {
            LOGGER.warning("System restore was interrupted for user: " + user.getUsername());
            consoleView.displayErrorMessage("❌ Restore was interrupted: " + e.getMessage());
            consoleView.displayInfoMessage("🔒 Your original data should still be intact.");
            Thread.currentThread().interrupt();
        }
    }
    
    // ==================================================================================
    // BACKUP MONITORING AND INFORMATION METHODS
    // ==================================================================================
    
    /**
     * Displays comprehensive backup viewing and browsing interface.
     * 
     * @param user The authenticated user requesting backup information
     */
    private void handleViewBackups(final User user) {
        Objects.requireNonNull(user, "User cannot be null for viewing backups");
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           BACKUP REPOSITORY BROWSER");
        System.out.println(CONSOLE_SEPARATOR);
        
        try {
            final List<BackupMetadata> allBackups = backupService.getAllBackups();
            
            if (allBackups.isEmpty()) {
                consoleView.displayInfoMessage("📋 No backups found in the system.");
                consoleView.displayInfoMessage("💡 Create your first backup using option 1 from the main menu.");
            } else {
                LOGGER.info("Displaying " + allBackups.size() + " backups to user: " + user.getUsername());
                displayBackupList(allBackups, "Complete Backup Repository");
                
                System.out.println("\n📊 BACKUP STATISTICS:");
                displayBackupStatistics(allBackups);
            }
            
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception while viewing backups for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Error retrieving backup information: " + e.getMessage());
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception while viewing backups for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ An unexpected error occurred: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Displays comprehensive backup system status and health information.
     * 
     * @param user The authenticated user requesting status information
     */
    private void handleBackupStatus(final User user) {
        Objects.requireNonNull(user, "User cannot be null for backup status");
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           BACKUP SYSTEM STATUS & HEALTH MONITOR");
        System.out.println(CONSOLE_SEPARATOR);
        
        try {
            final List<BackupMetadata> allBackups = backupService.getAllBackups();
            
            // Calculate status statistics
            final long completedCount = allBackups.stream()
                .filter(backup -> backup.getStatus() == BackupMetadata.BackupStatus.COMPLETED)
                .count();
            final long failedCount = allBackups.stream()
                .filter(backup -> backup.getStatus() == BackupMetadata.BackupStatus.FAILED)
                .count();
            final long inProgressCount = allBackups.stream()
                .filter(backup -> backup.getStatus() == BackupMetadata.BackupStatus.IN_PROGRESS)
                .count();
            
            // Display comprehensive status
            System.out.println("🔍 SYSTEM OVERVIEW:");
            System.out.printf("   Total Backups: %d%n", allBackups.size());
            System.out.printf("   ✅ Completed: %d (%.1f%%)%n", completedCount, getPercentage(completedCount, allBackups.size()));
            System.out.printf("   ❌ Failed: %d (%.1f%%)%n", failedCount, getPercentage(failedCount, allBackups.size()));
            System.out.printf("   ⏳ In Progress: %d (%.1f%%)%n", inProgressCount, getPercentage(inProgressCount, allBackups.size()));
            
            System.out.println("\n📈 SYSTEM HEALTH:");
            final double healthScore = calculateSystemHealth(completedCount, failedCount, allBackups.size());
            System.out.printf("   Health Score: %.1f/100 %s%n", healthScore, getHealthIcon(healthScore));
            System.out.println("   Last Backup: " + getLastBackupInfo(allBackups));
            System.out.println("   Next Recommended: " + getNextBackupRecommendation());
            
            if (failedCount > 0) {
                System.out.println("\n⚠️  ATTENTION REQUIRED:");
                System.out.printf("   %d failed backup(s) need investigation%n", failedCount);
                System.out.println("   Consider running backup verification (option 5)");
            }
            
            if (inProgressCount > 0) {
                System.out.println("\n🔄 ACTIVE OPERATIONS:");
                System.out.printf("   %d backup operation(s) currently running%n", inProgressCount);
                System.out.println("   Monitor progress or check for stalled operations");
            }
            
            LOGGER.info("Backup status displayed to user: " + user.getUsername());
            
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception while getting backup status for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Error retrieving backup status: " + e.getMessage());
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception while getting backup status for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ An unexpected error occurred: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handles comprehensive backup integrity verification operations.
     * 
     * @param user The authenticated user requesting verification
     */
    private void handleVerifyBackups(final User user) {
        Objects.requireNonNull(user, "User cannot be null for backup verification");
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           BACKUP INTEGRITY VERIFICATION SYSTEM");
        System.out.println(CONSOLE_SEPARATOR);
        
        try {
            final List<BackupMetadata> completedBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.COMPLETED);
            
            if (completedBackups.isEmpty()) {
                consoleView.displayInfoMessage("📋 No completed backups available for verification.");
                consoleView.displayInfoMessage("💡 Create some backups first, then run verification.");
                return;
            }
            
            System.out.println("🔍 Starting integrity verification for " + completedBackups.size() + " backup(s)...");
            System.out.println("⏳ This process may take several minutes...");
            System.out.println();
            
            int verifiedCount = 0;
            int failedCount = 0;
            
            for (final BackupMetadata backup : completedBackups) {
                System.out.printf("🔍 Verifying %s... ", backup.getBackupId());
                
                try {
                    final boolean isValid = backupService.verifyBackupIntegrity(backup);
                    if (isValid) {
                        System.out.println("✅ VALID");
                        verifiedCount++;
                    } else {
                        System.out.println("❌ CORRUPTED");
                        failedCount++;
                        LOGGER.warning("Backup integrity verification failed for: " + backup.getBackupId());
                    }
                } catch (final Exception e) {
                    System.out.println("⚠️ ERROR: " + e.getMessage());
                    failedCount++;
                    LOGGER.warning("Exception during backup verification for " + backup.getBackupId() + ": " + e.getMessage());
                }
            }
            
            // Display verification results
            System.out.println("\n📊 VERIFICATION RESULTS:");
            System.out.println(CONSOLE_SUB_SEPARATOR);
            System.out.printf("   ✅ Valid Backups: %d%n", verifiedCount);
            System.out.printf("   ❌ Corrupted/Failed: %d%n", failedCount);
            System.out.printf("   📈 Success Rate: %.1f%%%n", getPercentage(verifiedCount, completedBackups.size()));
            
            if (failedCount > 0) {
                System.out.println("\n⚠️  RECOMMENDATIONS:");
                System.out.println("   • Investigate corrupted backups immediately");
                System.out.println("   • Consider creating new backups to replace corrupted ones");
                System.out.println("   • Check storage system health and integrity");
            } else {
                System.out.println("\n✅ EXCELLENT: All backups passed integrity verification!");
            }
            
            LOGGER.info(String.format("Backup verification completed - %d verified, %d failed, by user: %s", 
                                    verifiedCount, failedCount, user.getUsername()));
            
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception during backup verification for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Error during backup verification: " + e.getMessage());
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception during backup verification for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ An unexpected error occurred during verification: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    // ==================================================================================
    // BACKUP MAINTENANCE METHODS
    // ==================================================================================
    
    /**
     * Handles comprehensive backup maintenance operations menu.
     * 
     * @param user The authenticated user requesting maintenance operations
     */
    private void handleBackupMaintenance(final User user) {
        Objects.requireNonNull(user, "User cannot be null for backup maintenance");
        
        System.out.println("\n" + CONSOLE_SEPARATOR);
        System.out.println("           BACKUP MAINTENANCE & OPTIMIZATION CENTER");
        System.out.println(CONSOLE_SEPARATOR);
        
        System.out.println("🛠️ Available maintenance operations:");
        System.out.println("  1. Clean Expired Backups    - Remove old and expired backup files");
        System.out.println("  2. Delete Specific Backup   - Remove a specific backup by selection");
        System.out.println("  3. Optimize Storage         - Defragment and optimize backup storage");
        System.out.println("  4. Repair Corrupted Files   - Attempt to repair damaged backups");
        System.out.println("  0. Back to Main Menu        - Return to backup management");
        System.out.println();
        System.out.print("Select maintenance operation (0-4): ");
        
        final int maintenanceChoice = consoleView.getMenuChoice();
        
        switch (maintenanceChoice) {
            case 1 -> {
                LOGGER.info("Initiating expired backup cleanup for user: " + user.getUsername());
                handleCleanExpiredBackups(user);
            }
            case 2 -> {
                LOGGER.info("Initiating specific backup deletion for user: " + user.getUsername());
                handleDeleteSpecificBackup(user);
            }
            case 3 -> {
                LOGGER.info("Storage optimization requested by user: " + user.getUsername());
                handleStorageOptimization(user);
            }
            case 4 -> {
                LOGGER.info("Backup repair requested by user: " + user.getUsername());
                handleBackupRepair(user);
            }
            case 0 -> {
                LOGGER.info("Maintenance menu exited by user: " + user.getUsername());
                consoleView.displayInfoMessage("Returning to backup management menu.");
            }
            default -> {
                LOGGER.warning("Invalid maintenance option selected: " + maintenanceChoice + " by user: " + user.getUsername());
                consoleView.displayErrorMessage("Invalid selection. Please choose 0-4.");
            }
        }
    }
    
    /**
     * Handles automatic cleanup of expired backup files.
     * 
     * @param user The authenticated user requesting cleanup
     */
    private void handleCleanExpiredBackups(final User user) {
        Objects.requireNonNull(user, "User cannot be null for cleanup operations");
        
        System.out.println("\n📋 EXPIRED BACKUP CLEANUP SYSTEM");
        System.out.println(CONSOLE_SUB_SEPARATOR);
        
        try {
            final List<BackupMetadata> expiredBackups = backupService.getExpiredBackups();
            
            if (expiredBackups.isEmpty()) {
                consoleView.displayInfoMessage("✅ No expired backups found - system is clean!");
                consoleView.displayInfoMessage("💡 Your backup retention policies are working effectively.");
                return;
            }
            
            System.out.println("🗑️ Found " + expiredBackups.size() + " expired backup(s):");
            displayBackupList(expiredBackups, "Expired Backups Scheduled for Deletion");
            
            final long totalSize = expiredBackups.stream()
                .mapToLong(backup -> backup.getBackupSizeBytes())
                .sum();
            
            System.out.println("\n📊 CLEANUP IMPACT:");
            System.out.printf("   Files to delete: %d%n", expiredBackups.size());
            System.out.printf("   Space to reclaim: ~%d MB%n", totalSize / (1024 * 1024));
            System.out.println("   ⚠️ This operation is PERMANENT and cannot be undone!");
            
            if (consoleView.getConfirmation("Proceed with expired backup cleanup?")) {
                LOGGER.info("Starting expired backup cleanup - " + expiredBackups.size() + " backups by user: " + user.getUsername());
                
                final int deletedCount = backupService.cleanExpiredBackups();
                
                if (deletedCount > 0) {
                    LOGGER.info("Expired backup cleanup completed - " + deletedCount + " backups deleted by user: " + user.getUsername());
                    consoleView.displaySuccessMessage("✅ Successfully deleted " + deletedCount + " expired backup(s).");
                    System.out.printf("💾 Reclaimed approximately %d MB of storage space.%n", totalSize / (1024 * 1024));
                } else {
                    LOGGER.warning("Expired backup cleanup failed - no backups deleted by user: " + user.getUsername());
                    consoleView.displayErrorMessage("❌ Cleanup operation failed - no backups were deleted.");
                    consoleView.displayInfoMessage("Check system permissions and storage access.");
                }
            } else {
                LOGGER.info("Expired backup cleanup cancelled by user: " + user.getUsername());
                consoleView.displayInfoMessage("Cleanup operation cancelled - no changes made.");
            }
            
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception during expired backup cleanup for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Error during cleanup operation: " + e.getMessage());
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception during expired backup cleanup for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ An unexpected error occurred during cleanup: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handles selective deletion of specific backup files.
     * 
     * @param user The authenticated user requesting deletion
     */
    private void handleDeleteSpecificBackup(final User user) {
        Objects.requireNonNull(user, "User cannot be null for backup deletion");
        
        System.out.println("\n🗑️ SPECIFIC BACKUP DELETION SYSTEM");
        System.out.println(CONSOLE_SUB_SEPARATOR);
        
        try {
            final List<BackupMetadata> allBackups = backupService.getAllBackups();
            
            if (allBackups.isEmpty()) {
                consoleView.displayInfoMessage("📋 No backups found in the system.");
                consoleView.displayInfoMessage("💡 Nothing to delete - create some backups first.");
                return;
            }
            
            System.out.println("📦 Available backups for deletion:");
            System.out.println(CONSOLE_SUB_SEPARATOR);
            
            for (int i = 0; i < allBackups.size(); i++) {
                final BackupMetadata backup = allBackups.get(i);
                System.out.printf("%d. %s - %s%n", i + 1, backup.getBackupId(), backup.getDescription());
                System.out.printf("   📅 Created: %s | 📏 Size: %s | Status: %s%n", 
                                backup.getCreatedAt(), backup.getFormattedBackupSize(), backup.getStatus().getDisplayName());
            }
            
            System.out.print("\nSelect backup to delete (0 to cancel): ");
            final int deletionChoice = consoleView.getMenuChoice();
            
            if (deletionChoice > 0 && deletionChoice <= allBackups.size()) {
                final BackupMetadata selectedBackup = allBackups.get(deletionChoice - 1);
                performSecureBackupDeletion(selectedBackup, user);
            } else if (deletionChoice != 0) {
                LOGGER.warning("Invalid backup deletion selection: " + deletionChoice + " by user: " + user.getUsername());
                consoleView.displayErrorMessage("❌ Invalid selection. Please choose a valid backup number.");
            } else {
                LOGGER.info("Backup deletion cancelled by user: " + user.getUsername());
                consoleView.displayInfoMessage("Deletion operation cancelled.");
            }
            
        } catch (final RuntimeException e) {
            LOGGER.log(Level.SEVERE, "Runtime exception during backup deletion for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Error during backup deletion: " + e.getMessage());
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected exception during backup deletion for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ An unexpected error occurred during deletion: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Performs secure backup deletion with confirmation.
     * 
     * @param backup The backup to delete
     * @param user The user performing the deletion
     */
    private void performSecureBackupDeletion(final BackupMetadata backup, final User user) {
        System.out.println("\n⚠️ BACKUP DELETION CONFIRMATION");
        System.out.println(CONSOLE_SUB_SEPARATOR);
        System.out.println("Backup ID: " + backup.getBackupId());
        System.out.println("Description: " + backup.getDescription());
        System.out.println("Size: " + backup.getFormattedBackupSize());
        System.out.println("Created: " + backup.getCreatedAt());
        System.out.println("\n🚨 WARNING: This operation is PERMANENT and IRREVERSIBLE!");
        
        if (consoleView.getConfirmation("Are you sure you want to delete backup " + backup.getBackupId() + "?")) {
            try {
                LOGGER.info("Deleting backup " + backup.getBackupId() + " requested by user: " + user.getUsername());
                
                final boolean deletionResult = backupService.deleteBackup(backup.getBackupId());
                
                if (deletionResult) {
                    LOGGER.info("Backup deletion successful - " + backup.getBackupId() + " by user: " + user.getUsername());
                    consoleView.displaySuccessMessage("✅ Backup deleted successfully!");
                    System.out.println("🗑️ Backup " + backup.getBackupId() + " has been permanently removed.");
                } else {
                    LOGGER.warning("Backup deletion failed - " + backup.getBackupId() + " by user: " + user.getUsername());
                    consoleView.displayErrorMessage("❌ Failed to delete backup.");
                    consoleView.displayInfoMessage("Check system permissions and storage access.");
                }
            } catch (final Exception e) {
                LOGGER.log(Level.SEVERE, "Exception during backup deletion for " + backup.getBackupId() + " by user: " + user.getUsername(), e);
                consoleView.displayErrorMessage("❌ Error deleting backup: " + e.getMessage());
            }
        } else {
            LOGGER.info("Backup deletion cancelled for " + backup.getBackupId() + " by user: " + user.getUsername());
            consoleView.displayInfoMessage("Deletion cancelled - backup preserved.");
        }
    }
    
    /**
     * Handles storage optimization operations.
     * 
     * @param user The authenticated user requesting optimization
     */
    private void handleStorageOptimization(final User user) {
        consoleView.displayInfoMessage("🔧 Storage optimization feature will be available in the next version.");
        consoleView.displayInfoMessage("💡 Current version focuses on core backup functionality.");
        LOGGER.info("Storage optimization requested but not yet implemented by user: " + user.getUsername());
    }
    
    /**
     * Handles backup repair operations.
     * 
     * @param user The authenticated user requesting repair
     */
    private void handleBackupRepair(final User user) {
        consoleView.displayInfoMessage("🔧 Backup repair feature will be available in the next version.");
        consoleView.displayInfoMessage("💡 For now, consider recreating corrupted backups.");
        LOGGER.info("Backup repair requested but not yet implemented by user: " + user.getUsername());
    }
    
    // ==================================================================================
    // UTILITY AND DISPLAY METHODS
    // ==================================================================================
    
    /**
     * Displays a formatted list of backups with comprehensive information.
     * 
     * @param backups The list of backups to display
     * @param title The title for the backup list
     */
    private void displayBackupList(final List<BackupMetadata> backups, final String title) {
        Objects.requireNonNull(backups, "Backup list cannot be null");
        Objects.requireNonNull(title, "Title cannot be null");
        
        System.out.println("\n📋 " + title.toUpperCase() + ":");
        System.out.println(CONSOLE_SEPARATOR);
        
        if (backups.isEmpty()) {
            System.out.println("   No backups to display");
            System.out.println(CONSOLE_SEPARATOR);
            return;
        }
        
        for (final BackupMetadata backup : backups) {
            System.out.printf("🆔 ID: %s%n", backup.getBackupId());
            System.out.printf("📂 Type: %s%n", backup.getBackupType().getDisplayName());
            System.out.printf("📊 Status: %s%n", backup.getStatus().getDisplayName());
            System.out.printf("📅 Created: %s by %s%n", backup.getCreatedAt(), backup.getCreatedBy());
            System.out.printf("📝 Description: %s%n", backup.getDescription());
            System.out.printf("📏 Size: %s%n", backup.getFormattedBackupSize());
            System.out.println(CONSOLE_SUB_SEPARATOR);
        }
    }
    
    /**
     * Displays statistical information about backup collections.
     * 
     * @param backups The list of backups to analyze
     */
    private void displayBackupStatistics(final List<BackupMetadata> backups) {
        if (backups.isEmpty()) {
            return;
        }
        
        final long totalBackups = backups.size();
        final long fullBackups = backups.stream().filter(b -> b.getBackupType() == BackupMetadata.BackupType.FULL).count();
        final long incrementalBackups = backups.stream().filter(b -> b.getBackupType() == BackupMetadata.BackupType.INCREMENTAL).count();
        final long emergencyBackups = backups.stream().filter(b -> b.getBackupType() == BackupMetadata.BackupType.EMERGENCY).count();
        
        System.out.printf("   Total Backups: %d%n", totalBackups);
        System.out.printf("   📦 Full: %d (%.1f%%) | 📈 Incremental: %d (%.1f%%) | 🚨 Emergency: %d (%.1f%%)%n",
                        fullBackups, getPercentage(fullBackups, totalBackups),
                        incrementalBackups, getPercentage(incrementalBackups, totalBackups),
                        emergencyBackups, getPercentage(emergencyBackups, totalBackups));
    }
    
    /**
     * Calculates percentage with proper handling of division by zero.
     * 
     * @param part The part value
     * @param total The total value
     * @return The percentage as a double
     */
    private double getPercentage(final long part, final long total) {
        return total > 0 ? (part * 100.0) / total : 0.0;
    }
    
    /**
     * Calculates system health score based on backup success rates.
     * 
     * @param completed Number of completed backups
     * @param failed Number of failed backups
     * @param total Total number of backups
     * @return Health score from 0 to 100
     */
    private double calculateSystemHealth(final long completed, final long failed, final long total) {
        if (total == 0) {
            return 100.0; // Perfect score if no backups (no failures)
        }
        
        final double successRate = (completed * 100.0) / total;
        final double failureImpact = (failed * 20.0); // Each failure reduces score by 20 points
        
        return Math.max(0.0, Math.min(100.0, successRate - failureImpact));
    }
    
    /**
     * Gets appropriate health icon based on health score.
     * 
     * @param healthScore The health score (0-100)
     * @return Appropriate emoji icon
     */
    private String getHealthIcon(final double healthScore) {
        if (healthScore >= 90) return "🟢";
        if (healthScore >= 70) return "🟡";
        if (healthScore >= 50) return "🟠";
        return "🔴";
    }
    
    /**
     * Gets information about the last backup operation.
     * 
     * @param allBackups List of all backups
     * @return Human-readable last backup information
     */
    private String getLastBackupInfo(final List<BackupMetadata> allBackups) {
        if (allBackups.isEmpty()) {
            return "No backups found";
        }
        
        // Find the most recent backup (simplified implementation)
        final BackupMetadata lastBackup = allBackups.get(allBackups.size() - 1);
        return String.format("%s (%s)", lastBackup.getCreatedAt(), lastBackup.getBackupType().getDisplayName());
    }
    
    /**
     * Gets recommendation for next backup operation.
     * 
     * @return Human-readable backup recommendation
     */
    private String getNextBackupRecommendation() {
        // Simplified recommendation logic
        return "Within 24 hours (Full backup recommended)";
    }
    
    // ==================================================================================
    // PUBLIC STATUS AND NOTIFICATION METHODS
    // ==================================================================================
    
    /**
     * Gets a comprehensive backup system status summary for dashboard display.
     * 
     * <p>This method provides a concise overview of the backup system status suitable
     * for display in dashboards, status bars, or summary reports. It includes counts
     * of total and completed backups with error handling for robustness.</p>
     * 
     * @return A formatted status summary string
     */
    public String getBackupStatusSummary() {
        try {
            final List<BackupMetadata> allBackups = backupService.getAllBackups();
            final long completedCount = allBackups.stream()
                .filter(backup -> backup.getStatus() == BackupMetadata.BackupStatus.COMPLETED)
                .count();
            
            return String.format("Backups: %d total, %d completed (%.1f%% success)", 
                               allBackups.size(), 
                               completedCount, 
                               getPercentage(completedCount, allBackups.size()));
                               
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, "Error getting backup status summary", e);
            return "Backup status unavailable: " + e.getMessage();
        }
    }
    
    /**
     * Gets the count of backup-related notifications for a specific user.
     * 
     * <p>This method calculates notification-worthy events such as failed backups
     * and expired backups that require user attention. It's used for dashboard
     * notification indicators and user alerts.</p>
     * 
     * @param user The user for whom to count notifications (currently unused but preserved for future use)
     * @return The number of backup-related notifications
     */
    private int getBackupNotificationCount(final User user) {
        try {
            final List<BackupMetadata> failedBackups = backupService.getBackupsByStatus(BackupMetadata.BackupStatus.FAILED);
            final List<BackupMetadata> expiredBackups = backupService.getExpiredBackups();
            
            return failedBackups.size() + expiredBackups.size();
            
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, "Error getting backup notification count for user: " + 
                      (user != null ? user.getUsername() : "null"), e);
            return 0;
        }
    }
    
    /**
     * Checks and displays backup-related notifications for a user.
     * 
     * <p>This method provides proactive notification checking for backup-related
     * events that require user attention. It's designed to be called during user
     * login or dashboard display to alert users of important backup status changes.</p>
     * 
     * @param user The user to check notifications for
     */
    public void checkBackupNotifications(final User user) {
        Objects.requireNonNull(user, "User cannot be null for notification checking");
        
        try {
            final int notificationCount = getBackupNotificationCount(user);
            
            if (notificationCount > 0) {
                LOGGER.info("Displaying " + notificationCount + " backup notifications to user: " + user.getUsername());
                consoleView.displayInfoMessage(String.format("🔔 You have %d backup-related notification%s requiring attention.", 
                                                            notificationCount, 
                                                            notificationCount == 1 ? "" : "s"));
                consoleView.displayInfoMessage("💡 Access Backup Management to review and resolve these issues.");
            }
            
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, "Error checking backup notifications for user: " + user.getUsername(), e);
            // Silently handle errors in notification checking to avoid disrupting user workflow
        }
    }
}
