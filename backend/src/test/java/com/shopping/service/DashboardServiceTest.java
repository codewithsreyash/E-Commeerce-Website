package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.shopping.dto.KpiMetric;
import com.shopping.dto.MonthlyRevenuePoint;
import com.shopping.dto.TopProductStats;
import com.shopping.repository.DashboardRepository;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {
    @Mock private DashboardRepository dashboardRepository;
    @InjectMocks private DashboardService dashboardService;

    @Test
    void getStatsBuildsResponseFromRepositoryData() {
        when(dashboardRepository.getTotalRevenue()).thenReturn(1200.0);
        when(dashboardRepository.getRevenueKpi()).thenReturn(new KpiMetric(1200, 12.5));
        when(dashboardRepository.getOrderStatusCounts()).thenReturn(Map.of("PENDING", 2L));
        when(dashboardRepository.getTopProducts()).thenReturn(List.of(new TopProductStats(1L, "Phone", 10L, 500.0)));
        when(dashboardRepository.getMonthlyRevenue()).thenReturn(List.of(new MonthlyRevenuePoint("2026-04", 500.0)));
        when(dashboardRepository.getOrderKpi()).thenReturn(new KpiMetric(12, 5.0));
        when(dashboardRepository.getCustomerKpi()).thenReturn(new KpiMetric(8, 3.0));
        when(dashboardRepository.getProductKpi()).thenReturn(new KpiMetric(15, 4.0));

        var response = dashboardService.getStats();

        assertThat(response.totalRevenue()).isEqualTo(1200.0);
        assertThat(response.topProducts()).hasSize(1);
        assertThat(response.orderStatusCounts()).containsEntry("PENDING", 2L);
    }
}
