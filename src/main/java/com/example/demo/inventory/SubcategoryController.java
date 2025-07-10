package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    @GetMapping
    public List<Subcategory> getAllSubcategories() {
        return subcategoryService.getAllSubcategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subcategory> getSubcategoryById(@PathVariable Integer id) {
        Optional<Subcategory> subcategory = subcategoryService.getSubcategoryById(id);
        return subcategory.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Subcategory createSubcategory(@RequestBody Subcategory subcategory) {
        return subcategoryService.createSubcategory(subcategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subcategory> updateSubcategory(@PathVariable Integer id, @RequestBody Subcategory subcategoryDetails) {
        Subcategory updatedSubcategory = subcategoryService.updateSubcategory(id, subcategoryDetails);
        if (updatedSubcategory != null) {
            return ResponseEntity.ok(updatedSubcategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Integer id) {
        subcategoryService.deleteSubcategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/byCategory/{categoryId}")
    public List<Subcategory> getSubcategoriesByCategory(@PathVariable Integer categoryId) {
        return subcategoryService.getSubcategoriesByCategory(categoryId);
    }
}