package com.shopping.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.shopping.dto.DashboardStatsResponse;
import com.shopping.dto.KpiMetric;
import com.shopping.security.JwtAuthenticationFilter;
import com.shopping.service.DashboardService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(DashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class DashboardControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private DashboardService dashboardService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private UserDetailsService userDetailsService;

    @Test
    void getStatsReturnsDashboardPayload() throws Exception {
        when(dashboardService.getStats()).thenReturn(
            new DashboardStatsResponse(
                1000.0,
                new KpiMetric(1000, 5.0),
                Map.of("PENDING", 2L),
                List.of(),
                List.of(),
                new KpiMetric(10, 2.0),
                new KpiMetric(4, 1.0),
                new KpiMetric(7, 3.0)
            )
        );

        mockMvc.perform(get("/api/admin/dashboard/stats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalRevenue").value(1000.0))
            .andExpect(jsonPath("$.orderStatusCounts.PENDING").value(2));
    }
}
