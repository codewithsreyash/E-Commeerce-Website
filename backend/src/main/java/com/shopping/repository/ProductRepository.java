package com.shopping.repository;

import com.shopping.model.Product;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

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

    public List<Product> findAll(Pageable pageable, String category, Double minPrice, Double maxPrice) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(category, minPrice, maxPrice, args);
        String sql = "SELECT * FROM products " + where + " ORDER BY " + resolveSortColumn(pageable) + " " + resolveSortDirection(pageable) + " LIMIT ? OFFSET ?";
        args.add(pageable.getPageSize());
        args.add((int) pageable.getOffset());
        return jdbcTemplate.query(sql, rowMapper, args.toArray());
    }

    public long count(String category, Double minPrice, Double maxPrice) {
        List<Object> args = new ArrayList<>();
        String where = buildFilterClause(category, minPrice, maxPrice, args);
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products " + where, Long.class, args.toArray());
        return count == null ? 0 : count;
    }

    public Product findById(Long id) {
        List<Product> products = jdbcTemplate.query("SELECT * FROM products WHERE product_id = ?", rowMapper, id);
        return products.isEmpty() ? null : products.get(0);
    }

    public int save(Product p) {
        return jdbcTemplate.update(
            "INSERT INTO products (seller_id, name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            p.getSellerId(), p.getName(), p.getDescription(), p.getPrice(), p.getStock(), p.getCategory(), p.getImageUrl()
        );
    }

    public int update(Long id, Product p) {
        return jdbcTemplate.update(
            "UPDATE products SET seller_id = ?, name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE product_id = ?",
            p.getSellerId(), p.getName(), p.getDescription(), p.getPrice(), p.getStock(), p.getCategory(), p.getImageUrl(), id
        );
    }

    public int delete(Long id) {
        return jdbcTemplate.update("DELETE FROM products WHERE product_id = ?", id);
    }

    private String buildFilterClause(String category, Double minPrice, Double maxPrice, List<Object> args) {
        List<String> filters = new ArrayList<>();
        if (category != null && !category.isBlank()) {
            filters.add("category = ?");
            args.add(category);
        }
        if (minPrice != null) {
            filters.add("price >= ?");
            args.add(minPrice);
        }
        if (maxPrice != null) {
            filters.add("price <= ?");
            args.add(maxPrice);
        }
        return filters.isEmpty() ? "" : "WHERE " + String.join(" AND ", filters);
    }

    private String resolveSortColumn(Pageable pageable) {
        String property = pageable.getSort().isSorted() ? pageable.getSort().iterator().next().getProperty() : "createdAt";
        return switch (property) {
            case "productId" -> "product_id";
            case "name" -> "name";
            case "price" -> "price";
            case "stock" -> "stock";
            case "category" -> "category";
            default -> "created_at";
        };
    }

    private String resolveSortDirection(Pageable pageable) {
        return pageable.getSort().isSorted() && pageable.getSort().iterator().next().isAscending() ? "ASC" : "DESC";
    }
}
