package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private PurchaseOrderHasItemRepository purchaseOrderHasItemRepository;

    @Autowired
    private PurchaseOrderStatusRepository purchaseOrderStatusRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder) {
        // Generate a unique purchase order code (e.g., using timestamp)
        String purchaseOrderCode = "PO" + System.currentTimeMillis();
        purchaseOrder.setPurchaseordercode(purchaseOrderCode);

        // Set the required date if not provided (optional, based on requirements)
        if (purchaseOrder.getRequireddate() == null) {
            purchaseOrder.setRequireddate(new java.sql.Date(System.currentTimeMillis()));
        }

        // Set the initial status (e.g., 'Ordered')
        Optional<PurchaseOrderStatus> orderedStatus = purchaseOrderStatusRepository.findByName("Ordered"); // Assuming a status with name 'Ordered' exists
        if (orderedStatus.isPresent()) {
            purchaseOrder.setPorderstatus(orderedStatus.get());
        } else {
            // Handle case where 'Ordered' status is not found (e.g., throw exception or set a different default)
            throw new RuntimeException("Purchase Order Status 'Ordered' not found.");
        }

        // Save the purchase order first to get the generated ID
        PurchaseOrder savedPurchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        // Save the purchase order items
        if (purchaseOrder.getPurchaseOrderItems() != null) {
            for (PurchaseOrderHasItem item : purchaseOrder.getPurchaseOrderItems()) {
                item.setPurchaseorder(savedPurchaseOrder);
                // Ensure item and purchase price are set correctly (they should be from the frontend)
                // You might want to re-fetch item details from the database to ensure data integrity
                Optional<Item> existingItem = itemRepository.findById(item.getItem().getId());
                if (existingItem.isPresent()) {
                    item.setItem(existingItem.get());
                    // Recalculate line price on the backend to prevent manipulation
                    item.setLineprice(item.getPurchaseprice().multiply(BigDecimal.valueOf(item.getOrderedqty())));
                    purchaseOrderHasItemRepository.save(item);
                } else {
                    // Handle case where item is not found
                    throw new RuntimeException("Item with ID " + item.getItem().getId() + " not found.");
                }
            }
        }

        return savedPurchaseOrder;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAllWithSupplier(); // Changed to use findAllWithSupplier
    }

    public PurchaseOrder getPurchaseOrderById(Integer id) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findByIdWithSupplier(id); // Changed to use findByIdWithSupplier
        return purchaseOrder.orElse(null);
    }

    // You can add other service methods here (e.g., update status, etc.)
}
