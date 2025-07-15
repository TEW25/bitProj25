package com.example.demo.inventory;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo; // Import JsonIdentityInfo
import com.fasterxml.jackson.annotation.ObjectIdGenerators; // Import ObjectIdGenerators

@Entity
@Table(name = "item")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id") // Add JsonIdentityInfo
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

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("item-irnitems")
    private List<ItemreceivenoteHasItem> itemreceivenoteItems;

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

    public List<ItemreceivenoteHasItem> getItemreceivenoteItems() {
        return itemreceivenoteItems;
    }

    public void setItemreceivenoteItems(List<ItemreceivenoteHasItem> itemreceivenoteItems) {
        this.itemreceivenoteItems = itemreceivenoteItems;
    }
}