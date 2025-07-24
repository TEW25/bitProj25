package com.example.dse.purchaseOrder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; // Import Optional
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public Page<PurchaseOrder> getAllPurchaseOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return purchaseOrderService.getAllPurchaseOrders(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(@PathVariable Integer id) { // Changed return type to ResponseEntity
        PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderById(id);
        if (purchaseOrder != null) {
            return ResponseEntity.ok(purchaseOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPurchaseOrder(@PathVariable Integer id) {
        try {
            boolean cancelled = purchaseOrderService.cancelPurchaseOrder(id);
            if (cancelled) {
                return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Purchase Order cancelled successfully!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(java.util.Collections.singletonMap("message", "Purchase Order not found."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(java.util.Collections.singletonMap("message", "Error cancelling Purchase Order: " + e.getMessage()));
        }
    }
}
