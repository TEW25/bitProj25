package com.example.dse.purchaseOrder;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderStatusRepository extends JpaRepository<PurchaseOrderStatus, Integer> {
    Optional<PurchaseOrderStatus> findByName(String name);
}
