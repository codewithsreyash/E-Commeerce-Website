package com.shopping.controller;

import com.shopping.dto.CustomerOrderDto;
import com.shopping.model.Customer;
import com.shopping.service.CustomerOrderService;
import com.shopping.repository.CustomerRepository;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;
    private final CustomerRepository customerRepository;

    public CustomerOrderController(CustomerOrderService customerOrderService, CustomerRepository customerRepository) {
        this.customerOrderService = customerOrderService;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<CustomerOrderDto>> getCustomerOrders(Principal principal) {
        // The principal object contains the authenticated username (extracted from the JWT securely by the JwtAuthenticationFilter)
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        List<CustomerOrderDto> orders = customerOrderService.getOrdersForUser(principal.getName());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        var customers = customerRepository.findAll(PageRequest.of(0, 1), principal.getName());
        if (customers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer c = customers.get(0);
        return ResponseEntity.ok(Map.of(
            "customerId", c.getCustomerId(),
            "firstName", c.getFirstName(),
            "lastName", c.getLastName(),
            "email", c.getEmail(),
            "phone", c.getPhone(),
            "address", c.getAddress()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody Map<String, String> request) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        var customers = customerRepository.findAll(PageRequest.of(0, 1), principal.getName());
        if (customers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer c = customers.get(0);
        if (request.containsKey("phone")) c.setPhone(request.get("phone"));
        if (request.containsKey("address")) c.setAddress(request.get("address"));
        if (request.containsKey("firstName")) c.setFirstName(request.get("firstName"));
        if (request.containsKey("lastName")) c.setLastName(request.get("lastName"));
        customerRepository.update(c.getCustomerId(), c);
        return ResponseEntity.ok().build();
    }
}
