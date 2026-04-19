package com.shopping.service;

import com.shopping.dto.OrderDetailDto;
import com.shopping.dto.OrderRequest;
import com.shopping.dto.PagedResponse;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Order;
import com.shopping.repository.OrderRepository;
import com.shopping.util.PageResponseFactory;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public PagedResponse<Order> getAllOrders(Pageable pageable, String status, LocalDate startDate, LocalDate endDate) {
        List<Order> orders = orderRepository.findAll(pageable, status, startDate, endDate);
        long total = orderRepository.count(status, startDate, endDate);
        return PageResponseFactory.create(orders, total, pageable);
    }

    public List<OrderDetailDto> getAllOrdersWithDetails(Pageable pageable, String status, LocalDate startDate, LocalDate endDate) {
        return orderRepository.findAllWithDetails(pageable, status, startDate, endDate);
    }

    public Order getOrderById(Long id) {
        Order order = orderRepository.findById(id);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }
        return order;
    }

    public long createOrder(OrderRequest request) {
        return orderRepository.save(toOrder(request));
    }

    public void updateOrder(Long id, OrderRequest request) {
        if (orderRepository.update(id, toOrder(request)) == 0) {
            throw new ResourceNotFoundException("Order not found");
        }
    }

    public void deleteOrder(Long id) {
        if (orderRepository.delete(id) == 0) {
            throw new ResourceNotFoundException("Order not found");
        }
    }

    public double getRevenueForRange(LocalDate startDate, LocalDate endDate) {
        return orderRepository.sumRevenueByDateRange(startDate, endDate);
    }

    private Order toOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerId(request.customerId());
        order.setTotalAmount(request.totalAmount());
        order.setStatus(request.status());
        return order;
    }
}
