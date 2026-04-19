package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.CustomerRequest;
import com.shopping.exception.ResourceNotFoundException;
import com.shopping.model.Customer;
import com.shopping.repository.CustomerRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {
    @Mock private CustomerRepository customerRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private CustomerService customerService;

    @Test
    void createCustomerHashesPasswordBeforeSave() {
        when(passwordEncoder.encode("Secret@123")).thenReturn("encoded");

        customerService.createCustomer(new CustomerRequest("Jane", "Doe", "jane@example.com", "Secret@123", "111", "Street"));

        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void getAllCustomersDelegatesToRepository() {
        when(customerRepository.findAll(PageRequest.of(0, 10), "jane")).thenReturn(List.of(new Customer()));
        when(customerRepository.count("jane")).thenReturn(1L);

        customerService.getAllCustomers(PageRequest.of(0, 10), "jane");

        verify(customerRepository).findAll(PageRequest.of(0, 10), "jane");
    }

    @Test
    void getCustomerByIdThrowsWhenMissing() {
        when(customerRepository.findById(3L)).thenReturn(null);

        assertThatThrownBy(() -> customerService.getCustomerById(3L)).isInstanceOf(ResourceNotFoundException.class);
    }
}
