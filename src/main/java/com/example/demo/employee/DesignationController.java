package com.example.demo.employee;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {
    @Autowired
    private DesignationRepository designationRepository;

    @GetMapping
    public List<Designation> getAllDesignations() {
        return designationRepository.findAll();
    }
}
