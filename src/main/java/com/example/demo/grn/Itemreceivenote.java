package com.example.demo.grn;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import com.example.demo.inventory.Irnstatus;
import com.example.demo.purchaseOrder.PurchaseOrder;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators; // Import JsonIdentityInfo

import jakarta.persistence.CascadeType; // Import ObjectIdGenerators
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "itemreceivenote")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id") // Add JsonIdentityInfo
public class Itemreceivenote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String irnno;
    private Date receiveddate;
    private BigDecimal totalamount;
    private BigDecimal discountrate;
    private BigDecimal grossamount;

    @ManyToOne
    @JoinColumn(name = "purchaseorder_id")
    private PurchaseOrder purchaseorder;

    @ManyToOne
    @JoinColumn(name = "irnstatus_id")
    private Irnstatus irnstatus;

    @OneToMany(mappedBy = "itemreceivenote", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("irn-items")
    private List<ItemreceivenoteHasItem> itemreceivenoteItems;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIrnno() {
        return irnno;
    }

    public void setIrnno(String irnno) {
        this.irnno = irnno;
    }

    public Date getReceiveddate() {
        return receiveddate;
    }

    public void setReceiveddate(Date receiveddate) {
        this.receiveddate = receiveddate;
    }

    public BigDecimal getTotalamount() {
        return totalamount;
    }

    public void setTotalamount(BigDecimal totalamount) {
        this.totalamount = totalamount;
    }

    public BigDecimal getDiscountrate() {
        return discountrate;
    }

    public void setDiscountrate(BigDecimal discountrate) {
        this.discountrate = discountrate;
    }

    public BigDecimal getGrossamount() {
        return grossamount;
    }

    public void setGrossamount(BigDecimal grossamount) {
        this.grossamount = grossamount;
    }

    public PurchaseOrder getPurchaseorder() {
        return purchaseorder;
    }

    public void setPurchaseorder(PurchaseOrder purchaseorder) {
        this.purchaseorder = purchaseorder;
    }

    public Irnstatus getIrnstatus() {
        return irnstatus;
    }

    public void setIrnstatus(Irnstatus irnstatus) {
        this.irnstatus = irnstatus;
    }

    public List<ItemreceivenoteHasItem> getItemreceivenoteItems() {
        return itemreceivenoteItems;
    }

    public void setItemreceivenoteItems(List<ItemreceivenoteHasItem> itemreceivenoteItems) {
        this.itemreceivenoteItems = itemreceivenoteItems;
    }
}
