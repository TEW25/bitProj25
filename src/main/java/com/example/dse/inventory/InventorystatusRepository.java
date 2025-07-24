package com.example.dse.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventorystatusRepository extends JpaRepository<Inventorystatus, Integer> {
}
