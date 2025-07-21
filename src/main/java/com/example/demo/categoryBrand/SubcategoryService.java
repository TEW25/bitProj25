package com.example.demo.categoryBrand;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.item.Item;
import com.example.demo.item.ItemRepository;

@Service
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private ItemRepository itemRepository;

    public List<Subcategory> getAllSubcategories() {
        return subcategoryRepository.findAll();
    }

    public Optional<Subcategory> getSubcategoryById(Integer id) {
        return subcategoryRepository.findById(id);
    }

    public Subcategory createSubcategory(Subcategory subcategory) {
        return subcategoryRepository.save(subcategory);
    }

    public Subcategory updateSubcategory(Integer id, Subcategory subcategoryDetails) {
        Optional<Subcategory> subcategory = subcategoryRepository.findById(id);
        if (subcategory.isPresent()) {
            Subcategory existingSubcategory = subcategory.get();
            existingSubcategory.setName(subcategoryDetails.getName());
            existingSubcategory.setCategory(subcategoryDetails.getCategory());
            return subcategoryRepository.save(existingSubcategory);
        } else {
            return null;
        }
    }

    public void deleteSubcategory(Integer id) {
        List<Item> itemsToUpdate = itemRepository.findBySubcategory_Id(id);
        for (Item item : itemsToUpdate) {
            item.setSubcategory(null);
            itemRepository.save(item);
        }
        subcategoryRepository.deleteById(id);
    }

    public List<Subcategory> getSubcategoriesByCategory(Integer categoryId) {
        return subcategoryRepository.findByCategory_Id(categoryId);
    }
}