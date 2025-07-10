package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {

    @Query("SELECT i FROM Item i WHERE " +
           "(:brandId IS NULL OR i.brand.id = :brandId) AND " +
           "(:statusId IS NULL OR i.itemstatus.id = :statusId) AND " +
           "(:searchTerm IS NULL OR lower(i.itemcode) LIKE lower(concat('%', :searchTerm, '%')) OR lower(i.itemname) LIKE lower(concat('%', :searchTerm, '%')))" )
    List<Item> findFilteredItems(
            @Param("brandId") Integer brandId,
            @Param("statusId") Integer statusId,
            @Param("searchTerm") String searchTerm);

    List<Item> findByBrand_Id(Integer brandId);
    List<Item> findByItemstatus_Id(Integer itemstatusId);
    List<Item> findBySubcategory_Id(Integer subcategoryId);
}