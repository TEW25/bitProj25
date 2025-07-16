
package com.example.demo.inventory;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales")
public class SalesController {
    @Autowired
    private SalesService salesService;

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody SaleRequest saleRequest) {
        Sale sale = salesService.createSale(saleRequest);
        return ResponseEntity.ok(sale);
    }

    // List all sales
    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        List<Sale> sales = salesService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    // Get sale by id with details
    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Integer id) {
        Sale sale = salesService.getSaleById(id);
        if (sale != null) {
            return ResponseEntity.ok(sale);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
