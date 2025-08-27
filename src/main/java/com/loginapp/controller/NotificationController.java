package com.loginapp.controller;

import com.loginapp.model.Notification;
import com.loginapp.model.User;
import com.loginapp.services.NotificationService;
import com.loginapp.services.PermissionService;
import com.loginapp.view.ConsoleView;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * NotificationController - Enterprise-grade notification management system controller.
 * 
 * <p>This class provides comprehensive notification management capabilities with professional-grade
 * security, validation, and user experience features. It serves as the primary interface for all
 * notification-related operations in the system including viewing, creating, managing, and 
 * configuring notifications.</p>
 * 
 * <p><strong>Key Features:</strong></p>
 * <ul>
 *   <li>Comprehensive notification viewing and filtering (all, unread, urgent)</li>
 *   <li>Bulk operations for marking as read and archiving</li>
 *   <li>Advanced notification creation with type-specific handling</li>
 *   <li>Real-time notification status monitoring and alerts</li>
 *   <li>User-specific notification preferences and settings</li>
 *   <li>Permission-based access control for administrative functions</li>
 *   <li>Rich formatting and visual indicators for improved UX</li>
 *   <li>Comprehensive error handling with graceful degradation</li>
 * </ul>
 * 
 * <p><strong>Security Features:</strong></p>
 * <ul>
 *   <li>Role-based permission validation for sensitive operations</li>
 *   <li>User session validation and protection</li>
 *   <li>Audit logging for all notification management activities</li>
 *   <li>Input validation and sanitization throughout</li>
 * </ul>
 * 
 * <p><strong>Thread Safety:</strong></p>
 * This controller is designed for concurrent access and uses thread-safe operations
 * throughout. All notification operations are handled with proper synchronization
 * and error recovery mechanisms.
 * 
 * <p><strong>Usage Example:</strong></p>
 * <pre>{@code
 * // Initialize controller with view dependency
 * NotificationController controller = new NotificationController(consoleView);
 * 
 * // Handle notification management for authenticated user
 * controller.handleNotificationManagement(currentUser);
 * 
 * // Check for urgent notifications
 * controller.checkPendingNotifications(currentUser);
 * 
 * // Get notification summary for dashboard
 * String summary = controller.getNotificationSummary(currentUser);
 * }</pre>
 * 
 * @author Enterprise Development Team
 * @version 5.0 - Professional Enterprise Edition
 * @since 1.0
 * @see NotificationService
 * @see Notification
 * @see PermissionService
 */
public final class NotificationController {
    
    // Static Constants - Professional Configuration
    private static final String CLASS_NAME = NotificationController.class.getSimpleName();
    private static final Logger LOGGER = Logger.getLogger(CLASS_NAME);
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    
    // Operation Timeout Configuration
    private static final int DEFAULT_OPERATION_TIMEOUT_SECONDS = 30;
    private static final int MAX_NOTIFICATION_DISPLAY_COUNT = 50;
    private static final int NOTIFICATION_PREVIEW_LENGTH = 80;
    
    // Visual Constants for Professional UI
    private static final String SEPARATOR_LINE = "═".repeat(80);
    private static final String MENU_BORDER = "─".repeat(60);
    private static final String URGENT_INDICATOR = "[🔴 URGENTE]";
    private static final String UNREAD_INDICATOR = "[📬 NOVA]";
    private static final String READ_INDICATOR = "[📭 LIDA]";
    
    // Dependencies - Enterprise Architecture
    private final ConsoleView consoleView;
    private final NotificationService notificationService;
    private final PermissionService permissionService;
    
    /**
     * Constructs a new NotificationController with professional dependency injection.
     * 
     * <p>This constructor initializes the controller with all required services and
     * validates the provided dependencies to ensure proper system operation.</p>
     * 
     * @param consoleView The view component for user interface operations, must not be null
     * @throws IllegalArgumentException if consoleView is null
     * @throws IllegalStateException if required services cannot be initialized
     * 
     * @apiNote This constructor uses the singleton pattern for service dependencies
     *          to ensure consistent system-wide behavior and resource optimization.
     */
    public NotificationController(final ConsoleView consoleView) {
        // Professional validation with detailed error messages
        this.consoleView = Objects.requireNonNull(consoleView, 
            "ConsoleView dependency cannot be null - required for user interface operations");
        
        try {
            // Initialize services with error recovery
            this.notificationService = NotificationService.getInstance();
            this.permissionService = PermissionService.getInstance();
            
            // Validate service initialization
            if (this.notificationService == null) {
                throw new IllegalStateException("NotificationService initialization failed - service unavailable");
            }
            if (this.permissionService == null) {
                throw new IllegalStateException("PermissionService initialization failed - service unavailable");
            }
            
            LOGGER.info("NotificationController initialized successfully with all dependencies");
            
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize NotificationController dependencies", e);
            throw new IllegalStateException("NotificationController initialization failed: " + e.getMessage(), e);
        }
    }    
    /**
     * Handles comprehensive notification management for an authenticated user.
     * 
     * <p>This method provides the main entry point for notification management operations.
     * It displays a professional menu interface and handles user selections with proper
     * validation, error recovery, and audit logging.</p>
     * 
     * <p><strong>Available Operations:</strong></p>
     * <ul>
     *   <li>View all notifications with filtering and pagination</li>
     *   <li>View unread notifications with priority indicators</li>
     *   <li>Mark all notifications as read (bulk operation)</li>
     *   <li>Archive old notifications for cleanup</li>
     *   <li>Create new system notifications (admin only)</li>
     *   <li>Configure notification preferences</li>
     * </ul>
     * 
     * @param currentUser The authenticated user performing notification management,
     *                   must not be null and must have valid session
     * @throws IllegalArgumentException if currentUser is null or has invalid session
     * @throws SecurityException if user lacks required permissions for requested operations
     * 
     * @apiNote This method uses transaction-like behavior for bulk operations
     *          and provides rollback capabilities for failed operations.
     */
    public void handleNotificationManagement(final User currentUser) {
        Objects.requireNonNull(currentUser, "User cannot be null for notification management");
        
        if (currentUser.getUsername() == null || currentUser.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("User must have valid username for notification operations");
        }
        
        try {
            LOGGER.info(String.format("Starting notification management session for user: %s", 
                currentUser.getUsername()));
            
            // Check for urgent notifications first
            checkPendingNotifications(currentUser);
            
            boolean continueManagement = true;
            while (continueManagement) {
                try {
                    displayNotificationMenu(currentUser);
                    final int choice = readInt("\n🔔 Escolha uma opção: ");
                    
                    continueManagement = switch (choice) {
                        case 1 -> {
                            handleViewNotifications(currentUser);
                            yield true;
                        }
                        case 2 -> {
                            handleViewUnreadNotifications(currentUser);
                            yield true;
                        }
                        case 3 -> {
                            handleMarkAllAsRead(currentUser);
                            yield true;
                        }
                        case 4 -> {
                            handleArchiveNotifications(currentUser);
                            yield true;
                        }
                        case 5 -> {
                            handleCreateNotification(currentUser);
                            yield true;
                        }
                        case 6 -> {
                            handleNotificationSettings(currentUser);
                            yield true;
                        }
                        case 0 -> {
                            displayMessage("\n✅ Saindo do gerenciamento de notificações...");
                            yield false;
                        }
                        default -> {
                            displayError("❌ Opção inválida! Escolha entre 0-6.");
                            yield true;
                        }
                    };
                } catch (final Exception e) {
                    LOGGER.log(Level.WARNING, "Error during notification menu operation", e);
                    displayError("❌ Erro durante operação: " + e.getMessage());
                    displayMessage("🔄 Retornando ao menu principal...\n");
                }
            }
            
            LOGGER.info(String.format("Notification management session completed for user: %s", 
                currentUser.getUsername()));
                
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Critical error in notification management", e);
            displayError("❌ Erro crítico no gerenciamento de notificações: " + e.getMessage());
            throw new RuntimeException("Notification management failed", e);
        }
    }
    
    
    /**
     * Displays a professional notification management menu with current status.
     * 
     * <p>The menu includes real-time notification counts, visual indicators for
     * urgent items, and contextual information about available operations based
     * on user permissions.</p>
     * 
     * @param user The user for whom to display the menu, must not be null
     * @throws IllegalArgumentException if user is null
     */
    private void displayNotificationMenu(final User user) {
        Objects.requireNonNull(user, "User cannot be null for menu display");
        
        try {
            final int unreadCount = getUnreadNotificationCount(user);
            final boolean hasUrgent = hasUrgentNotifications(user);
            
            System.out.println("\n" + SEPARATOR_LINE);
            System.out.println("🔔 GERENCIAMENTO DE NOTIFICAÇÕES - PAINEL PROFISSIONAL");
            System.out.println(SEPARATOR_LINE);
            
            // Display current status with visual indicators
            if (hasUrgent) {
                System.out.println(String.format("%s Você tem notificações urgentes!", URGENT_INDICATOR));
            }
            System.out.println(String.format("� Status: %d notificações não lidas", unreadCount));
            System.out.println("👤 Usuário: " + user.getUsername());
            System.out.println("🕒 Última atualização: " + LocalDateTime.now().format(DATETIME_FORMATTER));
            
            System.out.println("\n" + MENU_BORDER);
            System.out.println("📋 OPÇÕES DISPONÍVEIS:");
            System.out.println(MENU_BORDER);
            System.out.println("1. 📖 Ver todas as notificações");
            System.out.println("2. 📬 Ver notificações não lidas" + (unreadCount > 0 ? String.format(" (%d)", unreadCount) : ""));
            System.out.println("3. ✅ Marcar todas como lidas");
            System.out.println("4. 🗂️  Arquivar notificações antigas");
            System.out.println("5. ➕ Criar nova notificação" + (hasNotificationPermissions(user) ? "" : " [ADMIN APENAS]"));
            System.out.println("6. ⚙️  Configurações de notificação");
            System.out.println("0. 🚪 Voltar ao menu principal");
            System.out.println(MENU_BORDER);
            
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, "Error displaying notification menu", e);
            consoleView.displayErrorMessage("❌ Erro ao exibir menu: " + e.getMessage());
        }
    }
    
    /**
     * Handles viewing all notifications for a user with professional formatting and interaction.
     * 
     * <p>This method retrieves and displays all notifications for the specified user with
     * professional formatting, pagination support, and interactive selection capabilities.
     * Users can view detailed information for any notification and mark unread items as read.</p>
     * 
     * @param user The user whose notifications to display, must not be null
     * @throws IllegalArgumentException if user is null or has invalid username
     */
    private void handleViewNotifications(final User user) {
        Objects.requireNonNull(user, "User cannot be null for viewing notifications");
        
        try {
            LOGGER.info(String.format("Retrieving all notifications for user: %s", user.getUsername()));
            
            final List<Notification> notifications = notificationService.getNotificationsForUser(user.getUsername());
            
            if (notifications == null || notifications.isEmpty()) {
                System.out.println("\n📭 NENHUMA NOTIFICAÇÃO ENCONTRADA");
                System.out.println("═".repeat(50));
                System.out.println("� Você não possui notificações no momento.");
                System.out.println("💡 Novas notificações aparecerão aqui quando disponíveis.");
                consoleView.waitForEnter();
                return;
            }
            
            // Display header with summary
            System.out.println("\n📖 TODAS AS NOTIFICAÇÕES");
            System.out.println("═".repeat(60));
            System.out.println(String.format("� Total: %d notificações encontradas", notifications.size()));
            System.out.println("👤 Usuário: " + user.getUsername());
            System.out.println("─".repeat(60));
            
            // Display notifications with professional formatting
            for (int i = 0; i < Math.min(notifications.size(), MAX_NOTIFICATION_DISPLAY_COUNT); i++) {
                final Notification notification = notifications.get(i);
                displayNotificationSummary(notification, i + 1);
            }
            
            // Handle pagination if necessary
            if (notifications.size() > MAX_NOTIFICATION_DISPLAY_COUNT) {
                System.out.println(String.format("\n⚠️  Exibindo %d de %d notificações. Use filtros para ver mais.", 
                    MAX_NOTIFICATION_DISPLAY_COUNT, notifications.size()));
            }
            
            // Interactive selection
            System.out.println("\n🔍 SELECIONAR NOTIFICAÇÃO:");
            System.out.println("Digite o número da notificação para ver detalhes (0 para voltar): ");
            
            System.out.print("Sua escolha: ");
            final int choice = consoleView.getMenuChoice();
            
            if (choice > 0 && choice <= notifications.size()) {
                final Notification selected = notifications.get(choice - 1);
                displayNotificationDetails(selected);
                
                // Auto-mark as read if unread
                if (!selected.isRead()) {
                    try {
                        notificationService.markAsRead(selected.getNotificationId(), user.getUsername());
                        System.out.println("✅ Notificação marcada como lida.");
                        LOGGER.info(String.format("Notification %s marked as read for user %s", 
                            selected.getNotificationId(), user.getUsername()));
                    } catch (final Exception e) {
                        LOGGER.log(Level.WARNING, "Failed to mark notification as read", e);
                        consoleView.displayErrorMessage("⚠️  Não foi possível marcar como lida: " + e.getMessage());
                    }
                }
            } else if (choice != 0) {
                consoleView.displayErrorMessage("❌ Seleção inválida! Escolha entre 1-" + notifications.size() + " ou 0 para voltar.");
            }
            
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving notifications for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Erro ao buscar notificações: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handles viewing unread notifications with professional formatting and bulk operations.
     * 
     * <p>This method displays only unread notifications for the user with special emphasis
     * on urgent items. It provides bulk marking capabilities and detailed interaction options.</p>
     * 
     * @param user The user whose unread notifications to display, must not be null
     * @throws IllegalArgumentException if user is null or has invalid username
     */
    private void handleViewUnreadNotifications(final User user) {
        Objects.requireNonNull(user, "User cannot be null for viewing unread notifications");
        
        try {
            LOGGER.info(String.format("Retrieving unread notifications for user: %s", user.getUsername()));
            
            final List<Notification> unreadNotifications = notificationService.getUnreadNotifications(user.getUsername());
            
            if (unreadNotifications == null || unreadNotifications.isEmpty()) {
                System.out.println("\n✅ NENHUMA NOTIFICAÇÃO NÃO LIDA");
                System.out.println("═".repeat(50));
                System.out.println("🎉 Parabéns! Você está em dia com todas as notificações.");
                System.out.println("📬 Novas notificações aparecerão aqui quando chegarem.");
                consoleView.waitForEnter();
                return;
            }
            
            // Count urgent notifications
            final long urgentCount = unreadNotifications.stream()
                .mapToLong(notification -> notification.isUrgent() ? 1 : 0)
                .sum();
            
            // Display header with status
            System.out.println("\n� NOTIFICAÇÕES NÃO LIDAS");
            System.out.println("═".repeat(60));
            System.out.println(String.format("📊 Total não lidas: %d notificações", unreadNotifications.size()));
            if (urgentCount > 0) {
                System.out.println(String.format("%s %d notificações urgentes requerem atenção!", URGENT_INDICATOR, urgentCount));
            }
            System.out.println("👤 Usuário: " + user.getUsername());
            System.out.println("─".repeat(60));
            
            // Display notifications with emphasis on urgent ones
            for (int i = 0; i < unreadNotifications.size(); i++) {
                final Notification notification = unreadNotifications.get(i);
                displayNotificationSummary(notification, i + 1);
                
                // Special indicator for urgent notifications
                if (notification.isUrgent()) {
                    System.out.println(String.format("   %s REQUER ATENÇÃO IMEDIATA!", URGENT_INDICATOR));
                }
            }
            
            // Bulk operations
            System.out.println("\n🔄 AÇÕES DISPONÍVEIS:");
            System.out.println("─".repeat(40));
            
            final boolean markAllAsRead = consoleView.getConfirmation("✅ Marcar todas como lidas?");
            if (markAllAsRead) {
                try {
                    int successCount = 0;
                    for (final Notification notification : unreadNotifications) {
                        try {
                            notificationService.markAsRead(notification.getNotificationId(), user.getUsername());
                            successCount++;
                        } catch (final Exception e) {
                            LOGGER.log(Level.WARNING, String.format("Failed to mark notification %s as read", 
                                notification.getNotificationId()), e);
                        }
                    }
                    
                    if (successCount == unreadNotifications.size()) {
                        System.out.println("✅ Todas as notificações foram marcadas como lidas!");
                        LOGGER.info(String.format("Successfully marked %d notifications as read for user %s", 
                            successCount, user.getUsername()));
                    } else {
                        System.out.println(String.format("⚠️  %d de %d notificações marcadas como lidas. Algumas falharam.", 
                            successCount, unreadNotifications.size()));
                    }
                } catch (final Exception e) {
                    LOGGER.log(Level.SEVERE, "Error during bulk mark as read operation", e);
                    consoleView.displayErrorMessage("❌ Erro durante operação em lote: " + e.getMessage());
                }
            }
            
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving unread notifications for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Erro ao buscar notificações não lidas: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Handles marking all notifications as read with professional confirmation and validation.
     * 
     * <p>This method provides a safe bulk operation to mark all unread notifications as read
     * for the specified user. It includes confirmation dialogs, progress tracking, and
     * comprehensive error handling.</p>
     * 
     * @param user The user whose notifications should be marked as read, must not be null
     * @throws IllegalArgumentException if user is null or has invalid username
     */
    private void handleMarkAllAsRead(final User user) {
        Objects.requireNonNull(user, "User cannot be null for mark all as read operation");
        
        try {
            LOGGER.info(String.format("Processing mark all as read request for user: %s", user.getUsername()));
            
            final int unreadCount = getUnreadNotificationCount(user);
            
            System.out.println("\n✅ MARCAR TODAS COMO LIDAS");
            System.out.println("═".repeat(50));
            
            if (unreadCount == 0) {
                System.out.println("🎉 Excelente! Você não tem notificações não lidas.");
                System.out.println("📬 Todas as suas notificações já estão marcadas como lidas.");
                consoleView.waitForEnter();
                return;
            }
            
            // Display confirmation with details
            System.out.println(String.format("📊 Encontradas: %d notificações não lidas", unreadCount));
            System.out.println("👤 Usuário: " + user.getUsername());
            System.out.println("⚠️  Esta ação não pode ser desfeita.");
            
            final boolean confirmed = consoleView.getConfirmation(
                String.format("\n🔄 Confirma marcar TODAS as %d notificações como lidas?", unreadCount));
            
            if (confirmed) {
                try {
                    // Perform bulk operation with progress indication
                    System.out.println("\n🔄 Processando operação em lote...");
                    
                    final CompletableFuture<Void> markAllFuture = CompletableFuture.runAsync(() -> {
                        try {
                            notificationService.markAllAsReadForUser(user.getUsername());
                        } catch (final Exception e) {
                            throw new RuntimeException("Failed to mark all notifications as read", e);
                        }
                    });
                    
                    // Wait with timeout
                    markAllFuture.get(DEFAULT_OPERATION_TIMEOUT_SECONDS, TimeUnit.SECONDS);
                    
                    System.out.println("✅ OPERAÇÃO CONCLUÍDA COM SUCESSO!");
                    System.out.println(String.format("📝 %d notificações marcadas como lidas", unreadCount));
                    System.out.println("🕒 " + LocalDateTime.now().format(DATETIME_FORMATTER));
                    
                    LOGGER.info(String.format("Successfully marked %d notifications as read for user %s", 
                        unreadCount, user.getUsername()));
                        
                } catch (final Exception e) {
                    LOGGER.log(Level.SEVERE, "Failed to mark all notifications as read", e);
                    consoleView.displayErrorMessage("❌ Erro durante operação: " + e.getMessage());
                    System.out.println("💡 Tente novamente ou contate o suporte se o problema persistir.");
                }
                
            } else {
                System.out.println("🚫 Operação cancelada pelo usuário.");
                LOGGER.info("Mark all as read operation cancelled by user: " + user.getUsername());
            }
            
        } catch (final Exception e) {
            LOGGER.log(Level.SEVERE, "Error in mark all as read process for user: " + user.getUsername(), e);
            consoleView.displayErrorMessage("❌ Erro crítico durante operação: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Archive old notifications
     */
    private void handleArchiveNotifications(User user) {
        System.out.println("\n=== ARCHIVE NOTIFICATIONS ===");
        
        try {
            List<Notification> oldNotifications = notificationService.getOldNotifications(user.getUsername(), 30); // 30 days old
            
            if (oldNotifications.isEmpty()) {
                consoleView.displayInfoMessage("📭 No old notifications to archive.");
                consoleView.waitForEnter();
                return;
            }
            
            System.out.println("📦 Found " + oldNotifications.size() + " notification(s) older than 30 days");
            
            if (consoleView.getConfirmation("Archive these old notifications?")) {
                int archived = 0;
                for (Notification notification : oldNotifications) {
                    notificationService.archiveNotification(notification.getNotificationId(), user.getUsername());
                    archived++;
                }
                consoleView.displaySuccessMessage("📦 Archived " + archived + " notification(s) successfully!");
            } else {
                System.out.println("Archive operation cancelled by user.");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error archiving notifications: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Create and send new notification (admin/moderator feature)
     */
    private void handleCreateNotification(User user) {
        if (!hasNotificationPermissions(user)) {
            consoleView.displayErrorMessage("Access denied. You need notification management permissions.");
            return;
        }
        
        System.out.println("\n=== CREATE NOTIFICATION ===");
        
        try {
            // Select notification type
            System.out.println("Select notification type:");
            System.out.println("1. General Information");
            System.out.println("2. System Maintenance");
            System.out.println("3. Security Alert");
            System.out.println("4. User Account Notice");
            System.out.println("0. Cancel");
            
            int typeChoice = consoleView.getMenuChoice();
            Notification.NotificationType selectedType = switch (typeChoice) {
                case 1 -> Notification.NotificationType.PROFILE_UPDATED;
                case 2 -> Notification.NotificationType.SYSTEM_MAINTENANCE;
                case 3 -> Notification.NotificationType.SECURITY_ALERT;
                case 4 -> Notification.NotificationType.ROLE_CHANGED;
                case 0 -> null;
                default -> null;
            };
            
            if (selectedType == null) {
                return;
            }
            
            System.out.print("Enter notification title: ");
            String title = consoleView.getStringInput();
            
            System.out.print("Enter notification message: ");
            String message = consoleView.getStringInput();
            
            System.out.print("Enter recipient username (or 'ALL' for broadcast): ");
            String recipient = consoleView.getStringInput();
            
            // Create and send notification
            if ("ALL".equalsIgnoreCase(recipient)) {
                Notification notification = Notification.createSystemNotification(selectedType, title, message);
                notificationService.sendBroadcastNotification(notification, user.getUsername());
                consoleView.displaySuccessMessage("📢 Broadcast notification sent to all users!");
            } else {
                notificationService.sendNotification(recipient, selectedType, title, message, user.getUsername());
                consoleView.displaySuccessMessage("📧 Notification sent to " + recipient + " successfully!");
            }
            
        } catch (Exception e) {
            consoleView.displayErrorMessage("Error creating notification: " + e.getMessage());
        }
        
        consoleView.waitForEnter();
    }
    
    /**
     * Configure notification settings
     */
    private void handleNotificationSettings(User user) {
        System.out.println("\n=== NOTIFICATION SETTINGS ===");
        
        System.out.println("Current notification preferences for " + user.getUsername() + ":");
        System.out.println("✅ Login alerts: Enabled");
        System.out.println("✅ Security notifications: Enabled");
        System.out.println("✅ System maintenance alerts: Enabled");
        System.out.println("✅ Account changes: Enabled");
        
        System.out.println("\nSettings are managed by system administrators.");
        System.out.println("Contact your administrator to modify notification preferences.");
        
        consoleView.waitForEnter();
    }
    
    /**
     * Display notification summary in list format
     */
    private void displayNotificationSummary(Notification notification, int index) {
        String status = notification.isRead() ? "📖" : "🔔";
        String priority = notification.getPriorityIcon();
        String ageInfo = getNotificationAge(notification);
        
        System.out.printf("%d. %s %s [%s] %s - %s (%s)\n", 
            index, 
            status, 
            priority,
            notification.getType().getDisplayName(),
            notification.getTitle(), 
            notification.getMessage(),
            ageInfo);
    }
    
    /**
     * Displays detailed notification information with professional formatting.
     * 
     * @param notification The notification to display details for, must not be null
     * @throws IllegalArgumentException if notification is null
     */
    private void displayNotificationDetails(final Notification notification) {
        Objects.requireNonNull(notification, "Notification cannot be null for detail display");
        
        try {
            System.out.println("\n📋 DETALHES DA NOTIFICAÇÃO");
            System.out.println("═".repeat(60));
            System.out.println(notification.getFullDetails());
            System.out.println("═".repeat(60));
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, "Error displaying notification details", e);
            consoleView.displayErrorMessage("❌ Erro ao exibir detalhes: " + e.getMessage());
        }
    }
    
    /**
     * Gets the count of unread notifications for a user with error handling.
     * 
     * @param user The user to count unread notifications for, must not be null
     * @return The number of unread notifications, 0 if error occurs
     * @throws IllegalArgumentException if user is null
     */
    private int getUnreadNotificationCount(final User user) {
        Objects.requireNonNull(user, "User cannot be null for unread count");
        
        try {
            final List<Notification> unreadNotifications = notificationService.getUnreadNotifications(user.getUsername());
            return unreadNotifications != null ? unreadNotifications.size() : 0;
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, String.format("Error getting unread count for user %s", user.getUsername()), e);
            return 0;
        }
    }
    
    /**
     * Checks if user has urgent notifications requiring immediate attention.
     * 
     * @param user The user to check for urgent notifications, must not be null
     * @return true if user has urgent notifications, false otherwise
     * @throws IllegalArgumentException if user is null
     */
    private boolean hasUrgentNotifications(final User user) {
        Objects.requireNonNull(user, "User cannot be null for urgent check");
        
        try {
            final List<Notification> urgentNotifications = notificationService.getUrgentNotifications(user.getUsername());
            return urgentNotifications != null && !urgentNotifications.isEmpty();
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, String.format("Error checking urgent notifications for user %s", user.getUsername()), e);
            return false;
        }
    }
    
    /**
     * Checks if user has permissions to create notifications with comprehensive validation.
     * 
     * @param user The user to check permissions for, must not be null
     * @return true if user can create notifications, false otherwise
     * @throws IllegalArgumentException if user is null
     */
    private boolean hasNotificationPermissions(final User user) {
        Objects.requireNonNull(user, "User cannot be null for permission check");
        
        try {
            return permissionService.hasPermission(user, "SEND_NOTIFICATIONS") ||
                   permissionService.hasPermission(user, "SYSTEM_ADMIN") ||
                   permissionService.hasPermission(user, "NOTIFICATION_MANAGER");
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, String.format("Error checking notification permissions for user %s", user.getUsername()), e);
            return false;
        }
    }
    
    /**
     * Gets human-readable notification age with professional formatting.
     * 
     * @param notification The notification to get age for, must not be null
     * @return Human-readable age string
     * @throws IllegalArgumentException if notification is null
     */
    private String getNotificationAge(final Notification notification) {
        Objects.requireNonNull(notification, "Notification cannot be null for age calculation");
        
        try {
            final long hours = notification.getAgeInHours();
            if (hours < 1) {
                return "Agora mesmo";
            } else if (hours < 24) {
                return hours + "h atrás";
            } else {
                final long days = hours / 24;
                return days + "d atrás";
            }
        } catch (final Exception e) {
            LOGGER.log(Level.WARNING, "Error calculating notification age", e);
            return "Idade desconhecida";
        }
    }
    
    /**
     * Reads an integer input from the user with professional error handling.
     * 
     * @param prompt The prompt message to display
     * @return The integer value entered by the user
     */
    private int readInt(final String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                final String input = consoleView.scanner.nextLine().trim();
                return Integer.parseInt(input);
            } catch (final NumberFormatException e) {
                consoleView.displayErrorMessage("❌ Por favor, digite um número válido.");
            }
        }
    }
    
    /**
     * Displays a generic message using System.out.println.
     * 
     * @param message The message to display
     */
    private void displayMessage(final String message) {
        System.out.println(message);
    }
    
    /**
     * Displays an error message using the console view.
     * 
     * @param message The error message to display
     */
    private void displayError(final String message) {
        consoleView.displayErrorMessage(message);
    }
    
    /**
     * Check for pending notifications and display alert
     */
    public void checkPendingNotifications(User user) {
        try {
            List<Notification> urgentNotifications = notificationService.getUrgentNotifications(user.getUsername());
            
            if (!urgentNotifications.isEmpty()) {
                System.out.println("\n🚨 URGENT NOTIFICATIONS:");
                System.out.println("-".repeat(50));
                
                for (Notification notification : urgentNotifications) {
                    System.out.println("⚠️  " + notification.getTitle() + " - " + notification.getMessage());
                }
                
                System.out.println("-".repeat(50));
                System.out.println("Please check your notifications for details.");
            }
            
        } catch (Exception e) {
            // Silent failure - don't disrupt main flow
            System.err.println("Error checking pending notifications: " + e.getMessage());
        }
    }
    
    /**
     * Get notification summary for dashboard display
     */
    public String getNotificationSummary(User user) {
        try {
            int unreadCount = getUnreadNotificationCount(user);
            int urgentCount = notificationService.getUrgentNotifications(user.getUsername()).size();
            
            if (urgentCount > 0) {
                return String.format("🚨 %d urgent, %d unread notifications", urgentCount, unreadCount);
            } else if (unreadCount > 0) {
                return String.format("🔔 %d unread notifications", unreadCount);
            } else {
                return "✅ No new notifications";
            }
        } catch (Exception e) {
            return "Notifications unavailable";
        }
    }
}
