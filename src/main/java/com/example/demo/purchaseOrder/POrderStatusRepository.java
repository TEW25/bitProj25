package com.example.demo.purchaseOrder;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface POrderStatusRepository extends JpaRepository<POrderStatus, Integer> {
    Optional<POrderStatus> findByName(String name);
}
