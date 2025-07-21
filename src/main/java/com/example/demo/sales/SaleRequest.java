package com.example.demo.sales;

import java.math.BigDecimal;
import java.util.List;

public class SaleRequest {
    @com.fasterxml.jackson.annotation.JsonProperty("total_amount")
    private BigDecimal totalAmount;
    @com.fasterxml.jackson.annotation.JsonProperty("paid_amount")
    private BigDecimal paidAmount;
    @com.fasterxml.jackson.annotation.JsonProperty("paymentType")
    private String paymentType;
    @com.fasterxml.jackson.annotation.JsonProperty("balanceAmount")
    private BigDecimal balanceAmount;
    @com.fasterxml.jackson.annotation.JsonProperty("discount")
    private BigDecimal discount;
    @com.fasterxml.jackson.annotation.JsonProperty("subtotal")
    private BigDecimal subtotal;
    @com.fasterxml.jackson.annotation.JsonProperty("items")
    private List<SaleItemRequest> items;

    // Getters and setters
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public BigDecimal getBalanceAmount() { return balanceAmount; }
    public void setBalanceAmount(BigDecimal balanceAmount) { this.balanceAmount = balanceAmount; }
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public List<SaleItemRequest> getItems() { return items; }
    public void setItems(List<SaleItemRequest> items) { this.items = items; }

    public static class SaleItemRequest {
        private Integer itemId;
        private BigDecimal quantity;
        private BigDecimal salesPrice;
        private BigDecimal discount;
        private BigDecimal linePrice;
        // Getters and setters
        public Integer getItemId() { return itemId; }
        public void setItemId(Integer itemId) { this.itemId = itemId; }
        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
        public BigDecimal getSalesPrice() { return salesPrice; }
        public void setSalesPrice(BigDecimal salesPrice) { this.salesPrice = salesPrice; }
        public BigDecimal getDiscount() { return discount; }
        public void setDiscount(BigDecimal discount) { this.discount = discount; }
        public BigDecimal getLinePrice() { return linePrice; }
        public void setLinePrice(BigDecimal linePrice) { this.linePrice = linePrice; }
    }
}
