package com.shopping.repository;

import com.shopping.dto.CustomerOrderDto;
import com.shopping.model.OrderItem;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerOrderRepository {
    private final JdbcTemplate jdbcTemplate;

    public CustomerOrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CustomerOrderDto> orderRowMapper = (rs, rowNum) -> {
        CustomerOrderDto order = new CustomerOrderDto();
        order.setOrderId(rs.getLong("order_id"));
        order.setCustomerId(rs.getLong("customer_id"));
        order.setTotalAmount(rs.getDouble("total_amount"));
        order.setStatus(rs.getString("status"));
        order.setCreatedAt(rs.getTimestamp("created_at"));
        return order;
    };

    private final RowMapper<OrderItem> orderItemRowMapper = (rs, rowNum) -> {
        OrderItem item = new OrderItem();
        item.setOrderItemId(rs.getLong("order_item_id"));
        item.setOrderId(rs.getLong("order_id"));
        item.setProductId(rs.getLong("product_id"));
        item.setQuantity(rs.getInt("quantity"));
        item.setPrice(rs.getDouble("price"));
        return item;
    };

    public List<CustomerOrderDto> findOrdersByUsername(String username) {
        // Primary: join orders -> customers via email = username
        String orderSql = "SELECT o.* FROM orders o " +
            "JOIN customers c ON o.customer_id = c.customer_id " +
            "WHERE c.email = ? ORDER BY o.created_at DESC";
        List<CustomerOrderDto> orders = jdbcTemplate.query(orderSql, orderRowMapper, username);

        if (!orders.isEmpty()) {
            for (CustomerOrderDto order : orders) {
                List<OrderItem> items = jdbcTemplate.query(
                    "SELECT * FROM order_items WHERE order_id = ?", orderItemRowMapper, order.getOrderId());
                order.setItems(items);
            }
        }
        return orders;
    }
}
