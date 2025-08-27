package com.loginapp.api.dto;

import com.loginapp.model.Role;

/**
 * UserUpdateDto - User update request DTO
 */
public class UserUpdateDto {
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Boolean active;

    // Constructors
    public UserUpdateDto() {}

    public UserUpdateDto(String email, String firstName, String lastName, Role role, Boolean active) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.active = active;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean isActive() {
        return active;
    }
    
    public Boolean getIsActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
}
