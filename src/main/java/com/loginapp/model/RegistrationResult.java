package com.loginapp.model;

/**
 * RegistrationResult class - Encapsulates registration operation results
 * Provides structured feedback for user registration attempts
 */
public class RegistrationResult {
    private final boolean success;
    private final String message;

    /**
     * Constructor for RegistrationResult
     * @param success Whether the registration was successful
     * @param message Descriptive message about the operation result
     */
    public RegistrationResult(boolean success, String message) {
        this.success = success;
        this.message = message != null ? message : "";
    }

    /**
     * Check if registration was successful
     * @return true if successful, false otherwise
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Get result message
     * @return Descriptive message about the operation
     */
    public String getMessage() {
        return message;
    }

    /**
     * Create a successful registration result
     * @param message Success message
     * @return RegistrationResult indicating success
     */
    public static RegistrationResult success(String message) {
        return new RegistrationResult(true, message);
    }

    /**
     * Create a failed registration result
     * @param message Error message
     * @return RegistrationResult indicating failure
     */
    public static RegistrationResult failure(String message) {
        return new RegistrationResult(false, message);
    }

    @Override
    public String toString() {
        return "RegistrationResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}