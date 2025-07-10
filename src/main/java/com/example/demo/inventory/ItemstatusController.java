package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/itemstatuses")
public class ItemstatusController {

    @Autowired
    private ItemstatusService itemstatusService;

    @GetMapping
    public List<Itemstatus> getAllItemstatuses() {
        return itemstatusService.getAllItemstatuses();
    }
}