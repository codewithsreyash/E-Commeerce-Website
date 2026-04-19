package com.shopping.controller;

import com.shopping.dto.PagedResponse;
import com.shopping.model.Product;
import com.shopping.service.StorefrontProductService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/storefront/products")
public class StorefrontController {
    
    private final StorefrontProductService service;

    public StorefrontController(StorefrontProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<Product>> getAllActiveProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(service.getActiveProducts(pageable, null, null));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<PagedResponse<Product>> getProductsByCategory(
        @PathVariable String category,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(service.getActiveProducts(pageable, category, null));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<Product>> searchProducts(
        @RequestParam String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(service.getActiveProducts(pageable, null, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.getActiveProductById(id));
    }

    private Pageable buildPageable(int page, int size, String sort) {
        String[] sortParts = sort.split(",");
        String sortField = sortParts.length > 0 ? sortParts[0] : "createdAt";
        String sortDirection = sortParts.length > 1 ? sortParts[1] : "desc";
        return PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortField));
    }
}
