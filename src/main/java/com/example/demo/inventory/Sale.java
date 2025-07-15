package com.example.demo.inventory;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String salesnumber;
    private BigDecimal total_amount;
    private BigDecimal paid_amount;
    private Integer added_user;

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
    public Integer getAdded_user() { return added_user; }
    public void setAdded_user(Integer added_user) { this.added_user = added_user; }
    public List<ItemHasSale> getItems() { return items; }
    public void setItems(List<ItemHasSale> items) { this.items = items; }
}
