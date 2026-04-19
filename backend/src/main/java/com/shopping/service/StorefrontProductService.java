package com.shopping.service;

import com.shopping.dto.PagedResponse;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Product;
import com.shopping.repository.StorefrontProductRepository;
import com.shopping.util.PageResponseFactory;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StorefrontProductService {
    private final StorefrontProductRepository repository;

    public StorefrontProductService(StorefrontProductRepository repository) {
        this.repository = repository;
    }

    public PagedResponse<Product> getActiveProducts(Pageable pageable, String category, String keyword) {
        List<Product> products = repository.findActiveProducts(pageable, category, keyword);
        long total = repository.countActiveProducts(category, keyword);
        return PageResponseFactory.create(products, total, pageable);
    }

    public Product getActiveProductById(Long id) {
        Product product = repository.findActiveById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Active product not found");
        }
        return product;
    }
}
