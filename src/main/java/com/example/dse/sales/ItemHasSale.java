package com.example.dse.sales;

import java.math.BigDecimal;

import com.example.dse.item.Item;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "item_has_sales")
public class ItemHasSale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "sales_id")
    @JsonBackReference("sale-items")
    private Sale sale;

    private BigDecimal sales_price;
    private BigDecimal quantity;
    private BigDecimal line_price;

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public Sale getSale() { return sale; }
    public void setSale(Sale sale) { this.sale = sale; }
    public BigDecimal getSales_price() { return sales_price; }
    public void setSales_price(BigDecimal sales_price) { this.sales_price = sales_price; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getLine_price() { return line_price; }
    public void setLine_price(BigDecimal line_price) { this.line_price = line_price; }
}
