package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public Sale createSale(SaleRequest saleRequest) {
        Sale sale = new Sale();
        sale.setSalesnumber(generateSalesNumber());
        sale.setTotal_amount(saleRequest.getTotalAmount());
        sale.setPaid_amount(saleRequest.getPaidAmount());
        sale.setAdded_user(3); // Hardcoded for now
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

    private String generateSalesNumber() {
        long count = saleRepository.count() + 1;
        return String.format("SAL%03d", count);
    }
}
