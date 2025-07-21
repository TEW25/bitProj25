package com.example.demo.grn;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.purchaseOrder.PurchaseOrder;
import com.example.demo.purchaseOrder.PurchaseOrderRepository;



@Service
public class ItemreceivenoteServiceImpl implements ItemreceivenoteService {

    @Autowired
    private ItemreceivenoteRepository itemreceivenoteRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;



    @Override
    public Itemreceivenote createItemreceivenote(Itemreceivenote itemreceivenote) {
        // Update purchaseorder.porderstatus_id to 1
        PurchaseOrder po = itemreceivenote.getPurchaseorder();
        if (po != null && po.getId() != null) {
            System.out.println("Directly updating PurchaseOrder id: " + po.getId() + " to porderstatus_id=2");
            purchaseOrderRepository.updatePorderstatusIdById(po.getId(), 2);
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
