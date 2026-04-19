package com.shopping.repository;

import com.shopping.model.Seller;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class SellerRepository {
    private final JdbcTemplate jdbcTemplate;

    public SellerRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

    private final RowMapper<Seller> rowMapper = (rs, rowNum) -> {
        Seller s = new Seller();
        s.setSellerId(rs.getLong("seller_id"));
        s.setCompanyName(rs.getString("company_name"));
        s.setEmail(rs.getString("email"));
        s.setPasswordHash(rs.getString("password_hash"));
        s.setPhone(rs.getString("phone"));
        s.setCreatedAt(rs.getTimestamp("created_at"));
        return s;
    };

    public List<Seller> findAll(Pageable pageable, String search) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(search, args);
        String sql = "SELECT * FROM sellers " + where + " ORDER BY " + resolveSortColumn(pageable) + " " + resolveSortDirection(pageable) + " LIMIT ? OFFSET ?";
        args.add(pageable.getPageSize());
        args.add((int) pageable.getOffset());
        return jdbcTemplate.query(sql, rowMapper, args.toArray());
    }

    public long count(String search) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(search, args);
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM sellers " + where, Long.class, args.toArray());
        return count == null ? 0 : count;
    }

    public Seller findById(Long id) {
        List<Seller> sellers = jdbcTemplate.query("SELECT * FROM sellers WHERE seller_id = ?", rowMapper, id);
        return sellers.isEmpty() ? null : sellers.get(0);
    }

    public int save(Seller s) {
        return jdbcTemplate.update(
            "INSERT INTO sellers (company_name, email, password_hash, phone) VALUES (?, ?, ?, ?)",
            s.getCompanyName(), s.getEmail(), s.getPasswordHash(), s.getPhone()
        );
    }

    private String buildFilterClause(String search, List<Object> args) {
        if (search == null || search.isBlank()) {
            return "";
        }
        String query = "%" + search.toLowerCase() + "%";
        args.add(query);
        args.add(query);
        return "WHERE LOWER(company_name) LIKE ? OR LOWER(email) LIKE ?";
    }

    private String resolveSortColumn(Pageable pageable) {
        String property = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty() : "createdAt";
        return switch (property) {
            case "sellerId" -> "seller_id";
            case "companyName" -> "company_name";
            case "email" -> "email";
            default -> "created_at";
        };
    }

    private String resolveSortDirection(Pageable pageable) {
        return pageable.getSort().isSorted() && pageable.getSort().iterator().next().isAscending() ? "ASC" : "DESC";
    }
}
