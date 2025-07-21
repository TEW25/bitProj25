package com.example.demo.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemstatusService {

    @Autowired
    private ItemstatusRepository itemstatusRepository;

    @Autowired
    private ItemRepository itemRepository;

    public List<Itemstatus> getAllItemstatuses() {
        return itemstatusRepository.findAll();
    }

    public Optional<Itemstatus> getItemstatusById(Integer id) {
        return itemstatusRepository.findById(id);
    }

    public void deleteItemstatus(Integer id) {
        List<Item> itemsToUpdate = itemRepository.findByItemstatus_Id(id);
        for (Item item : itemsToUpdate) {
            item.setItemstatus(null);
            itemRepository.save(item);
        }
        itemstatusRepository.deleteById(id);
    }
}