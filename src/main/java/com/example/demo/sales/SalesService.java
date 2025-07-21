package com.example.demo.sales;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.employee.Employee;
import com.example.demo.employee.EmployeeRepository;
import com.example.demo.inventory.Inventory;
import com.example.demo.inventory.InventoryRepository;
import com.example.demo.item.Item;
import com.example.demo.item.ItemRepository;

@Service
public class SalesService {
    // List sales by date and employee
    public List<Sale> getSalesByDateAndEmployee(String date, Integer employeeId) {
        List<Sale> sales = getSalesByDate(date);
        if (employeeId != null) {
            List<Sale> filtered = new ArrayList<>();
            for (Sale sale : sales) {
                if (sale.getEmployee() != null && sale.getEmployee().getId() != null && sale.getEmployee().getId().equals(employeeId)) {
                    filtered.add(sale);
                }
            }
            return filtered;
        }
        return sales;
    }

    // List sales by employee only
    public List<Sale> getSalesByEmployee(Integer employeeId) {
        List<Sale> sales = saleRepository.findAll();
        List<Sale> filtered = new ArrayList<>();
        for (Sale sale : sales) {
            if (sale.getEmployee() != null && sale.getEmployee().getId() != null && sale.getEmployee().getId().equals(employeeId)) {
                filtered.add(sale);
            }
        }
        return filtered;
    }
    // List sales by a single date
    public List<Sale> getSalesByDate(String date) {
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
            java.util.Date day = (date != null && !date.isEmpty()) ? sdf.parse(date) : null;
            if (day == null) return saleRepository.findAll();
            // Get start and end of the day
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(day);
            cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
            cal.set(java.util.Calendar.MINUTE, 0);
            cal.set(java.util.Calendar.SECOND, 0);
            cal.set(java.util.Calendar.MILLISECOND, 0);
            java.util.Date start = cal.getTime();
            cal.set(java.util.Calendar.HOUR_OF_DAY, 23);
            cal.set(java.util.Calendar.MINUTE, 59);
            cal.set(java.util.Calendar.SECOND, 59);
            cal.set(java.util.Calendar.MILLISECOND, 999);
            java.util.Date end = cal.getTime();
            return saleRepository.findByAddedDatetimeBetween(start, end);
        } catch (Exception e) {
            return saleRepository.findAll();
        }
    }
    // List sales by date range
    public List<Sale> getSalesByDateRange(String from, String to) {
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
            java.util.Date fromDate = (from != null && !from.isEmpty()) ? sdf.parse(from) : null;
            java.util.Date toDate = (to != null && !to.isEmpty()) ? sdf.parse(to) : null;
            if (toDate != null) {
                // Set to end of day
                java.util.Calendar cal = java.util.Calendar.getInstance();
                cal.setTime(toDate);
                cal.set(java.util.Calendar.HOUR_OF_DAY, 23);
                cal.set(java.util.Calendar.MINUTE, 59);
                cal.set(java.util.Calendar.SECOND, 59);
                cal.set(java.util.Calendar.MILLISECOND, 999);
                toDate = cal.getTime();
            }
            return saleRepository.findByAddedDatetimeBetween(fromDate, toDate);
        } catch (Exception e) {
            return saleRepository.findAll();
        }
    }
    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private ItemHasSaleRepository itemHasSaleRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public Sale createSale(SaleRequest saleRequest) {
        Sale sale = new Sale();
        sale.setSalesnumber(generateSalesNumber());
        sale.setTotal_amount(saleRequest.getTotalAmount());
        sale.setPaid_amount(saleRequest.getPaidAmount());
        sale.setPaymentType(saleRequest.getPaymentType());
        sale.setBalanceAmount(saleRequest.getBalanceAmount());
        sale.setDiscount(saleRequest.getDiscount());
        sale.setSubtotal(saleRequest.getSubtotal());
        // Set employee from request
        // Set sale employee if provided (optional, adjust as needed)
        Employee emp = null;
        if (saleRequest.getEmployeeId() != null) {
            emp = employeeRepository.findById(saleRequest.getEmployeeId()).orElse(null);
        }
        sale.setEmployee(emp);
        sale.setAdded_datetime(new Date());
        sale = saleRepository.save(sale);

        List<ItemHasSale> itemHasSalesList = new ArrayList<>();
        for (SaleRequest.SaleItemRequest itemReq : saleRequest.getItems()) {
            Item item = itemRepository.findById(itemReq.getItemId()).orElseThrow();
            ItemHasSale itemHasSale = new ItemHasSale();
            itemHasSale.setItem(item);
            itemHasSale.setSale(sale);
            itemHasSale.setSales_price(itemReq.getSalesPrice());
            itemHasSale.setQuantity(itemReq.getQuantity());
            itemHasSale.setLine_price(itemReq.getLinePrice());
            itemHasSaleRepository.save(itemHasSale);
            itemHasSalesList.add(itemHasSale);

            // Deduct inventory
            Inventory inventory = inventoryRepository.findByItemId(item.getId()).orElseThrow();
            BigDecimal newQty = inventory.getAvailableqty().subtract(itemReq.getQuantity());
            inventory.setAvailableqty(newQty);
            inventoryRepository.save(inventory);
        }
        sale.setItems(itemHasSalesList);
        return sale;
    }

    // List all sales
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @Transactional
    public Sale refundSale(RefundRequest refundRequest) {
        Sale sale = saleRepository.findById(refundRequest.getSaleId()).orElse(null);
        if (sale == null) return null;

        BigDecimal refundTotal = BigDecimal.ZERO;
        for (RefundRequest.RefundItem item : refundRequest.getItems()) {
            ItemHasSale itemHasSale = null;
            for (ItemHasSale i : sale.getItems()) {
                if (i.getItem().getId().equals(item.getItemId())) {
                    itemHasSale = i;
                    break;
                }
            }
            if (itemHasSale != null) {
                // Increase inventory
                Inventory inventory = inventoryRepository.findByItemId(item.getItemId()).orElse(null);
                if (inventory != null) {
                    inventory.setAvailableqty(inventory.getAvailableqty().add(BigDecimal.valueOf(item.getRefundQty())));
                    inventoryRepository.save(inventory);
                }
                // Reduce quantity in sale item
                BigDecimal newQty = itemHasSale.getQuantity().subtract(BigDecimal.valueOf(item.getRefundQty()));
                itemHasSale.setQuantity(newQty);
                itemHasSaleRepository.save(itemHasSale);
                // Calculate refund value for this item
                refundTotal = refundTotal.add(BigDecimal.valueOf(item.getSalesPrice()).multiply(BigDecimal.valueOf(item.getRefundQty())));
            }
        }
        // Reduce paid amount
        sale.setPaid_amount(sale.getPaid_amount().subtract(BigDecimal.valueOf(refundRequest.getPaidBack())));
        // Recalculate subtotal
        BigDecimal newSubtotal = BigDecimal.ZERO;
        for (ItemHasSale i : sale.getItems()) {
            newSubtotal = newSubtotal.add(i.getSales_price().multiply(i.getQuantity()));
        }
        sale.setSubtotal(newSubtotal);
        // Recalculate total (subtotal - discount)
        BigDecimal discount = sale.getDiscount() != null ? sale.getDiscount() : BigDecimal.ZERO;
        sale.setTotal_amount(newSubtotal.subtract(discount));
        // Recalculate balance
        sale.setBalanceAmount(sale.getTotal_amount().subtract(sale.getPaid_amount()));
        saleRepository.save(sale);
        return sale;
    }

    // Get sale by id with items
    public Sale getSaleById(Integer id) {
        return saleRepository.findById(id).orElse(null);
    }

    private String generateSalesNumber() {
        long count = saleRepository.count() + 1;
        return String.format("SAL%03d", count);
    }
}
