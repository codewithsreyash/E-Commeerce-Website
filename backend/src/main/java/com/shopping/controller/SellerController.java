package com.shopping.controller;

import com.shopping.dto.PagedResponse;
import com.shopping.dto.SellerRequest;
import com.shopping.model.Seller;
import com.shopping.service.SellerService;
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
@RequestMapping("/api/admin/sellers")
public class SellerController {
    private final SellerService sellerService;

    public SellerController(SellerService sellerService) { this.sellerService = sellerService; }

    @GetMapping
    public ResponseEntity<PagedResponse<Seller>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt,desc") String sort,
        @RequestParam(required = false) String search
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ResponseEntity.ok(sellerService.getAllSellers(pageable, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(sellerService.getSellerById(id));
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody SellerRequest request) {
        sellerService.createSeller(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private Pageable buildPageable(int page, int size, String sort) {
        String[] sortParts = sort.split(",");
        String sortField = sortParts.length > 0 ? sortParts[0] : "createdAt";
        String sortDirection = sortParts.length > 1 ? sortParts[1] : "desc";
        return PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortField));
    }
}
