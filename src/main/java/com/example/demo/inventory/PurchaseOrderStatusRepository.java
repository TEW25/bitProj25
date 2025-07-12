package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PurchaseOrderStatusRepository extends JpaRepository<PurchaseOrderStatus, Integer> {
    Optional<PurchaseOrderStatus> findByName(String name);
}
