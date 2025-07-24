package com.example.dse.grn;

import java.math.BigDecimal;
import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dse.inventory.Inventory;
import com.example.dse.inventory.InventoryRepository;
import com.example.dse.inventory.InventorystatusRepository;
import com.example.dse.item.Item;
import com.example.dse.purchaseOrder.PurchaseOrder;
import com.example.dse.purchaseOrder.PurchaseOrderRepository;



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
    public org.springframework.data.domain.Page<Itemreceivenote> getItemreceivenotesFiltered(Integer supplierId, Date date, org.springframework.data.domain.Pageable pageable) {
        // Use correct repository methods for filtering
        if (supplierId != null && date != null) {
            return itemreceivenoteRepository.findBySupplierIdAndDate(supplierId, date, pageable);
        } else if (supplierId != null) {
            return itemreceivenoteRepository.findByPurchaseorder_Supplier_Id(supplierId, pageable);
        } else if (date != null) {
            return itemreceivenoteRepository.findByReceiveddate(date, pageable);
        } else {
            return itemreceivenoteRepository.findAll(pageable);
        }
    }

    @Override
    public Itemreceivenote getItemreceivenoteById(Integer id) {
        return itemreceivenoteRepository.findById(id).orElse(null);
    }
}
