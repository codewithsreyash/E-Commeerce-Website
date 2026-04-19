package com.shopping.service;

import com.shopping.dto.CustomerOrderDto;
import com.shopping.repository.CustomerOrderRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CustomerOrderService {
    private final CustomerOrderRepository customerOrderRepository;

    public CustomerOrderService(CustomerOrderRepository customerOrderRepository) {
        this.customerOrderRepository = customerOrderRepository;
    }

    public List<CustomerOrderDto> getOrdersForUser(String username) {
        return customerOrderRepository.findOrdersByUsername(username);
    }
}
