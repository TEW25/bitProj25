package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // TODO: Add endpoints for viewing GRNs, getting GRN details, updating status, etc.
}
