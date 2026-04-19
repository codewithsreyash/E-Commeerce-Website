package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.PaymentRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Payment;
import com.shopping.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {
    @Mock private PaymentRepository paymentRepository;
    @InjectMocks private PaymentService paymentService;

    @Test
    void getPaymentByOrderIdThrowsWhenMissing() {
        when(paymentRepository.findByOrderId(10L)).thenReturn(null);

        assertThatThrownBy(() -> paymentService.getPaymentByOrderId(10L)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createPaymentDelegatesToRepository() {
        paymentService.createPayment(new PaymentRequest(1L, 50.0, "UPI", "SUCCESS"));

        verify(paymentRepository).save(any(Payment.class));
    }
}
