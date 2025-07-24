package com.example.dse.supplier;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    Page<Supplier> findAllBySupplierstatus_IdAndSuppliernameContainingIgnoreCase(Integer supplierstatus_id, String suppliername, Pageable pageable);
    Page<Supplier> findAllBySupplierstatus_Id(Integer supplierstatus_id, Pageable pageable);
    Page<Supplier> findAllBySuppliernameContainingIgnoreCase(String suppliername, Pageable pageable);
}