package com.example.demo.inventory;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ItemWebController {

    @GetMapping("/manage_items")
    public String itemManagement() {
        return "item.html";
    }

    @GetMapping("/manage_inventory")
    public String inventoryManagement() {
        return "inventory.html";
    }
}