package com.example.demo.inventory;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String inventorycode;
    private BigDecimal availableqty;
    private BigDecimal totalqty;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    // Removed Supplier relationship as supplier_id is no longer in inventory table
    // private Supplier supplier;

    @ManyToOne // Add ManyToOne relationship to Inventorystatus
    @JoinColumn(name = "inventorystatus_id") // Assuming a foreign key column inventorystatus_id in inventory table
    private Inventorystatus inventorystatus;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getInventorycode() {
        return inventorycode;
    }

    public void setInventorycode(String inventorycode) {
        this.inventorycode = inventorycode;
    }

    public BigDecimal getAvailableqty() {
        return availableqty;
    }

    public void setAvailableqty(BigDecimal availableqty) {
        this.availableqty = availableqty;
    }

    public BigDecimal getTotalqty() {
        return totalqty;
    }

    public void setTotalqty(BigDecimal totalqty) {
        this.totalqty = totalqty;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    // Removed getSupplier and setSupplier methods

    public Inventorystatus getInventorystatus() {
        return inventorystatus;
    }

    public void setInventorystatus(Inventorystatus inventorystatus) {
        this.inventorystatus = inventorystatus;
    }
}
