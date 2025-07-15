package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventorystatus")
public class InventorystatusController {

    @Autowired
    private InventorystatusRepository inventorystatusRepository;

    @GetMapping
    public List<Inventorystatus> getAllInventoryStatuses() {
        return inventorystatusRepository.findAll();
    }
}
