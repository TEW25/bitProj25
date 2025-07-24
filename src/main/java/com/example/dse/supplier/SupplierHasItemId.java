package com.example.dse.supplier;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class SupplierHasItemId implements Serializable {

    private Integer supplierId;
    private Integer itemId;

    // Constructors
    public SupplierHasItemId() {}

    public SupplierHasItemId(Integer supplierId, Integer itemId) {
        this.supplierId = supplierId;
        this.itemId = itemId;
    }

    // Getters
    public Integer getSupplierId() {
        return supplierId;
    }

    public Integer getItemId() {
        return itemId;
    }

    // equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SupplierHasItemId that = (SupplierHasItemId) o;
        return Objects.equals(supplierId, that.supplierId) &&
               Objects.equals(itemId, that.itemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(supplierId, itemId);
    }
}
