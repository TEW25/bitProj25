package com.example.dse.supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierstatusRepository extends JpaRepository<Supplierstatus, Integer> {
}
