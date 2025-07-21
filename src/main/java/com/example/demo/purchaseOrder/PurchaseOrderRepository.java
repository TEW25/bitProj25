package com.example.demo.purchaseOrder;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query("SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier WHERE po.id = :id")
    Optional<PurchaseOrder> findByIdWithSupplier(Integer id);

    @Query("SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier")
    List<PurchaseOrder> findAllWithSupplier();
}
