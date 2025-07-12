package com.example.demo.inventory;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "purchaseorder")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String purchaseordercode;
    private Date requireddate;
    private BigDecimal totalamount;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "porderstatus_id")
    private PurchaseOrderStatus porderstatus;

    @OneToMany(mappedBy = "purchaseorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderHasItem> purchaseOrderItems;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPurchaseordercode() {
        return purchaseordercode;
    }

    public void setPurchaseordercode(String purchaseordercode) {
        this.purchaseordercode = purchaseordercode;
    }

    public Date getRequireddate() {
        return requireddate;
    }

    public void setRequireddate(Date requireddate) {
        this.requireddate = requireddate;
    }

    public BigDecimal getTotalamount() {
        return totalamount;
    }

    public void setTotalamount(BigDecimal totalamount) {
        this.totalamount = totalamount;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public PurchaseOrderStatus getPorderstatus() {
        return porderstatus;
    }

    public void setPorderstatus(PurchaseOrderStatus porderstatus) {
        this.porderstatus = porderstatus;
    }

    public List<PurchaseOrderHasItem> getPurchaseOrderItems() {
        return purchaseOrderItems;
    }

    public void setPurchaseOrderItems(List<PurchaseOrderHasItem> purchaseOrderItems) {
        this.purchaseOrderItems = purchaseOrderItems;
    }
}
