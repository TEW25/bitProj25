package com.example.dse.grn;

import java.math.BigDecimal;

import com.example.dse.item.Item;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "itemreceivenote_has_item")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ItemreceivenoteHasItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "itemreceivenote_id")
    @JsonBackReference("irn-items")
    private Itemreceivenote itemreceivenote;

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonBackReference("item-irnitems")
    private Item item;

    private BigDecimal purchaseprice;
    private Integer orderqty;
    private BigDecimal lineprice;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Itemreceivenote getItemreceivenote() {
        return itemreceivenote;
    }

    public void setItemreceivenote(Itemreceivenote itemreceivenote) {
        this.itemreceivenote = itemreceivenote;
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

    public Integer getOrderqty() {
        return orderqty;
    }

    public void setOrderqty(Integer orderqty) {
        this.orderqty = orderqty;
    }

    public BigDecimal getLineprice() {
        return lineprice;
    }

    public void setLineprice(BigDecimal lineprice) {
        this.lineprice = lineprice;
    }
}
    