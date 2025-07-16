package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Service
public class SalesService {
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
        // Set employee (hardcoded to id=3 for now)
        Employee emp = employeeRepository.findById(3).orElse(null);
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

    // Get sale by id with items
    public Sale getSaleById(Integer id) {
        return saleRepository.findById(id).orElse(null);
    }

    private String generateSalesNumber() {
        long count = saleRepository.count() + 1;
        return String.format("SAL%03d", count);
    }
}
