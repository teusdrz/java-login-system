package com.loginapp.api.dto;

import java.util.Set;

/**
 * UserUpdateDto - User update request DTO
 */
public class UserUpdateDto {
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
    private boolean active;

    // Constructors
    public UserUpdateDto() {}

    public UserUpdateDto(String email, String firstName, String lastName, Set<String> roles, boolean active) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
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

    public Set<String> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
}
