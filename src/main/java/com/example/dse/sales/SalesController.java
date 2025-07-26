
package com.example.dse.sales;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    // List all sales, optionally filtered by date
    @GetMapping
    public ResponseEntity<Page<Sale>> getAllSales(
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Sale> sales;
        if (date != null && !date.isEmpty()) {
            sales = salesService.getSalesByDate(date, pageable);
            } else {
                // return ALL sales
                sales = salesService.getAllSales(pageable);
            }
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
    
    // Refund endpoint
    @PostMapping("/refunds")
    public ResponseEntity<Sale> refundSale(@RequestBody RefundRequest refundRequest) {
        Sale sale = salesService.refundSale(refundRequest);
        if (sale != null) {
            return ResponseEntity.ok(sale);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
