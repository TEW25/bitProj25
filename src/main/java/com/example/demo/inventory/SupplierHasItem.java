package com.example.demo.inventory;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier_has_item")
public class SupplierHasItem {

    @EmbeddedId
    private SupplierHasItemId id;

    @ManyToOne
    @MapsId("supplierId")
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    private Item item;

    // Getters and setters

    public SupplierHasItemId getId() {
        return id;
    }

    public void setId(SupplierHasItemId id) {
        this.id = id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
