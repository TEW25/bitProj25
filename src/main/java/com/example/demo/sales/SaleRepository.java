package com.example.demo.sales;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
    @Query("SELECT s FROM Sale s WHERE (:from IS NULL OR s.added_datetime >= :from) AND (:to IS NULL OR s.added_datetime <= :to)")
    java.util.List<Sale> findByAddedDatetimeBetween(@Param("from") Date from, @Param("to") Date to);

    @Query("SELECT COALESCE(SUM(s.total_amount), 0) FROM Sale s")
    BigDecimal sumTotalAmount();
}
