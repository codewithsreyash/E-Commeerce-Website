package com.shopping.repository;

import com.shopping.dto.KpiMetric;
import com.shopping.dto.MonthlyRevenuePoint;
import com.shopping.dto.TopProductStats;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {
    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public double getTotalRevenue() {
        Double total = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('PAID', 'SHIPPED', 'DELIVERED')",
            Double.class
        );
        return total == null ? 0d : total;
    }

    public Map<String, Long> getOrderStatusCounts() {
        Map<String, Long> result = new LinkedHashMap<>();
        result.put("PENDING", 0L);
        result.put("SHIPPED", 0L);
        result.put("DELIVERED", 0L);
        result.put("CANCELLED", 0L);
        RowCallbackHandler statusCountHandler = rs -> result.put(rs.getString("status"), rs.getLong("total"));
        jdbcTemplate.query(
            "SELECT status, COUNT(*) AS total FROM orders GROUP BY status",
            statusCountHandler
        );
        return result;
    }

    public List<TopProductStats> getTopProducts() {
        return jdbcTemplate.query(
            """
            SELECT p.product_id, p.name, COALESCE(SUM(oi.quantity), 0) AS total_units_sold,
                   COALESCE(SUM(oi.quantity * oi.price), 0) AS total_revenue
            FROM products p
            LEFT JOIN order_items oi ON oi.product_id = p.product_id
            GROUP BY p.product_id, p.name
            ORDER BY total_units_sold DESC, total_revenue DESC
            LIMIT 5
            """,
            (rs, rowNum) -> new TopProductStats(
                rs.getLong("product_id"),
                rs.getString("name"),
                rs.getLong("total_units_sold"),
                rs.getDouble("total_revenue")
            )
        );
    }

    public List<MonthlyRevenuePoint> getMonthlyRevenue() {
        return jdbcTemplate.query(
            """
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COALESCE(SUM(total_amount), 0) AS revenue
            FROM orders
            WHERE created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
            """,
            (rs, rowNum) -> new MonthlyRevenuePoint(rs.getString("month"), rs.getDouble("revenue"))
        );
    }

    public KpiMetric getRevenueKpi() {
        Double total = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('PAID', 'SHIPPED', 'DELIVERED')",
            Double.class
        );
        Double current = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('PAID', 'SHIPPED', 'DELIVERED') AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')",
            Double.class
        );
        Double previous = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('PAID', 'SHIPPED', 'DELIVERED')" +
                " AND created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')" +
                " AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')",
            Double.class
        );
        double previousValue = previous == null ? 0d : previous;
        double currentValue = current == null ? 0d : current;
        double change = previousValue == 0 ? (currentValue == 0 ? 0d : 100d) : (((currentValue - previousValue) / previousValue) * 100d);
        return new KpiMetric(Math.round((total == null ? 0d : total)), Math.round(change * 100.0) / 100.0);
    }

    public KpiMetric getOrderKpi() {
        return buildKpi("orders");
    }

    public KpiMetric getCustomerKpi() {
        return buildKpi("customers");
    }

    public KpiMetric getProductKpi() {
        return buildKpi("products");
    }

    private KpiMetric buildKpi(String tableName) {
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableName, Long.class);
        Double current = jdbcTemplate.queryForObject(
            "SELECT COALESCE(COUNT(*), 0) FROM " + tableName + " WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')",
            Double.class
        );
        Double previous = jdbcTemplate.queryForObject(
            "SELECT COALESCE(COUNT(*), 0) FROM " + tableName +
                " WHERE created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')" +
                " AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')",
            Double.class
        );
        double previousValue = previous == null ? 0d : previous;
        double currentValue = current == null ? 0d : current;
        double change = previousValue == 0 ? (currentValue == 0 ? 0d : 100d) : (((currentValue - previousValue) / previousValue) * 100d);
        return new KpiMetric(total == null ? 0 : total, Math.round(change * 100.0) / 100.0);
    }
}
