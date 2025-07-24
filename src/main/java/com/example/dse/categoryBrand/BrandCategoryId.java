package com.example.dse.categoryBrand;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class BrandCategoryId implements Serializable {

    private Integer brandId;
    private Integer categoryId;

    public BrandCategoryId() {
    }

    public BrandCategoryId(Integer brandId, Integer categoryId) {
        this.brandId = brandId;
        this.categoryId = categoryId;
    }

    public Integer getBrandId() {
        return brandId;
    }

    public void setBrandId(Integer brandId) {
        this.brandId = brandId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BrandCategoryId that = (BrandCategoryId) o;
        return Objects.equals(brandId, that.brandId) &&
               Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(brandId, categoryId);
    }
}