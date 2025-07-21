package com.example.demo.purchaseOrder;

import java.util.List;
import java.util.Optional;

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

    @Query("SELECT po FROM PurchaseOrder po JOIN FETCH po.supplier")
    List<PurchaseOrder> findAllWithSupplier();
    @Modifying
    @Transactional
    @Query("UPDATE PurchaseOrder po SET po.porderstatus.id = :statusId WHERE po.id = :poId")
    int updatePorderstatusIdById(@Param("poId") Integer poId, @Param("statusId") Integer statusId);
}
