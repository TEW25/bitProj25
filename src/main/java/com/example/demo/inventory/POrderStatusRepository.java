package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface POrderStatusRepository extends JpaRepository<POrderStatus, Integer> {
    Optional<POrderStatus> findByName(String name);
}
