package com.shopping.controller;

import com.shopping.dto.PagedResponse;
import com.shopping.dto.ReviewRequest;
import com.shopping.model.Review;
import com.shopping.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) { this.reviewService = reviewService; }

    @GetMapping("/{productId}")
    public ResponseEntity<PagedResponse<Review>> getByProductId(
        @PathVariable("productId") Long id,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(reviewService.getReviewsByProductId(id, pageable));
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ReviewRequest request) {
        reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
