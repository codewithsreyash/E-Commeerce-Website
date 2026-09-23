package com.shopping.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.dto.PagedResponse;
import com.shopping.model.Product;
import com.shopping.security.JwtAuthenticationFilter;
import com.shopping.service.ProductService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private ProductService productService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserDetailsService userDetailsService;

    @Test
    void getProductsReturnsOk() throws Exception {
        when(productService.getAllProducts(any(), any(), any(), any()))
            .thenReturn(new PagedResponse<>(List.of(new Product()), 1, 1, 10, 0, true, true, "UNSORTED"));

        mockMvc.perform(get("/api/admin/products")).andExpect(status().isOk());
    }

    @Test
    void createProductReturnsCreated() throws Exception {
        mockMvc.perform(post("/api/admin/products")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(java.util.Map.of(
                    "sellerId", 1,
                    "name", "Phone",
                    "description", "Flagship",
                    "price", 899.0,
                    "stock", 10,
                    "category", "Electronics"
                ))))
            .andExpect(status().isCreated());
    }

    @Test
    void updateAndDeleteReturnNoContent() throws Exception {
        mockMvc.perform(put("/api/admin/products/1")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(java.util.Map.of(
                    "sellerId", 1,
                    "name", "Phone",
                    "description", "Updated",
                    "price", 899.0,
                    "stock", 10,
                    "category", "Electronics"
                ))))
            .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/admin/products/1")).andExpect(status().isNoContent());
    }
}
