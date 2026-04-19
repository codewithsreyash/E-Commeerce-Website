package com.shopping.dto;

public record AuthResponse(String token, String tokenType, String username, String role) {}
