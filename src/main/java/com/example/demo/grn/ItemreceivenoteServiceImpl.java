package com.example.demo.grn;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemreceivenoteServiceImpl implements ItemreceivenoteService {

    @Autowired
    private ItemreceivenoteRepository itemreceivenoteRepository;

    @Override
    public Itemreceivenote createItemreceivenote(Itemreceivenote itemreceivenote) {
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
