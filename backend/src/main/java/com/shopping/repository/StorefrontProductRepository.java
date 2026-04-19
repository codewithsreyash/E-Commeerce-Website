package com.shopping.repository;

import com.shopping.model.Product;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class StorefrontProductRepository {
    private final JdbcTemplate jdbcTemplate;

    public StorefrontProductRepository(JdbcTemplate jdbcTemplate) { 
        this.jdbcTemplate = jdbcTemplate; 
    }

    private final RowMapper<Product> rowMapper = (rs, rowNum) -> {
        Product p = new Product();
        p.setProductId(rs.getLong("product_id"));
        p.setSellerId(rs.getLong("seller_id"));
        p.setName(rs.getString("name"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getDouble("price"));
        p.setStock(rs.getInt("stock"));
        p.setCategory(rs.getString("category"));
        p.setImageUrl(rs.getString("image_url"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        return p;
    };

    public List<Product> findActiveProducts(Pageable pageable, String category, String keyword) {
        List<Object> args = new ArrayList<>();
        String whereClause = buildFilterClause(category, keyword, args);
        
        String sql = "SELECT * FROM products " + whereClause + 
                     " ORDER BY " + resolveSortColumn(pageable) + " " + resolveSortDirection(pageable) + 
                     " LIMIT ? OFFSET ?";
                     
        args.add(pageable.getPageSize());
        args.add((int) pageable.getOffset());
        return jdbcTemplate.query(sql, rowMapper, args.toArray());
    }

    public long countActiveProducts(String category, String keyword) {
        List<Object> args = new ArrayList<>();
        String whereClause = buildFilterClause(category, keyword, args);
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products " + whereClause, Long.class, args.toArray());
        return count == null ? 0 : count;
    }

    public Product findActiveById(Long id) {
        List<Product> products = jdbcTemplate.query(
            "SELECT * FROM products WHERE product_id = ?", 
            rowMapper, 
            id
        );
        return products.isEmpty() ? null : products.get(0);
    }

    private String buildFilterClause(String category, String keyword, List<Object> args) {
        List<String> filters = new ArrayList<>();

        if (category != null && !category.isBlank()) {
            filters.add("category = ?");
            args.add(category);
        }
        
        if (keyword != null && !keyword.isBlank()) {
            filters.add("(LOWER(name) LIKE ? OR LOWER(description) LIKE ?)");
            String likeKeyword = "%" + keyword.toLowerCase() + "%";
            args.add(likeKeyword);
            args.add(likeKeyword);
        }
        
        return filters.isEmpty() ? "" : "WHERE " + String.join(" AND ", filters);
    }

    private String resolveSortColumn(Pageable pageable) {
        if (!pageable.getSort().isSorted()) return "created_at";
        
        String property = pageable.getSort().iterator().next().getProperty();
        return switch (property) {
            case "price" -> "price";
            case "name" -> "name";
            default -> "created_at";
        };
    }

    private String resolveSortDirection(Pageable pageable) {
        if (!pageable.getSort().isSorted()) return "DESC";
        return pageable.getSort().iterator().next().isAscending() ? "ASC" : "DESC";
    }
}
