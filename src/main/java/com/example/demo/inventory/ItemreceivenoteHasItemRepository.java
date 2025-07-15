package com.example.demo.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemreceivenoteHasItemRepository extends JpaRepository<ItemreceivenoteHasItem, Integer> {
    // You can add custom query methods here if needed
}
