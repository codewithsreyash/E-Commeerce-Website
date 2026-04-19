package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.OrderRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Order;
import com.shopping.repository.OrderRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock private OrderRepository orderRepository;
    @InjectMocks private OrderService orderService;

    @Test
    void getAllOrdersDelegatesToRepository() {
        when(orderRepository.findAll(PageRequest.of(0, 10), null, null, null)).thenReturn(List.of(new Order()));
        when(orderRepository.count(null, null, null)).thenReturn(1L);

        orderService.getAllOrders(PageRequest.of(0, 10), null, null, null);

        verify(orderRepository).findAll(PageRequest.of(0, 10), null, null, null);
    }

    @Test
    void deleteOrderThrowsWhenMissing() {
        when(orderRepository.delete(5L)).thenReturn(0);

        assertThatThrownBy(() -> orderService.deleteOrder(5L)).isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getRevenueForRangeUsesRepository() {
        LocalDate start = LocalDate.now().minusDays(7);
        LocalDate end = LocalDate.now();
        when(orderRepository.sumRevenueByDateRange(start, end)).thenReturn(250.0);

        orderService.getRevenueForRange(start, end);

        verify(orderRepository).sumRevenueByDateRange(start, end);
    }
}
