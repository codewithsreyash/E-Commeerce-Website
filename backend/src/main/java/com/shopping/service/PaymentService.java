package com.shopping.service;

import com.shopping.dto.PaymentRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Payment;
import com.shopping.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment getPaymentByOrderId(Long id) {
        Payment payment = paymentRepository.findByOrderId(id);
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found");
        }
        return payment;
    }

    public void createPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setOrderId(request.orderId());
        payment.setAmount(request.amount());
        payment.setPaymentMethod(request.paymentMethod());
        payment.setStatus(request.status());
        paymentRepository.save(payment);
    }
}
