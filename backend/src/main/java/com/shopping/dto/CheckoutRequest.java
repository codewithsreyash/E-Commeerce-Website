package com.shopping.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CheckoutRequest(
    @NotEmpty(message = "Cart items are required") List<CartItemDto> items,
    String phone,
    String address
) {
    public record CartItemDto(Long productId, int quantity, double price) {}
}
