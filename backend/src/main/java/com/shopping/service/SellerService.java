package com.shopping.service;

import com.shopping.dto.PagedResponse;
import com.shopping.dto.SellerRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Seller;
import com.shopping.repository.SellerRepository;
import com.shopping.util.PageResponseFactory;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SellerService {
    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;

    public SellerService(SellerRepository sellerRepository, PasswordEncoder passwordEncoder) {
        this.sellerRepository = sellerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PagedResponse<Seller> getAllSellers(Pageable pageable, String search) {
        List<Seller> sellers = sellerRepository.findAll(pageable, search);
        long total = sellerRepository.count(search);
        return PageResponseFactory.create(sellers, total, pageable);
    }

    public Seller getSellerById(Long id) {
        Seller seller = sellerRepository.findById(id);
        if (seller == null) {
            throw new ResourceNotFoundException("Seller not found");
        }
        return seller;
    }

    public void createSeller(SellerRequest request) {
        Seller seller = new Seller();
        seller.setCompanyName(request.companyName());
        seller.setEmail(request.email());
        seller.setPasswordHash(passwordEncoder.encode(request.password()));
        seller.setPhone(request.phone());
        sellerRepository.save(seller);
    }
}
