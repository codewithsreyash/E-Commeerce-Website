package com.shopping.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.ReviewRequest;
import com.shopping.model.Review;
import com.shopping.repository.ReviewRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {
    @Mock private ReviewRepository reviewRepository;
    @InjectMocks private ReviewService reviewService;

    @Test
    void getReviewsByProductIdDelegatesToRepository() {
        when(reviewRepository.findByProductId(1L, PageRequest.of(0, 10))).thenReturn(List.of(new Review()));
        when(reviewRepository.countByProductId(1L)).thenReturn(1L);

        reviewService.getReviewsByProductId(1L, PageRequest.of(0, 10));

        verify(reviewRepository).findByProductId(1L, PageRequest.of(0, 10));
    }

    @Test
    void createReviewDelegatesToRepository() {
        reviewService.createReview(new ReviewRequest(1L, 2L, 5, "Great"));

        verify(reviewRepository).save(any(Review.class));
    }
}
