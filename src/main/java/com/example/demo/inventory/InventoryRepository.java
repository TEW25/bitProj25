package com.example.demo.inventory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface InventoryRepository extends JpaRepository<Inventory, Integer>, JpaSpecificationExecutor<Inventory> {
    Optional<Inventory> findByItemId(Integer itemId);

    // Low stock: availableqty < item's rop (reorder point)
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.availableqty < i.item.rop")
    Long countLowStockItems();
}
