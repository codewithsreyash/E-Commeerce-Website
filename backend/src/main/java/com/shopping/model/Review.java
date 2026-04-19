package com.shopping.model;
import java.sql.Timestamp;
public class Review {
    private Long reviewId; private Long productId; private Long customerId;
    private Integer rating; private String comment; private Timestamp createdAt;
    public Review() {}
    public Long getReviewId() { return reviewId; } public void setReviewId(Long id) { this.reviewId = id; }
    public Long getProductId() { return productId; } public void setProductId(Long id) { this.productId = id; }
    public Long getCustomerId() { return customerId; } public void setCustomerId(Long id) { this.customerId = id; }
    public Integer getRating() { return rating; } public void setRating(Integer r) { this.rating = r; }
    public String getComment() { return comment; } public void setComment(String c) { this.comment = c; }
    public Timestamp getCreatedAt() { return createdAt; } public void setCreatedAt(Timestamp c) { this.createdAt = c; }
}
