package com.loginapp.services;

import com.loginapp.model.User;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * JWT Service for handling JSON Web Token operations
 * Implements a simple JWT-like token system for authentication
 */
public class JwtService {
    
    private static final String SECRET_KEY = "mySecretKeyForJavaLoginSystem2025!@#";
    private static final long EXPIRATION_TIME = 3600; // 1 hour in seconds
    private static final Map<String, TokenInfo> activeTokens = new ConcurrentHashMap<>();
    
    /**
     * Generate a JWT token for the given user
     * @param user User to generate token for
     * @return JWT token string
     */
    public static String generateToken(User user) {
        try {
            // Create header
            String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            
            // Create payload with user information
            long expirationTime = System.currentTimeMillis() / 1000 + EXPIRATION_TIME;
            String payload = String.format(
                "{\"sub\":\"%s\",\"username\":\"%s\",\"role\":\"%s\",\"email\":\"%s\",\"exp\":%d,\"iat\":%d}",
                user.getUserId(),
                user.getUsername(),
                user.getRole().name(),
                user.getEmail() != null ? user.getEmail() : "",
                expirationTime,
                System.currentTimeMillis() / 1000
            );
            
            // Encode header and payload
            String encodedHeader = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(header.getBytes(StandardCharsets.UTF_8));
            String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
            
            // Create signature
            String headerPayload = encodedHeader + "." + encodedPayload;
            String signature = createSignature(headerPayload);
            
            // Combine all parts
            String token = headerPayload + "." + signature;
            
            // Store token information
            activeTokens.put(token, new TokenInfo(user.getUsername(), 
                LocalDateTime.now().plusSeconds(EXPIRATION_TIME)));
            
            // Log token generation
            AuditService.getInstance().logAuthentication(
                user.getUsername(), true, "JWT token generated", 
                "Token expires at: " + LocalDateTime.now().plusSeconds(EXPIRATION_TIME)
            );
            
            return token;
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating JWT token", e);
        }
    }
    
    /**
     * Validate a JWT token
     * @param token Token to validate
     * @return true if token is valid, false otherwise
     */
    public static boolean validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }
        
        try {
            // Check if token exists in active tokens
            TokenInfo tokenInfo = activeTokens.get(token);
            if (tokenInfo == null) {
                return false;
            }
            
            // Check if token is expired
            if (LocalDateTime.now().isAfter(tokenInfo.getExpirationTime())) {
                activeTokens.remove(token);
                return false;
            }
            
            // Validate token structure and signature
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }
            
            // Verify signature
            String headerPayload = parts[0] + "." + parts[1];
            String expectedSignature = createSignature(headerPayload);
            
            return expectedSignature.equals(parts[2]);
            
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Extract username from JWT token
     * @param token JWT token
     * @return username if token is valid, null otherwise
     */
    public static String getUsernameFromToken(String token) {
        if (!validateToken(token)) {
            return null;
        }
        
        TokenInfo tokenInfo = activeTokens.get(token);
        return tokenInfo != null ? tokenInfo.getUsername() : null;
    }
    
    /**
     * Extract user information from JWT token
     * @param token JWT token
     * @return Map with user information, null if token invalid
     */
    public static Map<String, String> getUserInfoFromToken(String token) {
        if (!validateToken(token)) {
            return null;
        }
        
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            
            // Simple JSON parsing (in production, use a proper JSON library)
            Map<String, String> userInfo = new HashMap<>();
            String[] fields = payload.replace("{", "").replace("}", "").split(",");
            
            for (String field : fields) {
                String[] keyValue = field.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim().replace("\"", "");
                    String value = keyValue[1].trim().replace("\"", "");
                    userInfo.put(key, value);
                }
            }
            
            return userInfo;
            
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * Invalidate a JWT token (logout)
     * @param token Token to invalidate
     */
    public static void invalidateToken(String token) {
        TokenInfo tokenInfo = activeTokens.remove(token);
        if (tokenInfo != null) {
            AuditService.getInstance().logAuthentication(
                tokenInfo.getUsername(), true, "JWT token invalidated (logout)", 
                "Token was active until: " + tokenInfo.getExpirationTime()
            );
        }
    }
    
    /**
     * Get expiration time for a token
     * @param token JWT token
     * @return expiration time, null if token invalid
     */
    public static LocalDateTime getTokenExpiration(String token) {
        TokenInfo tokenInfo = activeTokens.get(token);
        return tokenInfo != null ? tokenInfo.getExpirationTime() : null;
    }
    
    /**
     * Clean up expired tokens
     */
    public static void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        activeTokens.entrySet().removeIf(entry -> 
            now.isAfter(entry.getValue().getExpirationTime())
        );
    }
    
    /**
     * Get count of active tokens
     * @return number of active tokens
     */
    public static int getActiveTokenCount() {
        cleanupExpiredTokens();
        return activeTokens.size();
    }
    
    /**
     * Create HMAC-SHA256 signature
     * @param data Data to sign
     * @return Base64 encoded signature
     */
    private static String createSignature(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String secretData = data + SECRET_KEY;
            byte[] hash = digest.digest(secretData.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error creating signature", e);
        }
    }
    
    /**
     * Inner class to store token information
     */
    private static class TokenInfo {
        private final String username;
        private final LocalDateTime expirationTime;
        
        public TokenInfo(String username, LocalDateTime expirationTime) {
            this.username = username;
            this.expirationTime = expirationTime;
        }
        
        public String getUsername() {
            return username;
        }
        
        public LocalDateTime getExpirationTime() {
            return expirationTime;
        }
    }
}
