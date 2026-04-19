package com.shopping.dto;

import java.util.List;

public record PagedResponse<T>(
    List<T> content,
    long totalElements,
    int totalPages,
    int size,
    int number,
    boolean first,
    boolean last,
    String sort
) {}
