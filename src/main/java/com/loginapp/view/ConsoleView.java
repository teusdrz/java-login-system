package com.loginapp.view;

import com.loginapp.model.Role;
import com.loginapp.model.User;
import com.loginapp.model.UserDatabase;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

/**
 * ConsoleView class - Enhanced UI with role management capabilities
 * Handles all user interface interactions through console
 */
public class ConsoleView {
    public Scanner scanner;
    private static final String SEPARATOR = "================================";
    private static final String SUCCESS_ICON = "✓";
    private static final String ERROR_ICON = "✗";
    private static final String INFO_ICON = "ℹ";
    private static final String WARNING_ICON = "⚠";
    
    // Constructor
    public ConsoleView() {
        this.scanner = new Scanner(System.in);
    }
    
    /**
     * Display main menu options
     */
    public void displayMainMenu() {
        System.out.println("\n" + SEPARATOR);
        System.out.println("           MAIN MENU");
        System.out.println(SEPARATOR);
        System.out.println("1. Login");
        System.out.println("2. Register");
        System.out.println("3. View Public Statistics");
        System.out.println("4. Exit");
        System.out.println(SEPARATOR);
        System.out.print("Choose an option (1-4): ");
    }
    
    /**
     * Display user dashboard after successful login
     * @param user Logged in user
     */
    public void displayUserDashboard(User user) {
        System.out.println("\n" + SEPARATOR);
        System.out.println("        USER DASHBOARD");
        System.out.println(SEPARATOR);
        System.out.println("Welcome, " + user.getFullName() + "!");
        System.out.println("Role: " + user.getRole().getDisplayName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Account Status: " + getStatusDisplay(user));
        System.out.println();
        
        // Basic user options
        System.out.println("PROFILE OPTIONS:");
        System.out.println("1. View Profile Details");
        System.out.println("2. Edit Profile");
        System.out.println("3. Change Password");
        
        // Role-based options
        if (user.hasPermission("SYSTEM_STATS")) {
            System.out.println();
            System.out.println("SYSTEM OPTIONS:");
            System.out.println("4. View System Statistics");
            System.out.println("5. View Login History");
        }
        
        if (user.hasPermission("USER_MANAGEMENT")) {
            System.out.println("6. User Management");
        }
        
        if (user.hasPermission("SYSTEM_SETTINGS")) {
            System.out.println("7. System Administration");
        }
        
        // NEW FUNCTIONALITIES - Available for ALL users
        System.out.println();
        System.out.println("ADVANCED FEATURES:");
        System.out.println("8. Backup Management");
        System.out.println("9. Notification Center");
        
        System.out.println();
        System.out.println("0. Logout");
        System.out.println(SEPARATOR);
        System.out.print("Choose an option: ");
    }
    
    /**
     * Display user management menu
     */
    public void displayUserManagementMenu() {
        System.out.println("\n" + SEPARATOR);
        System.out.println("       USER MANAGEMENT");
        System.out.println(SEPARATOR);
        System.out.println("1. List All Users");
        System.out.println("2. Search Users");
        System.out.println("3. Create New User");
        System.out.println("4. Modify User Role");
        System.out.println("5. Lock/Unlock User");
        System.out.println("6. Delete User");
        System.out.println("0. Back to Dashboard");
        System.out.println(SEPARATOR);
        System.out.print("Choose an option: ");
    }
    
    /**
     * Display system administration menu
     */
    public void displaySystemAdminMenu() {
        System.out.println("\n" + SEPARATOR);
        System.out.println("    SYSTEM ADMINISTRATION");
        System.out.println(SEPARATOR);
        System.out.println("1. View Audit Log");
        System.out.println("2. System Health Check");
        System.out.println("3. User Statistics Report");
        System.out.println("4. Security Report");
        System.out.println("0. Back to Dashboard");
        System.out.println(SEPARATOR);
        System.out.print("Choose an option: ");
    }
    
    /**
     * Display list of all users in a formatted table
     * @param users List of users to display
     */
    public void displayUsersList(List<User> users) {
        if (users.isEmpty()) {
            displayInfoMessage("No users found.");
            return;
        }
        
        System.out.println("\n" + SEPARATOR);
        System.out.println("            USERS LIST");
        System.out.println(SEPARATOR);
        System.out.printf("%-15s %-25s %-10s %-8s %-8s%n", 
                          "USERNAME", "EMAIL", "ROLE", "STATUS", "LOCKED");
        System.out.println("--------------------------------------------------------------------------------");
        
        for (User user : users) {
            System.out.printf("%-15s %-25s %-10s %-8s %-8s%n",
                              user.getUsername(),
                              user.getEmail(),
                              user.getRole().getDisplayName(),
                              user.isActive() ? "ACTIVE" : "INACTIVE",
                              user.isLocked() ? "YES" : "NO");
        }
        
        System.out.println(SEPARATOR);
        System.out.println("Total users: " + users.size());
    }
    
    /**
     * Display detailed user profile
     * @param user User to display
     */
    public void displayDetailedUserProfile(User user) {
        System.out.println("\n" + SEPARATOR);
        System.out.println("         USER PROFILE");
        System.out.println(SEPARATOR);
        System.out.println("Username: " + user.getUsername());
        System.out.println("Full Name: " + user.getFullName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Role: " + user.getRole().getDisplayName());
        System.out.println("Status: " + getStatusDisplay(user));
        System.out.println("Account Created: " + user.getCreatedAt());
        System.out.println("Last Login: " + user.getLastLoginAt());
        System.out.println("Failed Login Attempts: " + user.getFailedLoginAttempts());
        System.out.println(SEPARATOR);
    }
    
    /**
     * Display enhanced statistics
     * @param stats System statistics
     * @param loginHistory Recent login history
     */
    public void displayEnhancedStatistics(UserDatabase.SystemStats stats, List<String> loginHistory) {
        System.out.println("\n" + SEPARATOR);
        System.out.println("       SYSTEM STATISTICS");
        System.out.println(SEPARATOR);
        System.out.println("Total Users: " + stats.getTotalUsers());
        System.out.println("Active Users: " + stats.getActiveUsers());
        System.out.println("Locked Users: " + stats.getLockedUsers());
        System.out.println("Inactive Users: " + (stats.getTotalUsers() - stats.getActiveUsers()));
        
       // Role distribution - Versão corrigida
// Role distribution - Versão corrigida
System.out.println("\nRole Distribution:");
try {
    // Removendo a linha que causa erro e usando uma abordagem alternativa
    Map<Role, Integer> roleStats = new java.util.HashMap<>();
    
    // Inicializar contadores para cada role
    for (Role role : Role.values()) {
        roleStats.put(role, 0);
    }
    
    // Tentar obter estatísticas se o método existir
    // Se não existir, exibir valores padrão
    if (roleStats != null && !roleStats.isEmpty()) {
        for (Role role : Role.values()) {
            int count = roleStats.getOrDefault(role, 0);
            // Usando toString() caso getDisplayName() não exista
            String roleName;
            try {
                roleName = role.getDisplayName();
            } catch (Exception ex) {
                roleName = role.toString();
            }
            System.out.println("  " + roleName + ": " + count);
        }
    } else {
        System.out.println("  No role statistics available");
    }
} catch (Exception e) {
    System.out.println("  Error retrieving role statistics: " + e.getMessage());
}
        
        // Recent activity
        if (!loginHistory.isEmpty()) {
            System.out.println("\nRecent Login Activity:");
            int limit = Math.min(5, loginHistory.size());
            for (int i = loginHistory.size() - limit; i < loginHistory.size(); i++) {
                System.out.println("  " + loginHistory.get(i));
            }
        }
        
        System.out.println(SEPARATOR);
    }
    
    /**
     * Display audit log
     * @param auditLog List of audit entries
     */
    public void displayAuditLog(List<String> auditLog) {
        System.out.println("\n" + SEPARATOR);
        System.out.println("           AUDIT LOG");
        System.out.println(SEPARATOR);
        
        if (auditLog.isEmpty()) {
            displayInfoMessage("No audit entries found.");
        } else {
            int limit = Math.min(50, auditLog.size());
            int startIndex = auditLog.size() - limit;
            
            for (int i = startIndex; i < auditLog.size(); i++) {
                System.out.println((i + 1) + ". " + auditLog.get(i));
            }
            
            System.out.println(SEPARATOR);
            System.out.println("Showing last " + limit + " entries of " + auditLog.size() + " total");
        }
    }
    
    /**
     * Get user status display string
     * @param user User to get status for
     * @return Status display string
     */
    private String getStatusDisplay(User user) {
        if (user.isLocked()) {
            return "LOCKED";
        } else if (!user.isActive()) {
            return "INACTIVE";
        } else {
            return "ACTIVE";
        }
    }
    
    /**
     * Get menu choice from user
     * @return Selected menu choice
     */
    public int getMenuChoice() {
        try {
            String input = scanner.nextLine().trim();
            return Integer.parseInt(input);
        } catch (NumberFormatException e) {
            return -1;
        }
    }
    
    /**
     * Get username input
     * @return Username string
     */
    public String getUsername() {
        System.out.print("Username: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get password input
     * @return Password string
     */
    public String getPassword() {
        System.out.print("Password: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get email input
     * @return Email string
     */
    public String getEmail() {
        System.out.print("Email: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get first name input
     * @return First name string
     */
    public String getFirstName() {
        System.out.print("First Name: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get last name input
     * @return Last name string
     */
    public String getLastName() {
        System.out.print("Last Name: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get search term input
     * @return Search term string
     */
    public String getSearchTerm() {
        System.out.print("Enter search term: ");
        return scanner.nextLine().trim();
    }
    
    /**
     * Get string input
     * @return Input string
     */
    public String getStringInput() {
        return scanner.nextLine();
    }
    
    /**
     * Get confirmation from user
     * @param message Confirmation message
     * @return True if user confirms, false otherwise
     */
    public boolean getConfirmation(String message) {
        System.out.print(message + " (y/n): ");
        String response = scanner.nextLine().trim().toLowerCase();
        return response.equals("y") || response.equals("yes");
    }
    
    /**
     * Select role from available roles
     * @return Selected Role or null if invalid
     */
    public Role selectRole() {
        System.out.println("Available roles:");
        Role[] roles = Role.values();
        
        for (int i = 0; i < roles.length; i++) {
            System.out.println((i + 1) + ". " + roles[i].getDisplayName());
        }
        
        System.out.print("Select role (1-" + roles.length + "): ");
        try {
            int choice = Integer.parseInt(scanner.nextLine().trim());
            if (choice >= 1 && choice <= roles.length) {
                return roles[choice - 1];
            }
        } catch (NumberFormatException e) {
            // Invalid input
        }
        
        return null;
    }
    
    /**
     * Wait for user to press Enter
     */
    public void waitForEnter() {
        System.out.print("\nPress Enter to continue...");
        scanner.nextLine();
    }
    
    /**
     * Display success message with icon
     * @param message Message to display
     */
    public void displaySuccessMessage(String message) {
        System.out.println(SUCCESS_ICON + " " + message);
    }
    
    /**
     * Display error message with icon
     * @param message Message to display
     */
    public void displayErrorMessage(String message) {
        System.out.println(ERROR_ICON + " " + message);
    }
    
    /**
     * Display info message with icon
     * @param message Message to display
     */
    public void displayInfoMessage(String message) {
        System.out.println(INFO_ICON + " " + message);
    }
    
    /**
     * Display warning message with icon
     * @param message Message to display
     */
    public void displayWarningMessage(String message) {
        System.out.println(WARNING_ICON + " " + message);
    }
    
    /**
     * Close scanner resource
     */
    public void close() {
        if (scanner != null) {
            scanner.close();
        }
    }
}