package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/itemreceivenotes")
public class ItemreceivenoteController {

    @Autowired
    private ItemreceivenoteService itemreceivenoteService;

    @PostMapping
    public ResponseEntity<Itemreceivenote> createItemreceivenote(@RequestBody Itemreceivenote itemreceivenote) {
        try {
            Itemreceivenote createdIrn = itemreceivenoteService.createItemreceivenote(itemreceivenote);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdIrn);
        } catch (RuntimeException e) {
            // TODO: More specific exception handling
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Or return an error response object
        }
    }

    // Endpoint to get item receive notes with optional filters for supplierId and date
    @GetMapping
    public ResponseEntity<?> getItemreceivenotes(
            @RequestParam(value = "supplierId", required = false) Integer supplierId,
            @RequestParam(value = "date", required = false) java.sql.Date date) {
        try {
            return ResponseEntity.ok(itemreceivenoteService.getItemreceivenotesFiltered(supplierId, date));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
