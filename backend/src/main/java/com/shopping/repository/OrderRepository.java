package com.shopping.repository;

import com.shopping.dto.OrderDetailDto;
import com.shopping.model.Order;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {
    private final JdbcTemplate jdbcTemplate;

    public OrderRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

    private final RowMapper<Order> rowMapper = (rs, rowNum) -> {
        Order o = new Order();
        o.setOrderId(rs.getLong("order_id"));
        o.setCustomerId(rs.getLong("customer_id"));
        o.setTotalAmount(rs.getDouble("total_amount"));
        o.setStatus(rs.getString("status"));
        o.setCreatedAt(rs.getTimestamp("created_at"));
        return o;
    };

    public List<Order> findAll(Pageable pageable, String status, LocalDate startDate, LocalDate endDate) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(status, startDate, endDate, args);
        String sql = "SELECT * FROM orders " + where + " ORDER BY " + resolveSortColumn(pageable) + " " + resolveSortDirection(pageable) + " LIMIT ? OFFSET ?";
        args.add(pageable.getPageSize());
        args.add((int) pageable.getOffset());
        return jdbcTemplate.query(sql, rowMapper, args.toArray());
    }

    public long count(String status, LocalDate startDate, LocalDate endDate) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(status, startDate, endDate, args);
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM orders " + where, Long.class, args.toArray());
        return count == null ? 0 : count;
    }

    public Order findById(Long id) {
        List<Order> orders = jdbcTemplate.query("SELECT * FROM orders WHERE order_id = ?", rowMapper, id);
        return orders.isEmpty() ? null : orders.get(0);
    }

    public long save(Order o) {
        KeyHolder kh = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, o.getCustomerId());
            ps.setDouble(2, o.getTotalAmount());
            ps.setString(3, o.getStatus());
            return ps;
        }, kh);
        return kh.getKey().longValue();
    }

    public int update(Long id, Order o) {
        return jdbcTemplate.update(
            "UPDATE orders SET customer_id = ?, total_amount = ?, status = ? WHERE order_id = ?",
            o.getCustomerId(), o.getTotalAmount(), o.getStatus(), id
        );
    }

    public int delete(Long id) {
        return jdbcTemplate.update("DELETE FROM orders WHERE order_id = ?", id);
    }

    public List<OrderDetailDto> findAllWithDetails(Pageable pageable, String status, LocalDate startDate, LocalDate endDate) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(status, startDate, endDate, args);
        String sql = "SELECT o.order_id, o.customer_id, o.total_amount, o.status, o.created_at, " +
            "c.first_name, c.last_name, c.email, c.phone, c.address " +
            "FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id " +
            where + (where.isEmpty() ? "" : " ") +
            "ORDER BY o." + resolveSortColumn(pageable) + " " + resolveSortDirection(pageable) +
            " LIMIT ? OFFSET ?";
        args.add(pageable.getPageSize());
        args.add((int) pageable.getOffset());
        List<OrderDetailDto> orders = jdbcTemplate.query(sql, (rs, rowNum) -> {
            OrderDetailDto d = new OrderDetailDto();
            d.setOrderId(rs.getLong("order_id"));
            d.setCustomerId(rs.getLong("customer_id"));
            d.setCustomerName(rs.getString("first_name") != null ?
                rs.getString("first_name") + " " + rs.getString("last_name") : "Guest");
            d.setCustomerEmail(rs.getString("email"));
            d.setCustomerPhone(rs.getString("phone"));
            d.setDeliveryAddress(rs.getString("address"));
            d.setTotalAmount(rs.getDouble("total_amount"));
            d.setStatus(rs.getString("status"));
            d.setCreatedAt(rs.getTimestamp("created_at"));
            return d;
        }, args.toArray());
        // Load items with product names for each order
        for (OrderDetailDto order : orders) {
            String itemSql = "SELECT oi.order_item_id, oi.product_id, oi.quantity, oi.price, " +
                "p.name AS product_name, p.category AS product_category, p.image_url AS product_image_url " +
                "FROM order_items oi LEFT JOIN products p ON oi.product_id = p.product_id " +
                "WHERE oi.order_id = ?";
            List<OrderDetailDto.OrderItemDetail> items = jdbcTemplate.query(itemSql, (rs, rowNum) -> {
                OrderDetailDto.OrderItemDetail item = new OrderDetailDto.OrderItemDetail();
                item.setOrderItemId(rs.getLong("order_item_id"));
                item.setProductId(rs.getLong("product_id"));
                item.setProductName(rs.getString("product_name"));
                item.setProductCategory(rs.getString("product_category"));
                item.setProductImageUrl(rs.getString("product_image_url"));
                item.setQuantity(rs.getInt("quantity"));
                item.setPrice(rs.getDouble("price"));
                return item;
            }, order.getOrderId());
            order.setItems(items);
        }
        return orders;
    }

    public double sumRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(null, startDate, endDate, args);
        Double total = jdbcTemplate.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM orders " + where, Double.class, args.toArray());
        return total == null ? 0d : total;
    }

    private String buildFilterClause(String status, LocalDate startDate, LocalDate endDate, List<Object> args) {
        List<String> filters = new ArrayList<>();
        if (status != null && !status.isBlank()) {
            filters.add("status = ?");
            args.add(status);
        }
        if (startDate != null) {
            filters.add("DATE(created_at) >= ?");
            args.add(startDate);
        }
        if (endDate != null) {
            filters.add("DATE(created_at) <= ?");
            args.add(endDate);
        }
        return filters.isEmpty() ? "" : "WHERE " + String.join(" AND ", filters);
    }

    private String resolveSortColumn(Pageable pageable) {
        String property = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty() : "createdAt";
        return switch (property) {
            case "orderId" -> "order_id";
            case "customerId" -> "customer_id";
            case "totalAmount" -> "total_amount";
            case "status" -> "status";
            default -> "created_at";
        };
    }

    private String resolveSortDirection(Pageable pageable) {
        return pageable.getSort().isSorted() && pageable.getSort().iterator().next().isAscending() ? "ASC" : "DESC";
    }
}
