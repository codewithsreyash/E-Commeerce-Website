package com.shopping.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
    @NotNull(message = "Product id is required") Long productId,
    @NotNull(message = "Customer id is required") Long customerId,
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    Integer rating,
    @Size(max = 1000, message = "Comment must be at most 1000 characters")
    String comment
) {}
