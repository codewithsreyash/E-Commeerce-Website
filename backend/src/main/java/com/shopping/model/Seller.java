package com.shopping.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.sql.Timestamp;
public class Seller {
    private Long sellerId; private String companyName; private String email;
    @JsonIgnore private String passwordHash; private String phone; private Timestamp createdAt;
    public Seller() {}
    public Long getSellerId() { return sellerId; } public void setSellerId(Long id) { this.sellerId = id; }
    public String getCompanyName() { return companyName; } public void setCompanyName(String c) { this.companyName = c; }
    public String getEmail() { return email; } public void setEmail(String e) { this.email = e; }
    public String getPasswordHash() { return passwordHash; } public void setPasswordHash(String p) { this.passwordHash = p; }
    public String getPhone() { return phone; } public void setPhone(String p) { this.phone = p; }
    public Timestamp getCreatedAt() { return createdAt; } public void setCreatedAt(Timestamp c) { this.createdAt = c; }
}
