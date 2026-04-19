package com.shopping.service;

import com.shopping.dto.CustomerRequest;
import com.shopping.dto.PagedResponse;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Customer;
import com.shopping.repository.CustomerRepository;
import com.shopping.util.PageResponseFactory;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PagedResponse<Customer> getAllCustomers(Pageable pageable, String search) {
        List<Customer> customers = customerRepository.findAll(pageable, search);
        long total = customerRepository.count(search);
        return PageResponseFactory.create(customers, total, pageable);
    }

    public Customer getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id);
        if (customer == null) {
            throw new ResourceNotFoundException("Customer not found");
        }
        return customer;
    }

    public void createCustomer(CustomerRequest request) {
        customerRepository.save(toCustomer(request));
    }

    public void updateCustomer(Long id, CustomerRequest request) {
        if (customerRepository.update(id, toCustomer(request)) == 0) {
            throw new ResourceNotFoundException("Customer not found");
        }
    }

    public void deleteCustomer(Long id) {
        if (customerRepository.delete(id) == 0) {
            throw new ResourceNotFoundException("Customer not found");
        }
    }

    private Customer toCustomer(CustomerRequest request) {
        Customer customer = new Customer();
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setEmail(request.email());
        customer.setPasswordHash(passwordEncoder.encode(request.password()));
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        return customer;
    }
}
