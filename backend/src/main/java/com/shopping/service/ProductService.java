package com.shopping.service;

import com.shopping.dto.PagedResponse;
import com.shopping.dto.ProductRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Product;
import com.shopping.repository.ProductRepository;
import com.shopping.util.PageResponseFactory;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public PagedResponse<Product> getAllProducts(Pageable pageable, String category, Double minPrice, Double maxPrice) {
        List<Product> products = productRepository.findAll(pageable, category, minPrice, maxPrice);
        long total = productRepository.count(category, minPrice, maxPrice);
        return PageResponseFactory.create(products, total, pageable);
    }

    public Product getProductById(Long id) {
        Product product = productRepository.findById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found");
        }
        return product;
    }

    public void createProduct(ProductRequest request) {
        productRepository.save(toProduct(request));
    }

    public void updateProduct(Long id, ProductRequest request) {
        if (productRepository.update(id, toProduct(request)) == 0) {
            throw new ResourceNotFoundException("Product not found");
        }
    }

    public void deleteProduct(Long id) {
        if (productRepository.delete(id) == 0) {
            throw new ResourceNotFoundException("Product not found");
        }
    }

    private Product toProduct(ProductRequest request) {
        Product product = new Product();
        product.setSellerId(request.sellerId());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setCategory(request.category());
        product.setImageUrl(request.imageUrl());
        return product;
    }
}
