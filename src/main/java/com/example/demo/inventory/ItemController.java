package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public List<Item> getAllItems(
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer statusId,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchTerm) {
        if (brandId == null && statusId == null && categoryId == null && (searchTerm == null || searchTerm.isEmpty())) {
            return itemService.findAllItems();
        } else {
            return itemService.getAllItems(brandId, statusId, categoryId, searchTerm);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Integer id) {
        Optional<Item> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Item createItem(@RequestBody Item item) {
        return itemService.createItem(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Integer id, @RequestBody Item itemDetails) {
        Item updatedItem = itemService.updateItem(id, itemDetails);
        if (updatedItem != null) {
            return ResponseEntity.ok(updatedItem);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Integer id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bySupplier/{supplierId}")
    public List<Item> getItemsBySupplierId(@PathVariable Integer supplierId) {
        return itemService.getItemsBySupplierId(supplierId);
    }
}