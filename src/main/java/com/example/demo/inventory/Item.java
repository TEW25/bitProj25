package com.example.demo.inventory;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.math.BigDecimal;

@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String itemcode;
    private String itemname;
    private BigDecimal itemsize;
    private Integer rop;
    private Integer roq;
    private BigDecimal salesprice;
    private BigDecimal purchaseprice;

    @ManyToOne
    @JoinColumn(name = "itemstatus_id")
    private Itemstatus itemstatus;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getItemcode() {
        return itemcode;
    }

    public void setItemcode(String itemcode) {
        this.itemcode = itemcode;
    }

    public String getItemname() {
        return itemname;
    }

    public void setItemname(String itemname) {
        this.itemname = itemname;
    }

    public BigDecimal getItemsize() {
        return itemsize;
    }

    public void setItemsize(BigDecimal itemsize) {
        this.itemsize = itemsize;
    }

    public Integer getRop() {
        return rop;
    }

    public void setRop(Integer rop) {
        this.rop = rop;
    }

    public Integer getRoq() {
        return roq;
    }

    public void setRoq(Integer roq) {
        this.roq = roq;
    }

    public BigDecimal getSalesprice() {
        return salesprice;
    }

    public void setSalesprice(BigDecimal salesprice) {
        this.salesprice = salesprice;
    }

    public BigDecimal getPurchaseprice() {
        return purchaseprice;
    }

    public void setPurchaseprice(BigDecimal purchaseprice) {
        this.purchaseprice = purchaseprice;
    }

    public Itemstatus getItemstatus() {
        return itemstatus;
    }

    public void setItemstatus(Itemstatus itemstatus) {
        this.itemstatus = itemstatus;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Subcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(Subcategory subcategory) {
        this.subcategory = subcategory;
    }
}