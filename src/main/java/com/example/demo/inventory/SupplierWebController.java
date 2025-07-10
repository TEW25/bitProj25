package com.example.demo.inventory;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SupplierWebController {

    @GetMapping("/manage_supplier")
    public String supplierManagement() {
        return "supplier.html";
    }
}