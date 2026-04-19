package com.shopping.model;
import java.sql.Timestamp;
public class Order {
    private Long orderId; private Long customerId; private Double totalAmount;
    private String status; private Timestamp createdAt;
    public Order() {}
    public Long getOrderId() { return orderId; } public void setOrderId(Long id) { this.orderId = id; }
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long id) { this.customerId = id; }
    public Double getTotalAmount() { return totalAmount; } public void setTotalAmount(Double t) { this.totalAmount = t; }
    public String getStatus() { return status; } public void setStatus(String s) { this.status = s; }
    public Timestamp getCreatedAt() { return createdAt; } public void setCreatedAt(Timestamp c) { this.createdAt = c; }
}
