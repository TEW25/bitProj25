package com.example.demo.item;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Itemstatus {

    @Id
    private Integer id;
    private String name;

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}