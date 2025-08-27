package com.loginapp.api.dto;

/**
 * PasswordChangeDto - Password change request DTO
 */
public class PasswordChangeDto {
    private String currentPassword;
    private String newPassword;
    private String confirmNewPassword;

    // Constructors
    public PasswordChangeDto() {}

    public PasswordChangeDto(String currentPassword, String newPassword, String confirmNewPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmNewPassword = confirmNewPassword;
    }

    // Getters and Setters
    public String getCurrentPassword() {
        return currentPassword;
    }
    
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }
    
    public void setConfirmNewPassword(String confirmNewPassword) {
        this.confirmNewPassword = confirmNewPassword;
    }
}
