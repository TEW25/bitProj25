package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierHasItemRepository extends JpaRepository<SupplierHasItem, SupplierHasItemId> {

    // Find all SupplierHasItem entries for a given supplier ID
    List<SupplierHasItem> findBySupplierId(Integer supplierId);
}
