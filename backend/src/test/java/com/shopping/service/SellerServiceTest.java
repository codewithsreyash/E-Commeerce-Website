package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.SellerRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Seller;
import com.shopping.repository.SellerRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class SellerServiceTest {
    @Mock private SellerRepository sellerRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private SellerService sellerService;

    @Test
    void getAllSellersDelegatesToRepository() {
        when(sellerRepository.findAll(PageRequest.of(0, 10), null)).thenReturn(List.of(new Seller()));
        when(sellerRepository.count(null)).thenReturn(1L);

        sellerService.getAllSellers(PageRequest.of(0, 10), null);

        verify(sellerRepository).findAll(PageRequest.of(0, 10), null);
    }

    @Test
    void getSellerByIdThrowsWhenMissing() {
        when(sellerRepository.findById(8L)).thenReturn(null);

        assertThatThrownBy(() -> sellerService.getSellerById(8L)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createSellerHashesPassword() {
        when(passwordEncoder.encode("Seller@123")).thenReturn("encoded");

        sellerService.createSeller(new SellerRequest("Shop Co", "shop@example.com", "Seller@123", "999"));

        verify(sellerRepository).save(any(Seller.class));
    }
}
