package com.example.demo.purchaseOrder;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query("SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier WHERE po.id = :id")
    Optional<PurchaseOrder> findByIdWithSupplier(Integer id);

    @Query(value = "SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier",
           countQuery = "SELECT COUNT(po) FROM PurchaseOrder po")
    Page<PurchaseOrder> findAllWithSupplier(Pageable pageable);
    @Modifying
    @Transactional
    @Query("UPDATE PurchaseOrder po SET po.porderstatus.id = :statusId WHERE po.id = :poId")
    int updatePorderstatusIdById(@Param("poId") Integer poId, @Param("statusId") Integer statusId);
}
