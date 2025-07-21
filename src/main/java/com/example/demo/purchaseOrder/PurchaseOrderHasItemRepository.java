package com.example.demo.purchaseOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderHasItemRepository extends JpaRepository<PurchaseOrderHasItem, Integer> {
}
