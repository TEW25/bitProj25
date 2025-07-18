package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;



public interface InventoryRepository extends JpaRepository<Inventory, Integer>, JpaSpecificationExecutor<Inventory> {
    Optional<Inventory> findByItemId(Integer itemId);
    // Add a method to find Inventory by Item and Supplier
    // Removed findByItemIdAndSupplierId as supplier_id is no longer present
}
