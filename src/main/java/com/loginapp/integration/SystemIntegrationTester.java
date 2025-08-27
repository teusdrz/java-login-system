package com.loginapp.integration;

import com.loginapp.api.dto.ApiResponse;
import com.loginapp.api.dto.UserDto;
import com.loginapp.model.Role;
import com.loginapp.model.User;
import com.loginapp.model.UserDatabase;
import com.loginapp.security.SecurityConfiguration;
import com.loginapp.services.AuditService;
import com.loginapp.services.PermissionService;
import java.util.Map;

/**
 * SystemIntegrationTester - Tests full system integration including new features
 */
public class SystemIntegrationTester {
    
    private static final String ANSI_RESET = "\u001B[0m";
    private static final String ANSI_GREEN = "\u001B[32m";
    private static final String ANSI_RED = "\u001B[31m";
    private static final String ANSI_YELLOW = "\u001B[33m";
    private static final String ANSI_BLUE = "\u001B[34m";
    private static final String ANSI_CYAN = "\u001B[36m";
    
    private int testsRun = 0;
    private int testsPassed = 0;
    private int testsFailed = 0;
    
    public static void main(String[] args) {
        SystemIntegrationTester tester = new SystemIntegrationTester();
        tester.runIntegrationTests();
    }
    
    public void runIntegrationTests() {
        printHeader("🔗 SYSTEM INTEGRATION TESTS");
        
        System.out.println("Testing integration between all system components:");
        System.out.println("• Authentication with new Security features");
        System.out.println("• API DTOs with business logic");
        System.out.println("• Audit Service with all controllers");
        System.out.println("• Permission System integration");
        System.out.println();
        
        // Test core integrations
        testDatabaseAndUserManagement();
        testAuthenticationWithSecurity();
        testPermissionSystemIntegration();
        testAuditServiceIntegration();
        testApiDtoIntegration();
        testSecurityFeatureIntegration();
        
        printSummary();
    }
    
    private void testDatabaseAndUserManagement() {
        printTestGroup("Database & User Management Integration");
        
        try {
            UserDatabase db = new UserDatabase();
            assertNotNull("Database instance should be available", db);
            
            // Test default users
            User admin = db.getUserByUsername("admin");
            assertNotNull("Admin user should exist", admin);
            assertEquals("Admin role should be correct", Role.ADMIN, admin.getRole());
            
            User moderator = db.getUserByUsername("moderator");
            assertNotNull("Moderator user should exist", moderator);
            assertEquals("Moderator role should be correct", Role.MODERATOR, moderator.getRole());
            
            User testUser = db.getUserByUsername("testuser");
            assertNotNull("Test user should exist", testUser);
            assertEquals("Test user role should be correct", Role.USER, testUser.getRole());
            
            // Test database statistics
            UserDatabase.SystemStats stats = db.getSystemStats();
            assertNotNull("System stats should be available", stats);
            assertTrue("User count should be positive", stats.getTotalUsers() > 0);
            assertTrue("Active user count should be positive", stats.getActiveUsers() > 0);
            
        } catch (Exception e) {
            testFailed("Database integration test failed: " + e.getMessage());
        }
    }
    
    private void testAuthenticationWithSecurity() {
        printTestGroup("Authentication with Security Integration");
        
        try {
            SecurityConfiguration security = SecurityConfiguration.getInstance();
            assertNotNull("Security configuration should be available", security);
            
            // Test password hashing integration
            String testPassword = "testPassword123";
            String hashedPassword = security.hashPassword(testPassword);
            assertNotNull("Password should be hashed", hashedPassword);
            assertFalse("Hash should not be empty", hashedPassword.trim().isEmpty());
            
            // Test password validation
            SecurityConfiguration.ValidationResult validation = security.validatePassword(testPassword);
            assertTrue("Valid password should pass validation", validation.isValid());
            
            SecurityConfiguration.ValidationResult weakValidation = security.validatePassword("123");
            assertFalse("Weak password should fail validation", weakValidation.isValid());
            
            // Test account locking mechanism
            String testUsername = "locktest_integration";
            assertFalse("Account should not be locked initially", security.isAccountLocked(testUsername));
            
            // Simulate failed attempts
            for (int i = 0; i < 5; i++) {
                security.recordFailedAttempt(testUsername);
            }
            assertTrue("Account should be locked after 5 failed attempts", security.isAccountLocked(testUsername));
            
            // Test session management
            UserDatabase db = new UserDatabase();
            User testUser = db.getUserByUsername("testuser");
            String sessionId = security.createSession(testUser);
            assertNotNull("Session should be created", sessionId);
            
            SecurityConfiguration.SecuritySession session = security.validateSession(sessionId);
            assertNotNull("Session should be valid", session);
            assertEquals("Session user should match", testUser.getUsername(), session.getUser().getUsername());
            
        } catch (Exception e) {
            testFailed("Authentication security integration test failed: " + e.getMessage());
        }
    }
    
    private void testPermissionSystemIntegration() {
        printTestGroup("Permission System Integration");
        
        try {
            PermissionService permissionService = PermissionService.getInstance();
            UserDatabase db = new UserDatabase();
            
            User admin = db.getUserByUsername("admin");
            User moderator = db.getUserByUsername("moderator");
            User regularUser = db.getUserByUsername("testuser");
            
            // Test admin permissions
            assertTrue("Admin should have user management permission", 
                      permissionService.hasPermission(admin, "USER_MANAGEMENT"));
            assertTrue("Admin should have system settings permission", 
                      permissionService.hasPermission(admin, "SYSTEM_SETTINGS"));
            assertTrue("Admin should have backup system permission", 
                      permissionService.hasPermission(admin, "BACKUP_SYSTEM"));
            
            // Test moderator permissions
            assertTrue("Moderator should have user management permission", 
                      permissionService.hasPermission(moderator, "USER_MANAGEMENT"));
            assertFalse("Moderator should not have system settings permission", 
                       permissionService.hasPermission(moderator, "SYSTEM_SETTINGS"));
            
            // Test regular user permissions
            assertFalse("Regular user should not have user management permission", 
                       permissionService.hasPermission(regularUser, "USER_MANAGEMENT"));
            assertFalse("Regular user should not have system settings permission", 
                       permissionService.hasPermission(regularUser, "SYSTEM_SETTINGS"));
            assertTrue("Regular user should have view profile permission", 
                      permissionService.hasPermission(regularUser, "VIEW_PROFILE"));
            
        } catch (Exception e) {
            testFailed("Permission system integration test failed: " + e.getMessage());
        }
    }
    
    private void testAuditServiceIntegration() {
        printTestGroup("Audit Service Integration");
        
        try {
            AuditService auditService = AuditService.getInstance();
            assertNotNull("Audit service should be available", auditService);
            
            // Test audit statistics before operations
            Map<String, Object> initialStats = auditService.getAuditStatistics();
            int initialEntries = (Integer) initialStats.get("totalEntries");
            
            // Perform operations that should generate audit entries
            
            // Test authentication auditing
            String authAuditId = auditService.logAuthentication("testuser", true, "127.0.0.1", "Integration Test");
            assertNotNull("Authentication audit should be logged", authAuditId);
            
            // Test authorization auditing
            String authzAuditId = auditService.logAuthorization("testuser", "PROFILE_ACCESS", true, "/profile");
            assertNotNull("Authorization audit should be logged", authzAuditId);
            
            // Test backup operation auditing
            String backupAuditId = auditService.logBackupOperation("admin", 
                com.loginapp.model.AuditAction.BACKUP_CREATED, "test-backup-001", true, "Test backup");
            assertNotNull("Backup operation audit should be logged", backupAuditId);
            
            // Verify audit entries were created
            Map<String, Object> finalStats = auditService.getAuditStatistics();
            int finalEntries = (Integer) finalStats.get("totalEntries");
            assertTrue("New audit entries should be created", finalEntries > initialEntries);
            
            // Test audit retrieval
            var userAudits = auditService.getAuditByUser("testuser");
            assertNotNull("User audits should be retrievable", userAudits);
            
            var recentActivities = auditService.getRecentActivities(10);
            assertNotNull("Recent activities should be retrievable", recentActivities);
            
        } catch (Exception e) {
            testFailed("Audit service integration test failed: " + e.getMessage());
        }
    }
    
    private void testApiDtoIntegration() {
        printTestGroup("API DTO Integration");
        
        try {
            UserDatabase db = new UserDatabase();
            User admin = db.getUserByUsername("admin");
            
            // Test UserDto creation and integration
            UserDto adminDto = new UserDto(admin);
            assertNotNull("Admin DTO should be created", adminDto);
            assertEquals("Admin DTO username should match", "admin", adminDto.getUsername());
            assertEquals("Admin DTO role should match", Role.ADMIN, adminDto.getRole());
            assertNotNull("Admin DTO permissions should be available", adminDto.getPermissions());
            
            // Test different DTO factory methods
            UserDto publicProfile = UserDto.publicProfile(admin);
            assertNotNull("Public profile DTO should be created", publicProfile);
            assertEquals("Public profile username should match", "admin", publicProfile.getUsername());
            
            UserDto adminView = UserDto.adminView(admin);
            assertNotNull("Admin view DTO should be created", adminView);
            assertEquals("Admin view username should match", "admin", adminView.getUsername());
            
            // Test ApiResponse integration
            ApiResponse<UserDto> successResponse = ApiResponse.success(adminDto, "User retrieved successfully");
            assertTrue("API response should be successful", successResponse.isSuccess());
            assertNotNull("API response should contain user data", successResponse.getData());
            assertEquals("API response data should match", adminDto.getUsername(), 
                        successResponse.getData().getUsername());
            
            // Test error responses
            ApiResponse<UserDto> notFoundResponse = ApiResponse.notFound("User");
            assertFalse("Not found response should not be successful", notFoundResponse.isSuccess());
            assertEquals("Not found error code should be correct", "NOT_FOUND", notFoundResponse.getErrorCode());
            
            // Test fluent interface
            ApiResponse<UserDto> fluentResponse = ApiResponse.success(adminDto)
                .withRequestId("req-integration-test")
                .addMetadata("source", "integration-test");
            
            assertNotNull("Fluent response should have request ID", fluentResponse.getRequestId());
            assertNotNull("Fluent response should have metadata", fluentResponse.getMetadata());
            assertEquals("Metadata source should be set", "integration-test", 
                        fluentResponse.getMetadata().get("source"));
            
        } catch (Exception e) {
            testFailed("API DTO integration test failed: " + e.getMessage());
        }
    }
    
    private void testSecurityFeatureIntegration() {
        printTestGroup("Security Feature Integration");
        
        try {
            SecurityConfiguration security = SecurityConfiguration.getInstance();
            AuditService auditService = AuditService.getInstance();
            
            // Test security statistics integration
            Map<String, Object> securityStats = security.getSecurityStatistics();
            assertNotNull("Security statistics should be available", securityStats);
            assertTrue("Security stats should contain active sessions", securityStats.containsKey("activeSessions"));
            assertTrue("Security stats should contain locked accounts", securityStats.containsKey("lockedAccounts"));
            
            // Test audit and security integration
            Map<String, Object> auditStats = auditService.getAuditStatistics();
            assertNotNull("Audit statistics should be available", auditStats);
            
            // Test security incident logging
            String incidentId = auditService.logSecurityIncident("testuser", "Integration Test Incident", 
                com.loginapp.model.AuditLevel.WARNING, "Test security incident for integration", 
                Map.of("testType", "integration", "automated", true));
            assertNotNull("Security incident should be logged", incidentId);
            
            // Test permission validation with security
            UserDatabase db = new UserDatabase();
            User admin = db.getUserByUsername("admin");
            
            assertTrue("Admin should have high-level resource access", 
                      security.canAccessResource(admin, 3));
            assertTrue("Admin should have medium-level resource access", 
                      security.canAccessResource(admin, 2));
            assertTrue("Admin should have basic resource access", 
                      security.canAccessResource(admin, 1));
            
            User regularUser = db.getUserByUsername("testuser");
            assertTrue("Regular user should have basic resource access", 
                      security.canAccessResource(regularUser, 1));
            assertFalse("Regular user should not have admin resource access", 
                       security.canAccessResource(regularUser, 3));
            
        } catch (Exception e) {
            testFailed("Security feature integration test failed: " + e.getMessage());
        }
    }
    
    // Test utility methods
    private void assertTrue(String message, boolean condition) {
        testsRun++;
        if (condition) {
            testsPassed++;
            System.out.println(ANSI_GREEN + "  ✓ " + message + ANSI_RESET);
        } else {
            testsFailed++;
            System.out.println(ANSI_RED + "  ✗ " + message + ANSI_RESET);
        }
    }
    
    private void assertFalse(String message, boolean condition) {
        assertTrue(message, !condition);
    }
    
    private void assertNotNull(String message, Object object) {
        assertTrue(message, object != null);
    }
    
    private void assertEquals(String message, Object expected, Object actual) {
        boolean equal = (expected == null && actual == null) || 
                       (expected != null && expected.equals(actual));
        assertTrue(message + " (expected: " + expected + ", actual: " + actual + ")", equal);
    }
    
    private void testFailed(String message) {
        testsRun++;
        testsFailed++;
        System.out.println(ANSI_RED + "  ✗ " + message + ANSI_RESET);
    }
    
    private void printHeader(String title) {
        System.out.println("\n" + ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
        System.out.println(ANSI_CYAN + "  " + title + ANSI_RESET);
        System.out.println(ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
    }
    
    private void printTestGroup(String groupName) {
        System.out.println("\n" + ANSI_BLUE + "🔗 " + groupName + ANSI_RESET);
        System.out.println(ANSI_BLUE + "─".repeat(groupName.length() + 4) + ANSI_RESET);
    }
    
    private void printSummary() {
        System.out.println("\n" + ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
        System.out.println(ANSI_CYAN + "  INTEGRATION TEST SUMMARY" + ANSI_RESET);
        System.out.println(ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
        
        System.out.println("Integration Tests Run: " + testsRun);
        System.out.println(ANSI_GREEN + "Tests Passed: " + testsPassed + ANSI_RESET);
        
        if (testsFailed > 0) {
            System.out.println(ANSI_RED + "Tests Failed: " + testsFailed + ANSI_RESET);
        } else {
            System.out.println(ANSI_GREEN + "Tests Failed: " + testsFailed + ANSI_RESET);
        }
        
        double successRate = testsRun > 0 ? (double) testsPassed / testsRun * 100 : 0;
        System.out.println("Success Rate: " + String.format("%.1f%%", successRate));
        
        if (testsFailed == 0) {
            System.out.println(ANSI_GREEN + "\n🎉 ALL INTEGRATION TESTS PASSED! 🎉" + ANSI_RESET);
            System.out.println(ANSI_GREEN + "✓ API layer fully integrated with business logic" + ANSI_RESET);
            System.out.println(ANSI_GREEN + "✓ Security configuration working with authentication" + ANSI_RESET);
            System.out.println(ANSI_GREEN + "✓ Audit service integrated across all components" + ANSI_RESET);
            System.out.println(ANSI_GREEN + "✓ Permission system enforced system-wide" + ANSI_RESET);
            System.out.println(ANSI_GREEN + "\n🚀 SYSTEM IS PRODUCTION READY! 🚀" + ANSI_RESET);
        } else {
            System.out.println(ANSI_YELLOW + "\n⚠️  INTEGRATION ISSUES DETECTED - REVIEW REQUIRED" + ANSI_RESET);
        }
        
        System.out.println(ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
    }
}
