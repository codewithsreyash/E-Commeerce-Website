package com.shopping.repository;

import com.shopping.model.Customer;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerRepository {
    private final JdbcTemplate jdbcTemplate;

    public CustomerRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

    private final RowMapper<Customer> rowMapper = (rs, rowNum) -> {
        Customer c = new Customer();
        c.setCustomerId(rs.getLong("customer_id"));
        c.setFirstName(rs.getString("first_name"));
        c.setLastName(rs.getString("last_name"));
        c.setEmail(rs.getString("email"));
        c.setPasswordHash(rs.getString("password_hash"));
        c.setPhone(rs.getString("phone"));
        c.setAddress(rs.getString("address"));
        c.setCreatedAt(rs.getTimestamp("created_at"));
        return c;
    };

    public List<Customer> findAll(Pageable pageable, String search) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(search, args);
        String sql = "SELECT * FROM customers " + where + " ORDER BY " + resolveSortColumn(pageable) + " " + resolveSortDirection(pageable) + " LIMIT ? OFFSET ?";
        args.add(pageable.getPageSize());
        args.add((int) pageable.getOffset());
        return jdbcTemplate.query(sql, rowMapper, args.toArray());
    }

    public long count(String search) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(search, args);
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM customers " + where, Long.class, args.toArray());
        return count == null ? 0 : count;
    }

    public Customer findById(Long id) {
        List<Customer> customers = jdbcTemplate.query("SELECT * FROM customers WHERE customer_id = ?", rowMapper, id);
        return customers.isEmpty() ? null : customers.get(0);
    }

    public int save(Customer c) {
        return jdbcTemplate.update(
            "INSERT INTO customers (first_name, last_name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
            c.getFirstName(), c.getLastName(), c.getEmail(), c.getPasswordHash(), c.getPhone(), c.getAddress()
        );
    }

    public int update(Long id, Customer c) {
        return jdbcTemplate.update(
            "UPDATE customers SET first_name = ?, last_name = ?, email = ?, password_hash = ?, phone = ?, address = ? WHERE customer_id = ?",
            c.getFirstName(), c.getLastName(), c.getEmail(), c.getPasswordHash(), c.getPhone(), c.getAddress(), id
        );
    }

    public int delete(Long id) {
        return jdbcTemplate.update("DELETE FROM customers WHERE customer_id = ?", id);
    }

    private String buildFilterClause(String search, List<Object> args) {
        if (search == null || search.isBlank()) {
            return "";
        }
        String query = "%" + search.toLowerCase() + "%";
        args.add(query);
        args.add(query);
        args.add(query);
        return "WHERE LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(email) LIKE ?";
    }

    private String resolveSortColumn(Pageable pageable) {
        String property = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty() : "createdAt";
        return switch (property) {
            case "customerId" -> "customer_id";
            case "firstName" -> "first_name";
            case "lastName" -> "last_name";
            case "email" -> "email";
            default -> "created_at";
        };
    }

    private String resolveSortDirection(Pageable pageable) {
        return pageable.getSort().isSorted() && pageable.getSort().iterator().next().isAscending() ? "ASC" : "DESC";
    }
}
