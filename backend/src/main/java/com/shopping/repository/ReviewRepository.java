package com.shopping.repository;

import com.shopping.model.Review;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ReviewRepository {
    private final JdbcTemplate jdbcTemplate;

    public ReviewRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

    private final RowMapper<Review> rowMapper = (rs, rowNum) -> {
        Review r = new Review();
        r.setReviewId(rs.getLong("review_id"));
        r.setProductId(rs.getLong("product_id"));
        r.setCustomerId(rs.getLong("customer_id"));
        r.setRating(rs.getInt("rating"));
        r.setComment(rs.getString("comment"));
        r.setCreatedAt(rs.getTimestamp("created_at"));
        return r;
    };

    public List<Review> findByProductId(Long id, Pageable pageable) {
        return jdbcTemplate.query(
            "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            rowMapper,
            id,
            pageable.getPageSize(),
            (int) pageable.getOffset()
        );
    }

    public long countByProductId(Long id) {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM reviews WHERE product_id = ?", Long.class, id);
        return count == null ? 0 : count;
    }

    public int save(Review r) {
        return jdbcTemplate.update(
            "INSERT INTO reviews (product_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)",
            r.getProductId(), r.getCustomerId(), r.getRating(), r.getComment()
        );
    }
}
