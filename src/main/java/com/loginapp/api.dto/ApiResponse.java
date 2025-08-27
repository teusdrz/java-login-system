package com.loginapp.api.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * ApiResponse class - Standardized response format for all API endpoints
 * Provides consistent structure for success and error responses
 */
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private Map<String, Object> metadata;
    private String errorCode;
    private LocalDateTime timestamp;
    private String requestId;
    
    // Private constructor to enforce builder pattern
    private ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Success response builders
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.data = data;
        response.message = "Operation completed successfully";
        return response;
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.data = data;
        response.message = message;
        return response;
    }
    
    public static <T> ApiResponse<T> success(T data, String message, Map<String, Object> metadata) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.data = data;
        response.message = message;
        response.metadata = metadata;
        return response;
    }
    
    // Error response builders
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        return response;
    }
    
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.errorCode = errorCode;
        return response;
    }
    
    public static <T> ApiResponse<T> error(String message, String errorCode, Map<String, Object> metadata) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.errorCode = errorCode;
        response.metadata = metadata;
        return response;
    }
    
    // Validation error response
    public static <T> ApiResponse<T> validationError(Map<String, String> validationErrors) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = "Validation failed";
        response.errorCode = "VALIDATION_ERROR";
        response.metadata = Map.of("validationErrors", validationErrors);
        return response;
    }
    
    // Authentication error responses
    public static <T> ApiResponse<T> unauthorized() {
        return unauthorized("Authentication required");
    }
    
    public static <T> ApiResponse<T> unauthorized(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.errorCode = "UNAUTHORIZED";
        return response;
    }
    
    // Authorization error responses
    public static <T> ApiResponse<T> forbidden() {
        return forbidden("Access denied");
    }
    
    public static <T> ApiResponse<T> forbidden(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.errorCode = "FORBIDDEN";
        return response;
    }
    
    // Resource not found responses
    public static <T> ApiResponse<T> notFound(String resource) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = resource + " not found";
        response.errorCode = "NOT_FOUND";
        return response;
    }
    
    // Server error responses
    public static <T> ApiResponse<T> serverError() {
        return serverError("Internal server error occurred");
    }
    
    public static <T> ApiResponse<T> serverError(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.errorCode = "INTERNAL_ERROR";
        return response;
    }
    
    // Fluent interface for additional properties
    public ApiResponse<T> withRequestId(String requestId) {
        this.requestId = requestId;
        return this;
    }
    
    public ApiResponse<T> withMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
        return this;
    }
    
    public ApiResponse<T> addMetadata(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new java.util.HashMap<>();
        }
        this.metadata.put(key, value);
        return this;
    }
    
    // Getters
    public boolean isSuccess() {
        return success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public T getData() {
        return data;
    }
    
    public Map<String, Object> getMetadata() {
        return metadata;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public String getRequestId() {
        return requestId;
    }
    
    // Convert to JSON-like string representation
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ApiResponse{");
        sb.append("success=").append(success);
        sb.append(", message='").append(message).append('\'');
        if (data != null) {
            sb.append(", data=").append(data);
        }
        if (errorCode != null) {
            sb.append(", errorCode='").append(errorCode).append('\'');
        }
        if (metadata != null && !metadata.isEmpty()) {
            sb.append(", metadata=").append(metadata);
        }
        sb.append(", timestamp=").append(timestamp);
        if (requestId != null) {
            sb.append(", requestId='").append(requestId).append('\'');
        }
        sb.append('}');
        return sb.toString();
    }
}