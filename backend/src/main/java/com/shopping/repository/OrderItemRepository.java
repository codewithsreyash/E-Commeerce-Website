package com.shopping.repository;
import com.shopping.model.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class OrderItemRepository {
    private final JdbcTemplate jdbcTemplate;
    public OrderItemRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }
    private final RowMapper<OrderItem> rowMapper = (rs, rowNum) -> {
        OrderItem oi = new OrderItem();
        oi.setOrderItemId(rs.getLong("order_item_id")); oi.setOrderId(rs.getLong("order_id"));
        oi.setProductId(rs.getLong("product_id")); oi.setQuantity(rs.getInt("quantity"));
        oi.setPrice(rs.getDouble("price"));
        return oi;
    };
    public List<OrderItem> findByOrderId(Long id) { 
        return jdbcTemplate.query("SELECT * FROM order_items WHERE order_id = ?", rowMapper, id);
    }
    public int save(OrderItem oi) {
        return jdbcTemplate.update("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            oi.getOrderId(), oi.getProductId(), oi.getQuantity(), oi.getPrice());
    }
}
