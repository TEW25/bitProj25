package com.example.demo.item;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.supplier.SupplierHasItem;
import com.example.demo.supplier.SupplierHasItemRepository;

@Service
public class ItemService {
    public Item findByItemcode(String itemcode) {
    // Add Pageable.unpaged() to get all results (not paginated)
    List<Item> items = itemRepository
        .findFilteredItems(null, null, null, itemcode, org.springframework.data.domain.Pageable.unpaged())
        .getContent();
    if (items != null && !items.isEmpty()) {
        for (Item item : items) {
            if (item.getItemcode().equalsIgnoreCase(itemcode)) {
                return item;
            }
        }
    }
    return null;
}

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private SupplierHasItemRepository supplierHasItemRepository;

    public Page<Item> getAllItems(Integer brandId, Integer statusId, Integer categoryId, String searchTerm, Pageable pageable) {
    return itemRepository.findFilteredItems(brandId, statusId, categoryId, searchTerm, pageable);
}

    public Optional<Item> getItemById(Integer id) {
        return itemRepository.findById(id);
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Item updateItem(Integer id, Item itemDetails) {
        Optional<Item> item = itemRepository.findById(id);
        if (item.isPresent()) {
            Item existingItem = item.get();
            existingItem.setItemcode(itemDetails.getItemcode());
            existingItem.setItemname(itemDetails.getItemname());
            existingItem.setItemsize(itemDetails.getItemsize());
            existingItem.setRop(itemDetails.getRop());
            existingItem.setRoq(itemDetails.getRoq());
            existingItem.setSalesprice(itemDetails.getSalesprice());
            existingItem.setPurchaseprice(itemDetails.getPurchaseprice());
            existingItem.setItemstatus(itemDetails.getItemstatus());
            existingItem.setBrand(itemDetails.getBrand());
            existingItem.setSubcategory(itemDetails.getSubcategory());
            return itemRepository.save(existingItem);
        } else {
            return null;
        }
    }

    public void deleteItem(Integer id) {
        itemRepository.deleteById(id);
    }

    public List<Item> getItemsBySupplierId(Integer supplierId) {
        // Find all SupplierHasItem entries for the given supplierId
        List<SupplierHasItem> supplierItems = supplierHasItemRepository.findBySupplierId(supplierId);

        // Extract Item objects from the SupplierHasItem entries
        List<Item> items = new java.util.ArrayList<>();
        for (SupplierHasItem supplierItem : supplierItems) {
            // Fetch the full Item object using the itemRepository
            itemRepository.findById(supplierItem.getItem().getId()).ifPresent(items::add);
        }
        return items;
    }

    
    public Page<Item> findAllItems(Pageable pageable) {
        return itemRepository.findAll(pageable);
    }
}