package com.example.demo.purchaseOrder;

import java.math.BigDecimal;

import com.example.demo.item.Item;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity; // Import JsonBackReference
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "purchaseorder_has_item")
public class PurchaseOrderHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "purchaseorder_id")
    @JsonBackReference("po-items") // Match the value in PurchaseOrder
    private PurchaseOrder purchaseorder;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private BigDecimal purchaseprice;
    private Integer orderedqty;
    private BigDecimal lineprice;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PurchaseOrder getPurchaseorder() {
        return purchaseorder;
    }

    public void setPurchaseorder(PurchaseOrder purchaseorder) {
        this.purchaseorder = purchaseorder;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public BigDecimal getPurchaseprice() {
        return purchaseprice;
    }

    public void setPurchaseprice(BigDecimal purchaseprice) {
        this.purchaseprice = purchaseprice;
    }

    public Integer getOrderedqty() {
        return orderedqty;
    }

    public void setOrderedqty(Integer orderedqty) {
        this.orderedqty = orderedqty;
    }

    public BigDecimal getLineprice() {
        return lineprice;
    }

    public void setLineprice(BigDecimal lineprice) {
        this.lineprice = lineprice;
    }
}
