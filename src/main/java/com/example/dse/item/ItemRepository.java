package com.example.dse.item;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {

    @Query("SELECT i FROM Item i WHERE " +
           "(:brandId IS NULL OR i.brand.id = :brandId) AND " +
           "(:statusId IS NULL OR i.itemstatus.id = :statusId) AND " +
           "(:categoryId IS NULL OR i.subcategory.category.id = :categoryId) AND " +
           "(:searchTerm IS NULL OR lower(i.itemcode) LIKE lower(concat('%', :searchTerm, '%')) OR lower(i.itemname) LIKE lower(concat('%', :searchTerm, '%')))")
    Page<Item> findFilteredItems(
            @Param("brandId") Integer brandId,
            @Param("statusId") Integer statusId,
            @Param("categoryId") Integer categoryId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);

    List<Item> findByBrand_Id(Integer brandId);
    List<Item> findByItemstatus_Id(Integer itemstatusId);
    List<Item> findBySubcategory_Id(Integer subcategoryId);
}