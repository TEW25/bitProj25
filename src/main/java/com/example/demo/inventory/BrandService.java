package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ItemRepository itemRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Optional<Brand> getBrandById(Integer id) {
        return brandRepository.findById(id);
    }

    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Integer id, Brand brandDetails) {
        Optional<Brand> brand = brandRepository.findById(id);
        if (brand.isPresent()) {
            Brand existingBrand = brand.get();
            existingBrand.setName(brandDetails.getName());
            return brandRepository.save(existingBrand);
        } else {
            return null;
        }
    }

    public void deleteBrand(Integer id) {
        List<Item> itemsToUpdate = itemRepository.findByBrand_Id(id);
        for (Item item : itemsToUpdate) {
            item.setBrand(null);
            itemRepository.save(item);
        }
        brandRepository.deleteById(id);
    }

    public List<Brand> findAllBrands() {
        return brandRepository.findAll();
    }
}