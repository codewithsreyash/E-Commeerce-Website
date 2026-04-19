package com.shopping.model;
import java.sql.Timestamp;
public class Product {
    private Long productId; private Long sellerId; private String name;
    private String description; private Double price; private Integer stock;
    private String category; private String imageUrl; private Timestamp createdAt;
    public Product() {}
    public Long getProductId() { return productId; } public void setProductId(Long id) { this.productId = id; }
    public Long getSellerId() { return sellerId; } public void setSellerId(Long id) { this.sellerId = id; }
    public String getName() { return name; } public void setName(String n) { this.name = n; }
    public String getDescription() { return description; } public void setDescription(String d) { this.description = d; }
    public Double getPrice() { return price; } public void setPrice(Double p) { this.price = p; }
    public Integer getStock() { return stock; } public void setStock(Integer s) { this.stock = s; }
    public String getCategory() { return category; } public void setCategory(String c) { this.category = c; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String img) { this.imageUrl = img; }
    public Timestamp getCreatedAt() { return createdAt; } public void setCreatedAt(Timestamp c) { this.createdAt = c; }
}
