package com.example.demo.inventory;

import java.util.List;

public class RefundRequest {
    private Integer saleId;
    private List<RefundItem> items;
    private double paidBack;

    public Integer getSaleId() { return saleId; }
    public void setSaleId(Integer saleId) { this.saleId = saleId; }
    public List<RefundItem> getItems() { return items; }
    public void setItems(List<RefundItem> items) { this.items = items; }
    public double getPaidBack() { return paidBack; }
    public void setPaidBack(double paidBack) { this.paidBack = paidBack; }

    public static class RefundItem {
        private Integer itemId;
        private int refundQty;
        private double salesPrice;

        public Integer getItemId() { return itemId; }
        public void setItemId(Integer itemId) { this.itemId = itemId; }
        public int getRefundQty() { return refundQty; }
        public void setRefundQty(int refundQty) { this.refundQty = refundQty; }
        public double getSalesPrice() { return salesPrice; }
        public void setSalesPrice(double salesPrice) { this.salesPrice = salesPrice; }
    }
}
