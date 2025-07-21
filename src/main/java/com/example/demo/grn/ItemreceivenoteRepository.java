package com.example.demo.grn;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemreceivenoteRepository extends JpaRepository<Itemreceivenote, Integer> {
    // Custom query to filter by supplierId and/or date
    @Query("SELECT irn FROM Itemreceivenote irn " +
           "JOIN irn.purchaseorder po " +
           "JOIN po.supplier s " +
           "WHERE (:supplierId IS NULL OR s.id = :supplierId) " +
           "AND (:date IS NULL OR irn.receiveddate = :date) " +
           "ORDER BY irn.id DESC")
    java.util.List<Itemreceivenote> findBySupplierIdAndDate(
            @org.springframework.lang.Nullable @Param("supplierId") Integer supplierId,
            @org.springframework.lang.Nullable @Param("date") java.sql.Date date);
}
