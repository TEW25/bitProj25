package com.example.demo.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers(Integer statusId, String supplierName) {
        if (statusId != null && supplierName != null && !supplierName.isEmpty()) {
            return supplierRepository.findAllBySupplierstatus_IdAndSuppliernameContainingIgnoreCase(statusId, supplierName);
        } else if (statusId != null) {
            return supplierRepository.findAllBySupplierstatus_Id(statusId);
        } else if (supplierName != null && !supplierName.isEmpty()) {
            return supplierRepository.findAllBySuppliernameContainingIgnoreCase(supplierName);
        } else {
            return supplierRepository.findAll();
        }
    }

    public Optional<Supplier> getSupplierById(Integer id) {
        return supplierRepository.findById(id);
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Integer id, Supplier supplierDetails) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        if (supplier.isPresent()) {
            Supplier existingSupplier = supplier.get();
            existingSupplier.setSuppliername(supplierDetails.getSuppliername());
            existingSupplier.setSuppliercontactno(supplierDetails.getSuppliercontactno());
            existingSupplier.setEmail(supplierDetails.getEmail());
            existingSupplier.setSupplierstatus(supplierDetails.getSupplierstatus());
            return supplierRepository.save(existingSupplier);
        } else {
            return null;
        }
    }

    public void deleteSupplier(Integer id) {
        supplierRepository.deleteById(id);
    }
}