package com.example.dse.inventory;

import java.math.BigDecimal;

import com.example.dse.item.Item;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

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

    @ManyToOne 
    @JoinColumn(name = "inventorystatus_id") 
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

    public Inventorystatus getInventorystatus() {
        return inventorystatus;
    }

    public void setInventorystatus(Inventorystatus inventorystatus) {
        this.inventorystatus = inventorystatus;
    }
}
