package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/supplierstatuses")
public class SupplierstatusController {

    @Autowired
    private SupplierstatusService supplierstatusService;

    @GetMapping
    public List<Supplierstatus> getAllSupplierstatuses() {
        return supplierstatusService.getAllSupplierstatuses();
    }
}
