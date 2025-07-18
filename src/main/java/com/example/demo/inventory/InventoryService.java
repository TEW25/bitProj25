package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    public Inventory patchInventory(Integer id, Inventory inventoryDetails) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(id);
        if (optionalInventory.isPresent()) {
            Inventory existingInventory = optionalInventory.get();
            // Only update fields that are not null in inventoryDetails
            if (inventoryDetails.getInventorycode() != null) {
                existingInventory.setInventorycode(inventoryDetails.getInventorycode());
            }
            if (inventoryDetails.getAvailableqty() != null) {
                existingInventory.setAvailableqty(inventoryDetails.getAvailableqty());
            }
            if (inventoryDetails.getTotalqty() != null) {
                existingInventory.setTotalqty(inventoryDetails.getTotalqty());
            }
            if (inventoryDetails.getItem() != null) {
                existingInventory.setItem(inventoryDetails.getItem());
            }
            // Removed supplier update as supplier is no longer present
            if (inventoryDetails.getInventorystatus() != null) {
                existingInventory.setInventorystatus(inventoryDetails.getInventorystatus());
            }
            // Save only updated fields
            return inventoryRepository.save(existingInventory);
        } else {
            return null;
        }
    }
    public void deleteInventory(Integer id) {
        inventoryRepository.deleteById(id);
    }
    public Optional<Inventory> findById(Integer id) {
        return inventoryRepository.findById(id);
    }

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> findAllInventory(String searchTerm, String status, String sortBy) {
        Specification<Inventory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchTerm != null && !searchTerm.isEmpty()) {
                String lowerSearchTerm = searchTerm.toLowerCase();
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("item").get("itemname")), "%" + lowerSearchTerm + "%"),
                        cb.like(cb.lower(root.get("item").get("itemcode")), "%" + lowerSearchTerm + "%")
                ));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("inventorystatus").get("name"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.unsorted();
        if (sortBy != null && !sortBy.isEmpty()) {
            // Assuming sortBy comes in the format "fieldName,direction" (e.g., "availableqty,asc")
            String[] sortParams = sortBy.split(",");
            String field = sortParams[0];
            Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

            // Map frontend sort fields to backend entity fields
            switch (field) {
                case "availableqty":
                    sort = Sort.by(direction, "availableqty");
                    break;
                case "totalqty":
                    sort = Sort.by(direction, "totalqty");
                    break;
                // Add other sortable fields here
                default:
                    // Default sorting or throw an error
                    sort = Sort.unsorted();
            }
        }

        return inventoryRepository.findAll(spec, sort);
    }

    public Inventory createInventory(Inventory inventory) {
        // Add any business logic or validation before saving
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Integer id, Inventory inventoryDetails) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(id);
        if (optionalInventory.isPresent()) {
            Inventory existingInventory = optionalInventory.get();
            // Update fields from inventoryDetails
            existingInventory.setInventorycode(inventoryDetails.getInventorycode());
            existingInventory.setAvailableqty(inventoryDetails.getAvailableqty());
            existingInventory.setTotalqty(inventoryDetails.getTotalqty());
            existingInventory.setItem(inventoryDetails.getItem());
            // Removed supplier update as supplier is no longer present
            existingInventory.setInventorystatus(inventoryDetails.getInventorystatus());

            // Add any business logic or validation before saving
            return inventoryRepository.save(existingInventory);
        } else {
            return null; // Or throw an exception
        }
    }

    public List<Inventory> findAvailableItems(String searchTerm) {
        Specification<Inventory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only include items with available quantity > 0
            predicates.add(cb.greaterThan(root.get("availableqty"), 0));

            if (searchTerm != null && !searchTerm.isEmpty()) {
                String lowerSearchTerm = searchTerm.toLowerCase();
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("item").get("itemcode")), "%" + lowerSearchTerm + "%"),
                        cb.like(cb.lower(root.get("item").get("itemname")), "%" + lowerSearchTerm + "%")
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return inventoryRepository.findAll(spec);
    }

    // Add other service methods as needed (e.g., for deleting)
}
