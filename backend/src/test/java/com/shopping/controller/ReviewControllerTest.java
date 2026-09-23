package com.shopping.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.dto.PagedResponse;
import com.shopping.model.Review;
import com.shopping.security.JwtAuthenticationFilter;
import com.shopping.service.ReviewService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private ReviewService reviewService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserDetailsService userDetailsService;

    @Test
    void getReviewsReturnsOk() throws Exception {
        when(reviewService.getReviewsByProductId(any(), any())).thenReturn(new PagedResponse<>(List.of(new Review()), 1, 1, 10, 0, true, true, "UNSORTED"));

        mockMvc.perform(get("/api/admin/reviews/1")).andExpect(status().isOk());
    }

    @Test
    void createReviewReturnsCreated() throws Exception {
        mockMvc.perform(post("/api/admin/reviews")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(java.util.Map.of(
                    "productId", 1,
                    "customerId", 2,
                    "rating", 5,
                    "comment", "Great"
                ))))
            .andExpect(status().isCreated());
    }
}
