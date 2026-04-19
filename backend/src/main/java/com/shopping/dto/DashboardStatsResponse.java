package com.shopping.dto;

import java.util.List;
import java.util.Map;

public record DashboardStatsResponse(
    double totalRevenue,
    KpiMetric totalRevenueMetric,
    Map<String, Long> orderStatusCounts,
    List<TopProductStats> topProducts,
    List<MonthlyRevenuePoint> monthlyRevenue,
    KpiMetric totalOrders,
    KpiMetric totalCustomers,
    KpiMetric totalProducts
) {}
