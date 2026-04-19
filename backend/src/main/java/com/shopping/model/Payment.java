package com.shopping.model;
import java.sql.Timestamp;
public class Payment {
    private Long paymentId; private Long orderId; private Double amount;
    private String paymentMethod; private String status; private Timestamp paymentDate;
    public Payment() {}
    public Long getPaymentId() { return paymentId; } public void setPaymentId(Long id) { this.paymentId = id; }
    public Long getOrderId() { return orderId; } public void setOrderId(Long id) { this.orderId = id; }
    public Double getAmount() { return amount; } public void setAmount(Double a) { this.amount = a; }
    public String getPaymentMethod() { return paymentMethod; } public void setPaymentMethod(String p) { this.paymentMethod = p; }
    public String getStatus() { return status; } public void setStatus(String s) { this.status = s; }
    public Timestamp getPaymentDate() { return paymentDate; } public void setPaymentDate(Timestamp d) { this.paymentDate = d; }
}
