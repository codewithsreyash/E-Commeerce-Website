package com.shopping.util;

import com.shopping.dto.PagedResponse;
import java.util.List;
import org.springframework.data.domain.Pageable;

public final class PageResponseFactory {
    private PageResponseFactory() {}

    public static <T> PagedResponse<T> create(List<T> content, long totalElements, Pageable pageable) {
        int totalPages = pageable.getPageSize() == 0 ? 0 : (int) Math.ceil((double) totalElements / pageable.getPageSize());
        return new PagedResponse<>(
            content,
            totalElements,
            totalPages,
            pageable.getPageSize(),
            pageable.getPageNumber(),
            pageable.getPageNumber() == 0,
            pageable.getPageNumber() >= Math.max(totalPages - 1, 0),
            pageable.getSort().toString()
        );
    }
}
