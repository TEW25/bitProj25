package com.example.demo.supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierstatusService {

    @Autowired
    private SupplierstatusRepository supplierstatusRepository;

    public List<Supplierstatus> getAllSupplierstatuses() {
        return supplierstatusRepository.findAll();
    }

    public Optional<Supplierstatus> getSupplierstatusById(Integer id) {
        return supplierstatusRepository.findById(id);
    }

    // Add methods for creating, updating, and deleting if needed
}
