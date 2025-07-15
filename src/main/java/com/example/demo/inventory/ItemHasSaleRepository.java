package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemHasSaleRepository extends JpaRepository<ItemHasSale, Integer> {
}
