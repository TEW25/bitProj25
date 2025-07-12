package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Import List

@RestController
@RequestMapping("/api/purchaseorders")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @PostMapping
    public ResponseEntity<String> createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        try {
            purchaseOrderService.createPurchaseOrder(purchaseOrder);
            return ResponseEntity.status(HttpStatus.CREATED).body("Purchase Order created successfully!");
        } catch (RuntimeException e) {
            // Handle exceptions and return the error message
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating Purchase Order: " + e.getMessage());
        }
    }

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @GetMapping("/{id}")
    public PurchaseOrder getPurchaseOrderById(@PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrderById(id);
    }
}
