package com.shopping.controller;

import com.shopping.dto.CheckoutRequest;
import com.shopping.model.Order;
import com.shopping.model.OrderItem;
import com.shopping.repository.CustomerRepository;
import com.shopping.repository.OrderItemRepository;
import com.shopping.repository.OrderRepository;
import com.shopping.repository.UserRepository;
import com.shopping.model.User;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/storefront")
public class StorefrontCheckoutController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public StorefrontCheckoutController(
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        CustomerRepository customerRepository,
        UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Long>> checkout(
        @Valid @RequestBody CheckoutRequest request,
        Principal principal
    ) {
        // Resolve customer_id from the logged-in user's username (email)
        Long customerId = resolveCustomerId(principal, request.phone(), request.address());

        double total = request.items().stream()
            .mapToDouble(i -> i.price() * i.quantity())
            .sum();

        Order order = new Order();
        order.setCustomerId(customerId);
        order.setTotalAmount(total);
        order.setStatus("PENDING");
        long orderId = orderRepository.save(order);

        for (CheckoutRequest.CartItemDto item : request.items()) {
            OrderItem oi = new OrderItem();
            oi.setOrderId(orderId);
            oi.setProductId(item.productId());
            oi.setQuantity(item.quantity());
            oi.setPrice(item.price());
            orderItemRepository.save(oi);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("orderId", orderId));
    }

    private Long resolveCustomerId(Principal principal, String phone, String address) {
        if (principal == null) {
            return 1L; // guest fallback
        }
        String username = principal.getName();

        // Find customer by email = username
        var customers = customerRepository.findAll(
            org.springframework.data.domain.PageRequest.of(0, 1), username
        );
        if (!customers.isEmpty()) {
            var customer = customers.get(0);
            // Update phone and address if provided
            if (phone != null && !phone.isBlank()) {
                customer.setPhone(phone);
            }
            if (address != null && !address.isBlank()) {
                customer.setAddress(address);
            }
            customerRepository.update(customer.getCustomerId(), customer);
            return customer.getCustomerId();
        }

        // No customer row exists — create one on the fly
        com.shopping.model.Customer customer = new com.shopping.model.Customer();
        String namePart = username.contains("@") ? username.split("@")[0] : username;
        customer.setFirstName(namePart);
        customer.setLastName("(user)");
        customer.setEmail(username);
        customer.setPasswordHash("");
        customer.setPhone(phone != null ? phone : "");
        customer.setAddress(address != null ? address : "");
        customerRepository.save(customer);

        // Fetch the newly created customer
        var created = customerRepository.findAll(
            org.springframework.data.domain.PageRequest.of(0, 1), username
        );
        return created.isEmpty() ? 1L : created.get(0).getCustomerId();
    }
}
