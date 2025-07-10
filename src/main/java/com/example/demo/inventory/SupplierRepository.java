package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    // Add a custom method for filtering by status and/or name
    List<Supplier> findAllBySupplierstatus_IdAndSuppliernameContainingIgnoreCase(Integer supplierstatus_id, String suppliername);
    List<Supplier> findAllBySupplierstatus_Id(Integer supplierstatus_id);
    List<Supplier> findAllBySuppliernameContainingIgnoreCase(String suppliername);
}