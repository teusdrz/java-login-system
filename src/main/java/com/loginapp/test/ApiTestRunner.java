package com.loginapp.test;

import com.loginapp.api.dto.ApiResponse;
import com.loginapp.api.dto.UserDto;
import com.loginapp.model.User;
import com.loginapp.model.Role;
import com.loginapp.model.AuditEntry;
import com.loginapp.model.AuditAction;
import com.loginapp.model.AuditLevel;
import com.loginapp.services.AuditService;
import com.loginapp.security.SecurityConfiguration;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

/**
 * ApiTestRunner - Comprehensive test suite for API components, Audit system, and Security
 */
public class ApiTestRunner {
    
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
        ApiTestRunner runner = new ApiTestRunner();
        runner.runAllTests();
    }
    
    public void runAllTests() {
        printHeader("🚀 ENTERPRISE API & SECURITY TEST SUITE");
        
        System.out.println("═══════════════════════════════════════════════════════════════");
        System.out.println("Running comprehensive tests for:");
        System.out.println("• API Response DTOs");
        System.out.println("• User DTOs and mappings");  
        System.out.println("• Audit Service functionality");
        System.out.println("• Security Configuration");
        System.out.println("═══════════════════════════════════════════════════════════════");
        System.out.println();
        
        // Test API Response DTOs
        testApiResponseSuccess();
        testApiResponseError();
        testApiResponseValidation();
        testApiResponseChaining();
        
        // Test User DTOs
        testUserDtoCreation();
        testUserDtoFactoryMethods();
        testUserDtoPermissions();
        
        // Test Audit Service
        testAuditServiceSingleton();
        testAuditLogging();
        testAuditRetrieval();
        testSecurityAuditing();
        
        // Test Security Configuration
        testSecuritySingleton();
        testPasswordHashing();
        testPasswordValidation();
        testAccountLocking();
        testSessionManagement();
        testPermissionChecking();
        
        printSummary();
    }
    
    // ═══════════════════════════════════════════════════════════════
    // API RESPONSE DTO TESTS
    // ═══════════════════════════════════════════════════════════════
    
    private void testApiResponseSuccess() {
        printTestGroup("API Response - Success Cases");
        
        // Test basic success response
        ApiResponse<String> response1 = ApiResponse.success("Test data");
        assertTrue("Success response should be successful", response1.isSuccess());
        assertEquals("Success response should contain data", "Test data", response1.getData());
        assertNotNull("Success response should have timestamp", response1.getTimestamp());
        
        // Test success with message
        ApiResponse<Integer> response2 = ApiResponse.success(42, "Custom success message");
        assertTrue("Success with message should be successful", response2.isSuccess());
        assertEquals("Custom message should be set", "Custom success message", response2.getMessage());
        assertEquals("Data should match", Integer.valueOf(42), response2.getData());
        
        // Test success with metadata
        Map<String, Object> metadata = Map.of("version", "1.0", "processed", true);
        ApiResponse<String> response3 = ApiResponse.success("data", "Success with metadata", metadata);
        assertTrue("Success with metadata should be successful", response3.isSuccess());
        assertNotNull("Metadata should be present", response3.getMetadata());
        assertEquals("Metadata should contain version", "1.0", response3.getMetadata().get("version"));
    }
    
    private void testApiResponseError() {
        printTestGroup("API Response - Error Cases");
        
        // Test basic error response
        ApiResponse<String> errorResponse1 = ApiResponse.error("Something went wrong");
        assertFalse("Error response should not be successful", errorResponse1.isSuccess());
        assertEquals("Error message should be set", "Something went wrong", errorResponse1.getMessage());
        assertNull("Error response should have no data", errorResponse1.getData());
        
        // Test error with code
        ApiResponse<String> errorResponse2 = ApiResponse.error("Validation failed", "VALIDATION_ERROR");
        assertFalse("Error with code should not be successful", errorResponse2.isSuccess());
        assertEquals("Error code should be set", "VALIDATION_ERROR", errorResponse2.getErrorCode());
        
        // Test specific error types
        ApiResponse<String> unauthorizedResponse = ApiResponse.unauthorized("Authentication required");
        assertEquals("Unauthorized error code should be set", "UNAUTHORIZED", unauthorizedResponse.getErrorCode());
        
        ApiResponse<String> forbiddenResponse = ApiResponse.forbidden("Access denied");
        assertEquals("Forbidden error code should be set", "FORBIDDEN", forbiddenResponse.getErrorCode());
        
        ApiResponse<String> notFoundResponse = ApiResponse.notFound("User");
        assertEquals("Not found error code should be set", "NOT_FOUND", notFoundResponse.getErrorCode());
        assertTrue("Not found message should contain resource", notFoundResponse.getMessage().contains("User"));
    }
    
    private void testApiResponseValidation() {
        printTestGroup("API Response - Validation");
        
        Map<String, String> validationErrors = Map.of(
            "username", "Username is required",
            "email", "Invalid email format"
        );
        
        ApiResponse<String> validationResponse = ApiResponse.validationError(validationErrors);
        assertFalse("Validation error should not be successful", validationResponse.isSuccess());
        assertEquals("Validation error code should be set", "VALIDATION_ERROR", validationResponse.getErrorCode());
        assertEquals("Validation message should be standard", "Validation failed", validationResponse.getMessage());
        assertNotNull("Validation metadata should be present", validationResponse.getMetadata());
        assertTrue("Validation errors should be in metadata", 
                  validationResponse.getMetadata().containsKey("validationErrors"));
    }
    
    private void testApiResponseChaining() {
        printTestGroup("API Response - Fluent Interface");
        
        ApiResponse<String> response = ApiResponse.success("test data")
            .withRequestId("req-123")
            .addMetadata("userId", "user-456")
            .addMetadata("timestamp", LocalDateTime.now());
        
        assertEquals("Request ID should be set", "req-123", response.getRequestId());
        assertNotNull("Metadata should be present", response.getMetadata());
        assertEquals("User ID metadata should be set", "user-456", response.getMetadata().get("userId"));
        assertTrue("Timestamp metadata should be present", response.getMetadata().containsKey("timestamp"));
    }
    
    // ═══════════════════════════════════════════════════════════════
    // USER DTO TESTS
    // ═══════════════════════════════════════════════════════════════
    
    private void testUserDtoCreation() {
        printTestGroup("User DTO - Creation");
        
        // Create test user
        User testUser = new User("testuser", "password123", "test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(Role.USER);
        
        // Test DTO creation from User
        UserDto userDto = new UserDto(testUser);
        assertEquals("Username should match", "testuser", userDto.getUsername());
        assertEquals("Email should match", "test@example.com", userDto.getEmail());
        assertEquals("First name should match", "John", userDto.getFirstName());
        assertEquals("Last name should match", "Doe", userDto.getLastName());
        assertEquals("Role should match", Role.USER, userDto.getRole());
        assertNotNull("Full name should be set", userDto.getFullName());
    }
    
    private void testUserDtoFactoryMethods() {
        printTestGroup("User DTO - Factory Methods");
        
        User testUser = new User("admin", "admin123", "admin@example.com");
        testUser.setFirstName("Admin");
        testUser.setLastName("User");
        testUser.setRole(Role.ADMIN);
        
        // Test fromUser factory method
        UserDto fromUserDto = UserDto.fromUser(testUser);
        assertNotNull("FromUser DTO should be created", fromUserDto);
        assertEquals("Username should match", "admin", fromUserDto.getUsername());
        
        // Test publicProfile factory method
        UserDto publicDto = UserDto.publicProfile(testUser);
        assertNotNull("Public profile DTO should be created", publicDto);
        assertEquals("Public username should match", "admin", publicDto.getUsername());
        // Note: publicProfile typically excludes sensitive information
        
        // Test adminView factory method
        UserDto adminDto = UserDto.adminView(testUser);
        assertNotNull("Admin view DTO should be created", adminDto);
        assertEquals("Admin view username should match", "admin", adminDto.getUsername());
        // Admin view should include additional statistics
    }
    
    private void testUserDtoPermissions() {
        printTestGroup("User DTO - Permissions");
        
        User adminUser = new User("admin", "admin123", "admin@example.com");
        adminUser.setRole(Role.ADMIN);
        
        UserDto adminDto = new UserDto(adminUser);
        assertEquals("Admin role should match", Role.ADMIN, adminDto.getRole());
        assertEquals("Admin display name should be correct", "Administrator", adminDto.getRoleDisplayName());
        
        // Test permission checking (this requires Role to have getPermissions method)
        assertNotNull("Permissions should be available", adminDto.getPermissions());
    }
    
    // ═══════════════════════════════════════════════════════════════
    // AUDIT SERVICE TESTS
    // ═══════════════════════════════════════════════════════════════
    
    private void testAuditServiceSingleton() {
        printTestGroup("Audit Service - Singleton Pattern");
        
        AuditService service1 = AuditService.getInstance();
        AuditService service2 = AuditService.getInstance();
        
        assertNotNull("Audit service instance should not be null", service1);
        assertTrue("Audit service should be singleton", service1 == service2);
    }
    
    private void testAuditLogging() {
        printTestGroup("Audit Service - Logging");
        
        AuditService auditService = AuditService.getInstance();
        
        // Test basic activity logging
        Map<String, Object> details = Map.of("ipAddress", "192.168.1.1", "userAgent", "TestAgent");
        String auditId = auditService.logActivity(
            AuditAction.LOGIN_SUCCESS,
            AuditLevel.INFO,
            "testuser",
            "User logged in successfully",
            details
        );
        
        assertNotNull("Audit ID should be generated", auditId);
        assertFalse("Audit ID should not be empty", auditId.trim().isEmpty());
        
        // Test authentication logging
        String authAuditId = auditService.logAuthentication("testuser", true, "192.168.1.1", "TestAgent");
        assertNotNull("Authentication audit ID should be generated", authAuditId);
        
        // Test failed authentication
        String failedAuthId = auditService.logAuthentication("testuser", false, "192.168.1.1", "TestAgent");
        assertNotNull("Failed authentication audit ID should be generated", failedAuthId);
        
        // Test authorization logging
        String authzId = auditService.logAuthorization("testuser", "USER_MANAGEMENT", true, "/users/create");
        assertNotNull("Authorization audit ID should be generated", authzId);
    }
    
    private void testAuditRetrieval() {
        printTestGroup("Audit Service - Data Retrieval");
        
        AuditService auditService = AuditService.getInstance();
        
        // Log some test entries
        auditService.logActivity(AuditAction.USER_CREATED, AuditLevel.INFO, "admin", "User created", Map.of());
        auditService.logActivity(AuditAction.LOGIN_FAILED, AuditLevel.WARNING, "testuser", "Failed login", Map.of());
        
        // Test retrieval by user
        List<AuditEntry> userAudits = auditService.getAuditByUser("admin");
        assertNotNull("User audits should not be null", userAudits);
        
        // Test retrieval by action
        List<AuditEntry> loginFailures = auditService.getAuditByAction(AuditAction.LOGIN_FAILED);
        assertNotNull("Login failure audits should not be null", loginFailures);
        
        // Test retrieval by level
        List<AuditEntry> warnings = auditService.getAuditByLevel(AuditLevel.WARNING);
        assertNotNull("Warning level audits should not be null", warnings);
        
        // Test recent activities
        List<AuditEntry> recent = auditService.getRecentActivities(10);
        assertNotNull("Recent activities should not be null", recent);
        assertTrue("Recent activities should have reasonable limit", recent.size() <= 10);
        
        // Test security alerts
        List<AuditEntry> alerts = auditService.getSecurityAlerts();
        assertNotNull("Security alerts should not be null", alerts);
        
        // Test audit statistics
        Map<String, Object> stats = auditService.getAuditStatistics();
        assertNotNull("Audit statistics should not be null", stats);
        assertTrue("Statistics should contain total entries", stats.containsKey("totalEntries"));
        assertTrue("Statistics should contain unique users", stats.containsKey("uniqueUsers"));
    }
    
    private void testSecurityAuditing() {
        printTestGroup("Audit Service - Security Features");
        
        AuditService auditService = AuditService.getInstance();
        
        // Test security incident logging
        Map<String, Object> evidence = Map.of("suspiciousPattern", "Multiple rapid requests", "severity", "HIGH");
        String incidentId = auditService.logSecurityIncident(
            "testuser",
            "Brute Force Attack",
            AuditLevel.CRITICAL,
            "Multiple failed login attempts detected",
            evidence
        );
        
        assertNotNull("Security incident ID should be generated", incidentId);
        
        // Test backup operation logging
        String backupId = auditService.logBackupOperation(
            "admin",
            AuditAction.BACKUP_CREATED,
            "backup-001",
            true,
            "Full system backup completed successfully"
        );
        
        assertNotNull("Backup operation audit ID should be generated", backupId);
        
        // Test failed login count
        LocalDateTime since = LocalDateTime.now().minusHours(1);
        long failedCount = auditService.getFailedLoginCount("testuser", since);
        assertTrue("Failed login count should be non-negative", failedCount >= 0);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // SECURITY CONFIGURATION TESTS
    // ═══════════════════════════════════════════════════════════════
    
    private void testSecuritySingleton() {
        printTestGroup("Security Configuration - Singleton Pattern");
        
        SecurityConfiguration config1 = SecurityConfiguration.getInstance();
        SecurityConfiguration config2 = SecurityConfiguration.getInstance();
        
        assertNotNull("Security configuration instance should not be null", config1);
        assertTrue("Security configuration should be singleton", config1 == config2);
    }
    
    private void testPasswordHashing() {
        printTestGroup("Security Configuration - Password Hashing");
        
        SecurityConfiguration security = SecurityConfiguration.getInstance();
        
        String password = "testPassword123";
        String hash1 = security.hashPassword(password);
        String hash2 = security.hashPassword(password);
        
        assertNotNull("Password hash should not be null", hash1);
        assertFalse("Password hash should not be empty", hash1.trim().isEmpty());
        assertEquals("Same password should produce same hash", hash1, hash2);
        
        String differentPassword = "differentPassword456";
        String differentHash = security.hashPassword(differentPassword);
        assertFalse("Different passwords should produce different hashes", hash1.equals(differentHash));
    }
    
    private void testPasswordValidation() {
        printTestGroup("Security Configuration - Password Validation");
        
        SecurityConfiguration security = SecurityConfiguration.getInstance();
        
        // Test valid password
        SecurityConfiguration.ValidationResult validResult = security.validatePassword("password123");
        assertTrue("Valid password should pass validation", validResult.isValid());
        
        // Test too short password
        SecurityConfiguration.ValidationResult shortResult = security.validatePassword("abc");
        assertFalse("Too short password should fail validation", shortResult.isValid());
        assertTrue("Short password message should mention length", 
                  shortResult.getMessage().toLowerCase().contains("characters"));
        
        // Test empty password
        SecurityConfiguration.ValidationResult emptyResult = security.validatePassword("");
        assertFalse("Empty password should fail validation", emptyResult.isValid());
        
        // Test null password
        SecurityConfiguration.ValidationResult nullResult = security.validatePassword(null);
        assertFalse("Null password should fail validation", nullResult.isValid());
        
        // Test too long password
        String longPassword = "a".repeat(100);
        SecurityConfiguration.ValidationResult longResult = security.validatePassword(longPassword);
        assertFalse("Too long password should fail validation", longResult.isValid());
    }
    
    private void testAccountLocking() {
        printTestGroup("Security Configuration - Account Locking");
        
        SecurityConfiguration security = SecurityConfiguration.getInstance();
        String testUsername = "locktest_" + System.currentTimeMillis();
        
        // Initially account should not be locked
        assertFalse("Account should not be locked initially", security.isAccountLocked(testUsername));
        
        // Record multiple failed attempts
        for (int i = 0; i < 5; i++) {
            security.recordFailedAttempt(testUsername);
        }
        
        // Account should now be locked
        assertTrue("Account should be locked after failed attempts", security.isAccountLocked(testUsername));
        
        // Clear failed attempts
        security.clearFailedAttempts(testUsername);
        assertFalse("Account should be unlocked after clearing attempts", security.isAccountLocked(testUsername));
    }
    
    private void testSessionManagement() {
        printTestGroup("Security Configuration - Session Management");
        
        SecurityConfiguration security = SecurityConfiguration.getInstance();
        
        // Create test user
        User testUser = new User("sessiontest", "password123", "session@test.com");
        testUser.setRole(Role.USER);
        
        // Create session
        String sessionId = security.createSession(testUser);
        assertNotNull("Session ID should be generated", sessionId);
        assertFalse("Session ID should not be empty", sessionId.trim().isEmpty());
        
        // Validate session
        SecurityConfiguration.SecuritySession session = security.validateSession(sessionId);
        assertNotNull("Session should be valid", session);
        assertEquals("Session user should match", testUser.getUsername(), session.getUser().getUsername());
        
        // Invalidate session
        security.invalidateSession(sessionId);
        SecurityConfiguration.SecuritySession invalidSession = security.validateSession(sessionId);
        assertNull("Session should be invalid after invalidation", invalidSession);
    }
    
    private void testPermissionChecking() {
        printTestGroup("Security Configuration - Permission Checking");
        
        SecurityConfiguration security = SecurityConfiguration.getInstance();
        
        // Create users with different roles
        User adminUser = new User("admin", "admin123", "admin@test.com");
        adminUser.setRole(Role.ADMIN);
        
        User regularUser = new User("user", "user123", "user@test.com");
        regularUser.setRole(Role.USER);
        
        // Test admin permissions
        assertTrue("Admin should have high-level access", security.canAccessResource(adminUser, 1));
        assertTrue("Admin should have medium-level access", security.canAccessResource(adminUser, 2));
        assertTrue("Admin should have admin-level access", security.canAccessResource(adminUser, 3));
        
        // Test regular user permissions
        assertTrue("User should have basic access", security.canAccessResource(regularUser, 1));
        assertFalse("User should not have admin access", security.canAccessResource(regularUser, 3));
        
        // Test null user
        assertFalse("Null user should have no access", security.canAccessResource(null, 1));
    }
    
    // ═══════════════════════════════════════════════════════════════
    // TEST UTILITIES
    // ═══════════════════════════════════════════════════════════════
    
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
    
    private void assertNull(String message, Object object) {
        assertTrue(message, object == null);
    }
    
    private void assertEquals(String message, Object expected, Object actual) {
        boolean equal = (expected == null && actual == null) || 
                       (expected != null && expected.equals(actual));
        assertTrue(message + " (expected: " + expected + ", actual: " + actual + ")", equal);
    }
    
    private void printHeader(String title) {
        System.out.println("\n" + ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
        System.out.println(ANSI_CYAN + "  " + title + ANSI_RESET);
        System.out.println(ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
    }
    
    private void printTestGroup(String groupName) {
        System.out.println("\n" + ANSI_BLUE + "🔍 " + groupName + ANSI_RESET);
        System.out.println(ANSI_BLUE + "─".repeat(groupName.length() + 4) + ANSI_RESET);
    }
    
    private void printSummary() {
        System.out.println("\n" + ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
        System.out.println(ANSI_CYAN + "  TEST EXECUTION SUMMARY" + ANSI_RESET);
        System.out.println(ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
        
        System.out.println("Total Tests Run: " + testsRun);
        System.out.println(ANSI_GREEN + "Tests Passed: " + testsPassed + ANSI_RESET);
        
        if (testsFailed > 0) {
            System.out.println(ANSI_RED + "Tests Failed: " + testsFailed + ANSI_RESET);
        } else {
            System.out.println(ANSI_GREEN + "Tests Failed: " + testsFailed + ANSI_RESET);
        }
        
        double successRate = testsRun > 0 ? (double) testsPassed / testsRun * 100 : 0;
        System.out.println("Success Rate: " + String.format("%.1f%%", successRate));
        
        if (testsFailed == 0) {
            System.out.println(ANSI_GREEN + "\n🎉 ALL TESTS PASSED! SYSTEM IS READY FOR PRODUCTION! 🎉" + ANSI_RESET);
        } else {
            System.out.println(ANSI_YELLOW + "\n⚠️  SOME TESTS FAILED - REVIEW REQUIRED" + ANSI_RESET);
        }
        
        System.out.println(ANSI_CYAN + "═".repeat(80) + ANSI_RESET);
    }
}
