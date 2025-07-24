package com.example.dse.supplier;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierHasItemRepository extends JpaRepository<SupplierHasItem, SupplierHasItemId> {

    // Find all SupplierHasItem entries for a given supplier ID
    List<SupplierHasItem> findBySupplierId(Integer supplierId);
}
