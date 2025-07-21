package com.example.demo.purchaseOrder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.item.Item;
import com.example.demo.item.ItemRepository;

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
        String purchaseOrderCode = "PO" + System.currentTimeMillis();
        purchaseOrder.setPurchaseordercode(purchaseOrderCode);

        if (purchaseOrder.getRequireddate() == null) {
            purchaseOrder.setRequireddate(new java.sql.Date(System.currentTimeMillis()));
        }

        // Set the initial status
        Optional<PurchaseOrderStatus> orderedStatus = purchaseOrderStatusRepository.findByName("Ordered");
        if (orderedStatus.isPresent()) {
            purchaseOrder.setPorderstatus(orderedStatus.get());
        } else {
            // Handle case where 'Ordered' status is not found
            throw new RuntimeException("Purchase Order Status 'Ordered' not found.");
        }

        // Save the purchase order first to get the generated ID
        PurchaseOrder savedPurchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        // Save the purchase order items
        if (purchaseOrder.getPurchaseOrderItems() != null) {
            for (PurchaseOrderHasItem item : purchaseOrder.getPurchaseOrderItems()) {
                item.setPurchaseorder(savedPurchaseOrder);
                // Ensure item and purchase price are set correctly
                Optional<Item> existingItem = itemRepository.findById(item.getItem().getId());
                if (existingItem.isPresent()) {
                    item.setItem(existingItem.get());
                    // Recalculate line price to prevent manipulation
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
        List<PurchaseOrder> orders = purchaseOrderRepository.findAllWithSupplier();
        orders.sort((o1, o2) -> o2.getRequireddate().compareTo(o1.getRequireddate())); // Descending by requireddate
        return orders;
    }

    public PurchaseOrder getPurchaseOrderById(Integer id) {
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findByIdWithSupplier(id);
        return purchaseOrder.orElse(null);
    }

    // Cancel a purchase order
    @Transactional
    public boolean cancelPurchaseOrder(Integer id) {
        Optional<PurchaseOrder> optionalOrder = purchaseOrderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            PurchaseOrder order = optionalOrder.get();
            Optional<PurchaseOrderStatus> cancelledStatus = purchaseOrderStatusRepository.findById(3);
            if (cancelledStatus.isPresent()) {
                order.setPorderstatus(cancelledStatus.get());
                purchaseOrderRepository.save(order);
                return true;
            } else {
                throw new RuntimeException("Cancelled status (id=3) not found.");
            }
        }
        return false;
    }
}
