package com.shopping.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.dto.PagedResponse;
import com.shopping.model.Customer;
import com.shopping.security.JwtAuthenticationFilter;
import com.shopping.service.CustomerService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CustomerController.class)
@AutoConfigureMockMvc(addFilters = false)
class CustomerControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private CustomerService customerService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserDetailsService userDetailsService;

    @Test
    void getCustomersReturnsOk() throws Exception {
        when(customerService.getAllCustomers(any(), any())).thenReturn(new PagedResponse<>(List.of(new Customer()), 1, 1, 10, 0, true, true, "UNSORTED"));

        mockMvc.perform(get("/api/admin/customers")).andExpect(status().isOk());
    }

    @Test
    void createCustomerReturnsCreated() throws Exception {
        mockMvc.perform(post("/api/admin/customers")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(java.util.Map.of(
                    "firstName", "Jane",
                    "lastName", "Doe",
                    "email", "jane@example.com",
                    "password", "Secret@123",
                    "phone", "1234567890",
                    "address", "Street"
                ))))
            .andExpect(status().isCreated());
    }
}
