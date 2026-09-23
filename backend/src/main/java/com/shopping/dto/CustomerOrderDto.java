package com.shopping.dto;

import java.sql.Timestamp;
import java.util.List;

public class CustomerOrderDto {
    private Long orderId;
    private Long customerId;
    private Double totalAmount;
    private String status;
    private Timestamp createdAt;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;
    private List<OrderDetailDto.OrderItemDetail> items;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long v) { this.orderId = v; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long v) { this.customerId = v; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double v) { this.totalAmount = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp v) { this.createdAt = v; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String v) { this.customerEmail = v; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String v) { this.customerPhone = v; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String v) { this.deliveryAddress = v; }
    public List<OrderDetailDto.OrderItemDetail> getItems() { return items; }
    public void setItems(List<OrderDetailDto.OrderItemDetail> v) { this.items = v; }
}
