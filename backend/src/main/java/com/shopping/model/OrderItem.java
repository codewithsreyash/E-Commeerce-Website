package com.shopping.model;
public class OrderItem {
    private Long orderItemId; private Long orderId; private Long productId;
    private Integer quantity; private Double price;
    public OrderItem() {}
    public Long getOrderItemId() { return orderItemId; } public void setOrderItemId(Long id) { this.orderItemId = id; }
    public Long getOrderId() { return orderId; } public void setOrderId(Long id) { this.orderId = id; }
    public Long getProductId() { return productId; } public void setProductId(Long id) { this.productId = id; }
    public Integer getQuantity() { return quantity; } public void setQuantity(Integer q) { this.quantity = q; }
    public Double getPrice() { return price; } public void setPrice(Double p) { this.price = p; }
}
