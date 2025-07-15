package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger; // Import Logger

@Service
public class ItemreceivenoteService {

    private static final Logger logger = Logger.getLogger(ItemreceivenoteService.class.getName()); // Add logger

    @Autowired
    private ItemreceivenoteRepository itemreceivenoteRepository;

    @Autowired
    private ItemreceivenoteHasItemRepository itemreceivenoteHasItemRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private IrnstatusRepository irnstatusRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private InventoryRepository inventoryRepository; // Inject InventoryRepository

    @Autowired
    private InventorystatusRepository inventorystatusRepository; // Inject InventorystatusRepository

    @Transactional
    public Itemreceivenote createItemreceivenote(Itemreceivenote itemreceivenote) {
        // 1. Validating the linked Purchase Order exists.
        if (itemreceivenote.getPurchaseorder() == null || itemreceivenote.getPurchaseorder().getId() == null) {
            throw new RuntimeException("Purchase Order must be linked to the Item Receive Note.");
        }
        Optional<PurchaseOrder> purchaseOrderOptional = purchaseOrderRepository.findById(itemreceivenote.getPurchaseorder().getId());
        if (!purchaseOrderOptional.isPresent()) {
            throw new RuntimeException("Linked Purchase Order not found.");
        }
        itemreceivenote.setPurchaseorder(purchaseOrderOptional.get()); // Set the managed PurchaseOrder entity

        // 2. Generating a unique IRN number.
        if (itemreceivenote.getIrnno() == null || itemreceivenote.getIrnno().isEmpty()) {
             String irnno = "IRN" + System.currentTimeMillis(); // Simple unique ID generation
             itemreceivenote.setIrnno(irnno);
        }

        // 3. Setting the received date (if not provided).
        if (itemreceivenote.getReceiveddate() == null) {
            itemreceivenote.setReceiveddate(new java.sql.Date(System.currentTimeMillis()));
        }

        // 4. Setting the initial IRN status (e.g., 'Received').
        if (itemreceivenote.getIrnstatus() == null || itemreceivenote.getIrnstatus().getId() == null) {
            Optional<Irnstatus> receivedStatus = irnstatusRepository.findById(1); // Assuming ID 1 is 'Received'
             if (receivedStatus.isPresent()) {
                itemreceivenote.setIrnstatus(receivedStatus.get());
            } else {
                throw new RuntimeException("IRN Status 'Received' not found.");
            }
        } else {
             Optional<Irnstatus> existingStatus = irnstatusRepository.findById(itemreceivenote.getIrnstatus().getId());
             if (existingStatus.isPresent()) {
                itemreceivenote.setIrnstatus(existingStatus.get());
            } else {
                throw new RuntimeException("Provided IRN Status not found.");
            }
        }

        // 5. Saving the Itemreceivenote first to get the generated ID
        Itemreceivenote savedItemreceivenote = itemreceivenoteRepository.save(itemreceivenote);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 6. Processing the list of ItemreceivenoteHasItem:
        if (itemreceivenote.getItemreceivenoteItems() != null) {
            for (ItemreceivenoteHasItem itemDetail : itemreceivenote.getItemreceivenoteItems()) {
                itemDetail.setItemreceivenote(savedItemreceivenote); // Link to the saved IRN

                // Validate the item exists.
                if (itemDetail.getItem() == null || itemDetail.getItem().getId() == null) {
                    throw new RuntimeException("Item details must include a valid Item ID.");
                }
                Optional<Item> existingItem = itemRepository.findById(itemDetail.getItem().getId());
                if (existingItem.isPresent()) {
                    itemDetail.setItem(existingItem.get()); // Set the managed Item entity
                } else {
                    throw new RuntimeException("Item with ID " + itemDetail.getItem().getId() + " not found.");
                }

                // Calculate line price.
                if (itemDetail.getPurchaseprice() != null && itemDetail.getOrderqty() != null) {
                     itemDetail.setLineprice(itemDetail.getPurchaseprice().multiply(BigDecimal.valueOf(itemDetail.getOrderqty())));
                } else {
                    itemDetail.setLineprice(BigDecimal.ZERO);
                }

                // Save each ItemreceivenoteHasItem.
                itemreceivenoteHasItemRepository.save(itemDetail);

                // Add to total amount
                totalAmount = totalAmount.add(itemDetail.getLineprice());
            }
        }

        // 7. Calculating total amount and gross amount for the Itemreceivenote.
        savedItemreceivenote.setTotalamount(totalAmount);
        // Assuming gross amount is total amount minus discount (if discountrate is applied)
        BigDecimal discountRate = savedItemreceivenote.getDiscountrate() != null ? savedItemreceivenote.getDiscountrate() : BigDecimal.ZERO;
        BigDecimal discountAmount = totalAmount.multiply(discountRate.divide(BigDecimal.valueOf(100)));
        savedItemreceivenote.setGrossamount(totalAmount.subtract(discountAmount));

        // Save the updated Itemreceivenote with calculated amounts
        itemreceivenoteRepository.save(savedItemreceivenote);

        // 8. Optionally, comparing received quantities with ordered quantities from the Purchase Order.
        // This would require fetching the PurchaseOrderHasItem for the linked Purchase Order
        // and comparing quantities. This is a more complex step and can be added later if needed.

        // --- Inventory Update Logic ---
        updateInventory(savedItemreceivenote);
        // -----------------------------

        // 9. Update the linked Purchase Order status to 'Delivered' (ID 2)
        Optional<Irnstatus> deliveredStatus = irnstatusRepository.findById(2); // Assuming ID 2 is 'Delivered'
        if (deliveredStatus.isPresent()) {
            PurchaseOrder linkedPurchaseOrder = savedItemreceivenote.getPurchaseorder();
            if (linkedPurchaseOrder != null) {
                linkedPurchaseOrder.setIrnstatus(deliveredStatus.get());
                purchaseOrderRepository.save(linkedPurchaseOrder);
                logger.info("Updated Purchase Order " + linkedPurchaseOrder.getId() + " status to Delivered.");
            }
        } else {
            logger.warning("IRN Status 'Delivered' (ID 2) not found. Could not update Purchase Order status.");
        }

        return savedItemreceivenote;
    }

    @Transactional
    private void updateInventory(Itemreceivenote itemreceivenote) {
        if (itemreceivenote.getItemreceivenoteItems() != null) {
            Optional<Inventorystatus> inStockStatus = inventorystatusRepository.findById(1); // Assuming ID 1 is 'In Stock'

            if (!inStockStatus.isPresent()) {
                throw new RuntimeException("Inventory Status 'In Stock' not found.");
            }

            for (ItemreceivenoteHasItem itemDetail : itemreceivenote.getItemreceivenoteItems()) {
                Item item = itemDetail.getItem();
                // Assuming supplier information is available through the linked Purchase Order
                Supplier supplier = itemreceivenote.getPurchaseorder() != null ? itemreceivenote.getPurchaseorder().getSupplier() : null;

                if (item != null && supplier != null) {
                    // Try to find existing inventory for this item and supplier
                    Optional<Inventory> existingInventoryOptional = inventoryRepository.findByItemIdAndSupplierId(item.getId(), supplier.getId());

                    Inventory inventory;
                    if (existingInventoryOptional.isPresent()) {
                        inventory = existingInventoryOptional.get();
                        // Update existing inventory
                        inventory.setTotalqty(inventory.getTotalqty().add(BigDecimal.valueOf(itemDetail.getOrderqty())));
                        inventory.setAvailableqty(inventory.getAvailableqty().add(BigDecimal.valueOf(itemDetail.getOrderqty()))); // Assuming received items are immediately available
                    } else {
                        // Create new inventory entry
                        inventory = new Inventory();
                        // TODO: Generate a unique inventory code if needed
                        inventory.setItem(item);
                        inventory.setSupplier(supplier);
                        inventory.setTotalqty(BigDecimal.valueOf(itemDetail.getOrderqty()));
                        inventory.setAvailableqty(BigDecimal.valueOf(itemDetail.getOrderqty()));
                        inventory.setInventorystatus(inStockStatus.get()); // Set status to 'In Stock'
                    }
                    inventory.setInventorystatus(inStockStatus.get()); // Ensure status is 'In Stock' after update/creation
                    inventoryRepository.save(inventory);
                } else {
                    logger.warning("Skipping inventory update for item with missing item or supplier information."); // Replaced console.warn
                }
            }
        }
    }

    // TODO: Add methods for viewing GRNs, getting GRN details, updating status, etc.
}
