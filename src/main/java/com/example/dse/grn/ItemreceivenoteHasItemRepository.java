package com.example.dse.grn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemreceivenoteHasItemRepository extends JpaRepository<ItemreceivenoteHasItem, Integer> {
}
