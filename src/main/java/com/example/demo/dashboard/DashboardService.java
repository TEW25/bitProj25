package com.example.demo.dashboard;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.categoryBrand.BrandRepository;
import com.example.demo.categoryBrand.CategoryRepository;
import com.example.demo.inventory.Inventory;
import com.example.demo.inventory.InventoryRepository;
import com.example.demo.item.ItemRepository;
import com.example.demo.sales.ItemHasSale;
import com.example.demo.sales.ItemHasSaleRepository;
import com.example.demo.sales.SaleRepository;

@Service
public class DashboardService {
    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private ItemHasSaleRepository itemHasSaleRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BrandRepository brandRepository;

    public Map<String, Object> getKpis() {
        Map<String, Object> kpis = new HashMap<>();
        BigDecimal totalRevenue = saleRepository.sumTotalAmount();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
        Long numberOfOrders = saleRepository.count();
        BigDecimal aov = BigDecimal.ZERO;
        if (numberOfOrders > 0) {
            aov = totalRevenue.divide(BigDecimal.valueOf(numberOfOrders), 2, java.math.RoundingMode.HALF_UP);
        }
        Long lowStockItems = inventoryRepository.countLowStockItems();
        kpis.put("totalRevenue", totalRevenue);
        kpis.put("numberOfOrders", numberOfOrders);
        kpis.put("averageOrderValue", aov);
        kpis.put("lowStockItems", lowStockItems);
        return kpis;
    }

    // 1. Low Stock Alerts Table
    public List<Map<String, Object>> getLowStockTable() {
        List<Inventory> lowStock = inventoryRepository.findAll().stream()
            .filter(i -> i.getAvailableqty() != null && i.getItem() != null && i.getItem().getRop() != null && i.getAvailableqty().doubleValue() < i.getItem().getRop())
            .collect(Collectors.toList());
        return lowStock.stream().map(inv -> {
            Map<String, Object> row = new HashMap<>();
            row.put("inventorycode", inv.getInventorycode());
            row.put("availableqty", inv.getAvailableqty());
            row.put("itemcode", inv.getItem().getItemcode());
            row.put("itemname", inv.getItem().getItemname());
            row.put("rop", inv.getItem().getRop());
            return row;
        }).collect(Collectors.toList());
    }

    // 2. Sales Over Time (returns list of {date, total})
    public List<Map<String, Object>> getSalesOverTime() {
        return saleRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                s -> s.getAdded_datetime() == null ? null : new java.text.SimpleDateFormat("yyyy-MM-dd").format(s.getAdded_datetime()),
                Collectors.mapping(s -> s.getTotal_amount() == null ? BigDecimal.ZERO : s.getTotal_amount(), Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
            ))
            .entrySet().stream()
            .map(e -> {
                Map<String, Object> row = new HashMap<>();
                row.put("date", e.getKey());
                row.put("total", e.getValue());
                return row;
            })
            .sorted((a, b) -> a.get("date").toString().compareTo(b.get("date").toString()))
            .collect(Collectors.toList());
    }

    // 3. Top Ordered Items (returns list of {itemname, quantity})
    public List<Map<String, Object>> getTopOrderedItems(int limit) {
        return itemHasSaleRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                ihs -> ihs.getItem().getItemname(),
                Collectors.summingDouble(ihs -> ihs.getQuantity() == null ? 0 : ihs.getQuantity().doubleValue())
            ))
            .entrySet().stream()
            .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
            .limit(limit)
            .map(e -> {
                Map<String, Object> row = new HashMap<>();
                row.put("itemname", e.getKey());
                row.put("quantity", e.getValue());
                return row;
            })
            .collect(Collectors.toList());
    }

    // 4. Revenue Breakdown (returns list of {label, value})
    public List<Map<String, Object>> getRevenueBreakdownBy(String type) {
        List<ItemHasSale> all = itemHasSaleRepository.findAll();
        if ("category".equalsIgnoreCase(type)) {
            return all.stream().collect(Collectors.groupingBy(
                ihs -> ihs.getItem().getSubcategory() != null && ihs.getItem().getSubcategory().getCategory() != null ? ihs.getItem().getSubcategory().getCategory().getName() : "Unknown",
                Collectors.reducing(BigDecimal.ZERO, ihs -> ihs.getLine_price() == null ? BigDecimal.ZERO : ihs.getLine_price(), BigDecimal::add)
            )).entrySet().stream().map(e -> {
                Map<String, Object> row = new HashMap<>();
                row.put("label", e.getKey());
                row.put("value", e.getValue());
                return row;
            }).collect(Collectors.toList());
        } else if ("brand".equalsIgnoreCase(type)) {
            return all.stream().collect(Collectors.groupingBy(
                ihs -> ihs.getItem().getBrand() != null ? ihs.getItem().getBrand().getName() : "Unknown",
                Collectors.reducing(BigDecimal.ZERO, ihs -> ihs.getLine_price() == null ? BigDecimal.ZERO : ihs.getLine_price(), BigDecimal::add)
            )).entrySet().stream().map(e -> {
                Map<String, Object> row = new HashMap<>();
                row.put("label", e.getKey());
                row.put("value", e.getValue());
                return row;
            }).collect(Collectors.toList());
        }
        return List.of();
    }
}
