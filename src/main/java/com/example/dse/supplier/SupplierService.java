package com.example.dse.supplier;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public Page<Supplier> getAllSuppliers(Integer statusId, String supplierName, Pageable pageable) {
        if (statusId != null && supplierName != null && !supplierName.isEmpty()) {
            return supplierRepository.findAllBySupplierstatus_IdAndSuppliernameContainingIgnoreCase(statusId, supplierName, pageable);
        } else if (statusId != null) {
            return supplierRepository.findAllBySupplierstatus_Id(statusId, pageable);
        } else if (supplierName != null && !supplierName.isEmpty()) {
            return supplierRepository.findAllBySuppliernameContainingIgnoreCase(supplierName, pageable);
        } else {
            return supplierRepository.findAll(pageable);
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
            // Check if the exception is due to duplicate email
            if (e.getMessage() != null && e.getMessage().contains("supplier.email")) {
                return null;
            } else {
                throw e;
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
                    return null;
                } else {
                    throw e;
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