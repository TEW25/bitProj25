package com.example.dse.inventory;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface InventoryRepository extends JpaRepository<Inventory, Integer>, JpaSpecificationExecutor<Inventory> {
    Optional<Inventory> findByItemId(Integer itemId);

    // Low stock: availableqty < item's rop (reorder point)
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.availableqty < i.item.rop")
    Long countLowStockItems();

    Page<Inventory> findAll(Specification<Inventory> spec, Pageable pageable);
}
