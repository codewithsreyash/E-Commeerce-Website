package com.shopping.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.dto.PagedResponse;
import com.shopping.model.Order;
import com.shopping.security.JwtAuthenticationFilter;
import com.shopping.service.OrderService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private OrderService orderService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserDetailsService userDetailsService;

    @Test
    void getOrdersAndRevenueReturnOk() throws Exception {
        when(orderService.getAllOrders(any(), any(), any(), any()))
            .thenReturn(new PagedResponse<>(List.of(new Order()), 1, 1, 10, 0, true, true, "UNSORTED"));
        when(orderService.getRevenueForRange(any(), any())).thenReturn(500.0);

        mockMvc.perform(get("/api/admin/orders")).andExpect(status().isOk());
        mockMvc.perform(get("/api/admin/orders/revenue")).andExpect(status().isOk()).andExpect(jsonPath("$.revenue").value(500.0));
    }

    @Test
    void createOrderReturnsCreated() throws Exception {
        when(orderService.createOrder(any())).thenReturn(1L);

        mockMvc.perform(post("/api/admin/orders")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(java.util.Map.of("customerId", 1, "totalAmount", 99.0, "status", "PENDING"))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.orderId").value(1));
    }
}
