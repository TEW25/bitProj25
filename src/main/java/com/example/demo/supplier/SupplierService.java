package com.example.demo.supplier;

import java.util.List;
import java.util.Optional; // Import DataIntegrityViolationException

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

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

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Integer id) {
        return supplierRepository.findById(id);
    }

    public Supplier createSupplier(Supplier supplier) {
        try {
            return supplierRepository.save(supplier);
        } catch (DataIntegrityViolationException e) {
            // Check if the exception is due to duplicate email (this might need refinement
            // depending on the exact database error message or code)
            if (e.getMessage() != null && e.getMessage().contains("supplier.email")) {
                return null; // Indicate duplicate email error
            } else {
                throw e; // Re-throw other data integrity violations
            }
        }
    }

    public Supplier updateSupplier(Integer id, Supplier supplierDetails) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        if (supplier.isPresent()) {
            Supplier existingSupplier = supplier.get();
            existingSupplier.setSuppliername(supplierDetails.getSuppliername());
            existingSupplier.setSuppliercontactno(supplierDetails.getSuppliercontactno());
            existingSupplier.setEmail(supplierDetails.getEmail());
            existingSupplier.setSupplierstatus(supplierDetails.getSupplierstatus());
            try {
                return supplierRepository.save(existingSupplier);
            } catch (DataIntegrityViolationException e) {
                 // Check if the exception is due to duplicate email
                if (e.getMessage() != null && e.getMessage().contains("supplier.email")) {
                    return null; // Indicate duplicate email error
                } else {
                    throw e; // Re-throw other data integrity violations
                }
            }
        } else {
            return null;
        }
    }

    public void deleteSupplier(Integer id) {
        supplierRepository.deleteById(id);
    }
}