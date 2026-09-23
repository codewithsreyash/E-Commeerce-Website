package com.shopping.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.dto.PagedResponse;
import com.shopping.model.Seller;
import com.shopping.security.JwtAuthenticationFilter;
import com.shopping.service.SellerService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SellerController.class)
@AutoConfigureMockMvc(addFilters = false)
class SellerControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private SellerService sellerService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserDetailsService userDetailsService;

    @Test
    void getSellersReturnsOk() throws Exception {
        when(sellerService.getAllSellers(any(), any())).thenReturn(new PagedResponse<>(List.of(new Seller()), 1, 1, 10, 0, true, true, "UNSORTED"));

        mockMvc.perform(get("/api/admin/sellers")).andExpect(status().isOk());
    }

    @Test
    void createSellerReturnsCreated() throws Exception {
        mockMvc.perform(post("/api/admin/sellers")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(java.util.Map.of(
                    "companyName", "Shop Co",
                    "email", "shop@example.com",
                    "password", "Seller@123",
                    "phone", "999"
                ))))
            .andExpect(status().isCreated());
    }
}
