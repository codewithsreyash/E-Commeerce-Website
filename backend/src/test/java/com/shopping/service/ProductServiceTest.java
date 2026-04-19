package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.ProductRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Product;
import com.shopping.repository.ProductRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock private ProductRepository productRepository;
    @InjectMocks private ProductService productService;

    @Test
    void getAllProductsReturnsPagedResponse() {
        when(productRepository.findAll(PageRequest.of(0, 10), null, null, null)).thenReturn(List.of(new Product()));
        when(productRepository.count(null, null, null)).thenReturn(1L);

        productService.getAllProducts(PageRequest.of(0, 10), null, null, null);

        verify(productRepository).findAll(PageRequest.of(0, 10), null, null, null);
    }

    @Test
    void getProductByIdThrowsWhenMissing() {
        when(productRepository.findById(99L)).thenReturn(null);

        assertThatThrownBy(() -> productService.getProductById(99L)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateProductThrowsWhenRepositoryDoesNotUpdate() {
        ProductRequest request = new ProductRequest(1L, "Phone", "Flagship", 999.0, 25, "Electronics", null);
        when(productRepository.update(eq(1L), any(Product.class))).thenReturn(0);

        assertThatThrownBy(() -> productService.updateProduct(1L, request)).isInstanceOf(ResourceNotFoundException.class);
    }
}
