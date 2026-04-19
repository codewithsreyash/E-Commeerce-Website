package com.shopping.service;

import com.shopping.dto.DashboardStatsResponse;
import com.shopping.repository.DashboardRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public DashboardStatsResponse getStats() {
        return new DashboardStatsResponse(
            dashboardRepository.getTotalRevenue(),
            dashboardRepository.getRevenueKpi(),
            dashboardRepository.getOrderStatusCounts(),
            dashboardRepository.getTopProducts(),
            dashboardRepository.getMonthlyRevenue(),
            dashboardRepository.getOrderKpi(),
            dashboardRepository.getCustomerKpi(),
            dashboardRepository.getProductKpi()
        );
    }
}
