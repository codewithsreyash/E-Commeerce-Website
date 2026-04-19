package com.shopping.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.sql.Timestamp;
public class Customer {
    private Long customerId; private String firstName; private String lastName;
    private String email; @JsonIgnore private String passwordHash; private String phone;
    private String address; private Timestamp createdAt;
    public Customer() {}
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long id) { this.customerId = id; }
    public String getFirstName() { return firstName; } public void setFirstName(String f) { this.firstName = f; }
    public String getLastName() { return lastName; } public void setLastName(String l) { this.lastName = l; }
    public String getEmail() { return email; } public void setEmail(String e) { this.email = e; }
    public String getPasswordHash() { return passwordHash; } public void setPasswordHash(String p) { this.passwordHash = p; }
    public String getPhone() { return phone; } public void setPhone(String p) { this.phone = p; }
    public String getAddress() { return address; } public void setAddress(String a) { this.address = a; }
    public Timestamp getCreatedAt() { return createdAt; } public void setCreatedAt(Timestamp c) { this.createdAt = c; }
}
