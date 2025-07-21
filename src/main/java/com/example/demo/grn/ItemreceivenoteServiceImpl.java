package com.example.demo.grn;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.inventory.Inventory;
import com.example.demo.inventory.InventoryRepository;
import com.example.demo.inventory.InventorystatusRepository;
import com.example.demo.item.Item;
import com.example.demo.purchaseOrder.PurchaseOrder;
import com.example.demo.purchaseOrder.PurchaseOrderRepository;



@Service
public class ItemreceivenoteServiceImpl implements ItemreceivenoteService {

    @Autowired
    private ItemreceivenoteRepository itemreceivenoteRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventorystatusRepository inventorystatusRepository;



    @Override
    @Transactional
    public Itemreceivenote createItemreceivenote(Itemreceivenote itemreceivenote) {
        // Update purchaseorder.porderstatus_id to 2
        PurchaseOrder po = itemreceivenote.getPurchaseorder();
        if (po != null && po.getId() != null) {
            System.out.println("Directly updating PurchaseOrder id: " + po.getId() + " to porderstatus_id=2");
            purchaseOrderRepository.updatePorderstatusIdById(po.getId(), 2);
        }

        // Update inventory for each item in the GRN
        if (itemreceivenote.getItemreceivenoteItems() != null) {
            for (var irnItem : itemreceivenote.getItemreceivenoteItems()) {
                Item item = irnItem.getItem();
                if (item == null || item.getId() == null) continue;
                Integer itemId = item.getId();
                Integer orderQty = irnItem.getOrderqty();
                if (orderQty == null) orderQty = 0;

                Inventory inventory = inventoryRepository.findByItemId(itemId).orElse(null);
                if (inventory != null) {
                    // Update availableqty
                    if (inventory.getAvailableqty() == null) inventory.setAvailableqty(java.math.BigDecimal.ZERO);
                    inventory.setAvailableqty(inventory.getAvailableqty().add(new java.math.BigDecimal(orderQty)));
                    inventoryRepository.save(inventory);
                } else {
                    // Create new inventory
                    Inventory newInventory = new Inventory();
                    // Generate inventorycode (e.g., "INV-<itemId>-<timestamp>")
                    String code = "INV-" + itemId + "-" + System.currentTimeMillis();
                    newInventory.setInventorycode(code);
                    newInventory.setAvailableqty(new java.math.BigDecimal(orderQty));
                    newInventory.setTotalqty(BigDecimal.valueOf(0)); // default null
                    newInventory.setItem(item);
                    // Set inventorystatus_id to 1 (fetch entity)
                    newInventory.setInventorystatus(inventorystatusRepository.findById(1).orElse(null));
                    inventoryRepository.save(newInventory);
                }
            }
        }

        return itemreceivenoteRepository.save(itemreceivenote);
    }

    @Override
    public List<Itemreceivenote> getItemreceivenotesFiltered(Integer supplierId, Date date) {
        return itemreceivenoteRepository.findBySupplierIdAndDate(supplierId, date);
    }

    @Override
    public Itemreceivenote getItemreceivenoteById(Integer id) {
        return itemreceivenoteRepository.findById(id).orElse(null);
    }
}
