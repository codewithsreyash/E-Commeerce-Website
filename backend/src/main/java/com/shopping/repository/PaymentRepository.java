package com.shopping.repository;
import com.shopping.model.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PaymentRepository {
    private final JdbcTemplate jdbcTemplate;
    public PaymentRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }
    private final RowMapper<Payment> rowMapper = (rs, rowNum) -> {
        Payment p = new Payment();
        p.setPaymentId(rs.getLong("payment_id")); p.setOrderId(rs.getLong("order_id"));
        p.setAmount(rs.getDouble("amount")); p.setPaymentMethod(rs.getString("payment_method"));
        p.setStatus(rs.getString("status")); p.setPaymentDate(rs.getTimestamp("payment_date"));
        return p;
    };
    public Payment findByOrderId(Long id) { 
        List<Payment> l = jdbcTemplate.query("SELECT * FROM payments WHERE order_id = ?", rowMapper, id);
        return l.isEmpty() ? null : l.get(0); 
    }
    public int save(Payment p) {
        return jdbcTemplate.update("INSERT INTO payments (order_id, amount, payment_method, status) VALUES (?, ?, ?, ?)",
            p.getOrderId(), p.getAmount(), p.getPaymentMethod(), p.getStatus());
    }
}
