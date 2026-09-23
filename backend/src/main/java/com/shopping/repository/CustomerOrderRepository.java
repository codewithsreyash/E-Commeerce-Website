package com.shopping.repository;

import com.shopping.dto.CustomerOrderDto;
import com.shopping.dto.OrderDetailDto;
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
        order.setCustomerName(rs.getString("first_name") != null ?
            rs.getString("first_name") + " " + rs.getString("last_name") : "Customer");
        order.setCustomerEmail(rs.getString("email"));
        order.setCustomerPhone(rs.getString("phone"));
        order.setDeliveryAddress(rs.getString("address"));
        return order;
    };

    private final RowMapper<OrderDetailDto.OrderItemDetail> orderItemRowMapper = (rs, rowNum) -> {
        OrderDetailDto.OrderItemDetail item = new OrderDetailDto.OrderItemDetail();
        item.setOrderItemId(rs.getLong("order_item_id"));
        item.setProductId(rs.getLong("product_id"));
        item.setProductName(rs.getString("product_name"));
        item.setProductCategory(rs.getString("product_category"));
        item.setProductImageUrl(rs.getString("product_image_url"));
        item.setQuantity(rs.getInt("quantity"));
        item.setPrice(rs.getDouble("price"));
        return item;
    };

    public List<CustomerOrderDto> findOrdersByUsername(String username) {
        // Join orders with customers to get customer details
        String orderSql = "SELECT o.order_id, o.customer_id, o.total_amount, o.status, o.created_at, " +
            "c.first_name, c.last_name, c.email, c.phone, c.address " +
            "FROM orders o JOIN customers c ON o.customer_id = c.customer_id " +
            "WHERE c.email = ? ORDER BY o.created_at DESC";
        List<CustomerOrderDto> orders = jdbcTemplate.query(orderSql, orderRowMapper, username);

        if (!orders.isEmpty()) {
            for (CustomerOrderDto order : orders) {
                // Join order_items with products to get product names
                String itemSql = "SELECT oi.order_item_id, oi.product_id, oi.quantity, oi.price, " +
                    "p.name AS product_name, p.category AS product_category, p.image_url AS product_image_url " +
                    "FROM order_items oi LEFT JOIN products p ON oi.product_id = p.product_id " +
                    "WHERE oi.order_id = ?";
                List<OrderDetailDto.OrderItemDetail> items = jdbcTemplate.query(itemSql, orderItemRowMapper, order.getOrderId());
                order.setItems(items);
            }
        }
        return orders;
    }
}
