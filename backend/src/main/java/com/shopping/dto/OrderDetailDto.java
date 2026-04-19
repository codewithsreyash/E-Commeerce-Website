package com.shopping.dto;

import java.sql.Timestamp;
import java.util.List;

public class OrderDetailDto {
    private Long orderId;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;
    private Double totalAmount;
    private String status;
    private Timestamp createdAt;
    private List<OrderItemDetail> items;

    public static class OrderItemDetail {
        private Long orderItemId;
        private Long productId;
        private String productName;
        private String productCategory;
        private String productImageUrl;
        private Integer quantity;
        private Double price;

        public Long getOrderItemId() { return orderItemId; }
        public void setOrderItemId(Long v) { this.orderItemId = v; }
        public Long getProductId() { return productId; }
        public void setProductId(Long v) { this.productId = v; }
        public String getProductName() { return productName; }
        public void setProductName(String v) { this.productName = v; }
        public String getProductCategory() { return productCategory; }
        public void setProductCategory(String v) { this.productCategory = v; }
        public String getProductImageUrl() { return productImageUrl; }
        public void setProductImageUrl(String v) { this.productImageUrl = v; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer v) { this.quantity = v; }
        public Double getPrice() { return price; }
        public void setPrice(Double v) { this.price = v; }
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long v) { this.orderId = v; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long v) { this.customerId = v; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String v) { this.customerEmail = v; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String v) { this.customerPhone = v; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String v) { this.deliveryAddress = v; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double v) { this.totalAmount = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp v) { this.createdAt = v; }
    public List<OrderItemDetail> getItems() { return items; }
    public void setItems(List<OrderItemDetail> v) { this.items = v; }
}
