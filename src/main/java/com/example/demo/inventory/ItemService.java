package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private SupplierHasItemRepository supplierHasItemRepository;

    public List<Item> getAllItems(Integer brandId, Integer statusId, Integer categoryId, String searchTerm) {
        return itemRepository.findFilteredItems(brandId, statusId, categoryId, searchTerm);
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

    public List<Item> findAllItems() {
        return itemRepository.findAll();
    }
}