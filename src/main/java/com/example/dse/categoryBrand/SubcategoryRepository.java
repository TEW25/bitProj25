package com.example.dse.categoryBrand;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer> {
    List<Subcategory> findByCategory_Id(Integer categoryId);
}