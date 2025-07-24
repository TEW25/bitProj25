package com.example.dse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/manage_supplier")
    public String supplierManagement() {
        return "supplier.html";
    }
    @GetMapping("/Category-Brand")
    public String categoryBrandManagement() {
        return "category_subcategory.html";
    }
    @GetMapping("/dashboard")
    public String dashboardManagement() {
        return "dashboard";
    }
    @GetMapping("/manage_items")
    public String itemManagement() {
        return "item.html";
    }

    @GetMapping("/manage_inventory")
    public String inventoryManagement() {
        return "inventory.html";
    }

    @GetMapping("/sales_records")
    public String salesRecordsManagement() {
        return "sales_records.html";
    }

    @GetMapping("/purchase_order")
    public String purchaseOrderManagement() {
        return "purchase_order.html";
    }

    @GetMapping("/item_receive_note")
    public String itemReceiveNoteManagement() {
        return "item_receive_note.html";
    }

    @GetMapping("/purchase_order_records")
    public String purchaseOrderViewManagement() {
        return "purchase_order_view.html";
    }
    @GetMapping("/grn_records")
    public String grnOrderViewManagement() {
        return "item_receive_note_records.html";
    }
    

    @GetMapping("/sales")
    public String salesManagement() {
        return "sales.html";
    }
    @GetMapping("/login")
    public String loginManagement() {
        return "login.html";
    }
    @GetMapping("/employee")
    public String employeeManagement() {
        return "employee.html";
    }
}