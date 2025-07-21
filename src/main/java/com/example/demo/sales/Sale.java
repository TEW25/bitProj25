package com.example.demo.sales;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.example.demo.employee.Employee;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String salesnumber;
    @com.fasterxml.jackson.annotation.JsonProperty("total_amount")
    private BigDecimal total_amount;
    @com.fasterxml.jackson.annotation.JsonProperty("paid_amount")
    private BigDecimal paid_amount;
    @Column(name = "payment_type")
    private String paymentType;
    @Column(name = "balance_amount")
    private BigDecimal balanceAmount;
    private BigDecimal discount;
    private BigDecimal subtotal;
    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id")
    private Employee employee;

    @Temporal(TemporalType.TIMESTAMP)
    private Date added_datetime;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    @JsonManagedReference("sale-items")
    private List<ItemHasSale> items;

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getSalesnumber() { return salesnumber; }
    public void setSalesnumber(String salesnumber) { this.salesnumber = salesnumber; }
    public BigDecimal getTotal_amount() { return total_amount; }
    public void setTotal_amount(BigDecimal total_amount) { this.total_amount = total_amount; }
    public BigDecimal getPaid_amount() { return paid_amount; }
    public void setPaid_amount(BigDecimal paid_amount) { this.paid_amount = paid_amount; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Date getAdded_datetime() { return added_datetime; }
    public void setAdded_datetime(Date added_datetime) { this.added_datetime = added_datetime; }
    public List<ItemHasSale> getItems() { return items; }
    public void setItems(List<ItemHasSale> items) { this.items = items; }
}
