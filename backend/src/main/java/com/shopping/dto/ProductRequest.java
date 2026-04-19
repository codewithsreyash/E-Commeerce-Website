package com.shopping.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductRequest(
    @NotNull(message = "Seller id is required") Long sellerId,
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    String name,
    @Size(max = 2000, message = "Description must be at most 2000 characters")
    String description,
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    Double price,
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    Integer stock,
    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be at most 100 characters")
    String category,
    @Size(max = 500)
    String imageUrl
) {}
