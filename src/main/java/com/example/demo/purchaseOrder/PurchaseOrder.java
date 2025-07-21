package com.example.demo.purchaseOrder;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import com.example.demo.inventory.Irnstatus;
import com.example.demo.supplier.Supplier;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.CascadeType; // Import JsonIdentityInfo
import jakarta.persistence.Entity; // Import ObjectIdGenerators
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "purchaseorder")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id") // Add JsonIdentityInfo
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String purchaseordercode;
    private Date requireddate;
    private BigDecimal totalamount;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    // Removed @JsonBackReference to allow supplier serialization
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "porderstatus_id")
    private PurchaseOrderStatus porderstatus;

    @ManyToOne
    @JoinColumn(name = "irnstatus_id") // Assuming a column named irnstatus_id in the purchaseorder table
    private Irnstatus irnstatus;

    @OneToMany(mappedBy = "purchaseorder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("po-items") // Use a value to differentiate references if needed
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

    public Irnstatus getIrnstatus() {
        return irnstatus;
    }

    public void setIrnstatus(Irnstatus irnstatus) {
        this.irnstatus = irnstatus;
    }

    public List<PurchaseOrderHasItem> getPurchaseOrderItems() {
        return purchaseOrderItems;
    }

    public void setPurchaseOrderItems(List<PurchaseOrderHasItem> purchaseOrderItems) {
        this.purchaseOrderItems = purchaseOrderItems;
    }
}
