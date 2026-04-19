package com.shopping.service;

import com.shopping.dto.PagedResponse;
import com.shopping.dto.ReviewRequest;
import com.shopping.model.Review;
import com.shopping.repository.ReviewRepository;
import com.shopping.util.PageResponseFactory;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public PagedResponse<Review> getReviewsByProductId(Long id, Pageable pageable) {
        List<Review> reviews = reviewRepository.findByProductId(id, pageable);
        long total = reviewRepository.countByProductId(id);
        return PageResponseFactory.create(reviews, total, pageable);
    }

    public void createReview(ReviewRequest request) {
        Review review = new Review();
        review.setProductId(request.productId());
        review.setCustomerId(request.customerId());
        review.setRating(request.rating());
        review.setComment(request.comment());
        reviewRepository.save(review);
    }
}
