package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    // Standard JpaRepository methods like findById are implicitly available
    // Custom query methods can be added here if needed

    @Query("SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier WHERE po.id = :id")
    Optional<PurchaseOrder> findByIdWithSupplier(Integer id);

    @Query("SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier")
    List<PurchaseOrder> findAllWithSupplier();
}
