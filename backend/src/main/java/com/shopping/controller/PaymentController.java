package com.shopping.controller;

import com.shopping.dto.PaymentRequest;
import com.shopping.model.Payment;
import com.shopping.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

    @GetMapping("/{orderId}")
    public ResponseEntity<Payment> getByOrderId(@PathVariable("orderId") Long id) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(id));
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody PaymentRequest request) {
        paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
