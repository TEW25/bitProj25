package com.example.dse.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemstatusRepository extends JpaRepository<Itemstatus, Integer> {
}