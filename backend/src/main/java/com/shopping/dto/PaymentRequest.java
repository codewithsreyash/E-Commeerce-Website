package com.shopping.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
    @NotNull(message = "Order id is required") Long orderId,
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    Double amount,
    @NotBlank(message = "Payment method is required") String paymentMethod,
    @NotBlank(message = "Status is required") String status
) {}
