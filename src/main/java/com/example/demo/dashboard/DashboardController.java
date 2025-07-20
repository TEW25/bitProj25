package com.example.demo.dashboard;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/kpis")
    public Map<String, Object> getKpis() {
        return dashboardService.getKpis();
    }

    @GetMapping("/low-stock-table")
    public List<Map<String, Object>> getLowStockTable() {
        return dashboardService.getLowStockTable();
    }

    @GetMapping("/sales-over-time")
    public List<Map<String, Object>> getSalesOverTime() {
        return dashboardService.getSalesOverTime();
    }

    @GetMapping("/top-ordered-items")
    public List<Map<String, Object>> getTopOrderedItems(@RequestParam(defaultValue = "10") int limit) {
        return dashboardService.getTopOrderedItems(limit);
    }

    @GetMapping("/revenue-breakdown")
    public List<Map<String, Object>> getRevenueBreakdown(@RequestParam(defaultValue = "category") String type) {
        return dashboardService.getRevenueBreakdownBy(type);
    }
}
