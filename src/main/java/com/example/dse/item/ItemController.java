package com.example.dse.item;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public Page<Item> getAllItems(
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer statusId,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        if (brandId == null && statusId == null && categoryId == null && (searchTerm == null || searchTerm.isEmpty())) {
            return itemService.findAllItems(pageable);
        } else {
            return itemService.getAllItems(brandId, statusId, categoryId, searchTerm, pageable);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Integer id) {
        Optional<Item> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody Item item) {
        try {
            System.out.println("Received Item: " + item);
            // Check for duplicate itemcode
            Item existingItem = itemService.findByItemcode(item.getItemcode());
            if (existingItem != null) {
                return ResponseEntity.status(409).body("Item code already exists.");
            }
            Item savedItem = itemService.createItem(item);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating item: " + e.getMessage());
        }
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