package com.example.dse.employee;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employeestatus")
public class EmployeeStatusController {
    @Autowired
    private EmployeeStatusRepository employeeStatusRepository;

    @GetMapping
    public List<EmployeeStatus> getAllEmployeeStatuses() {
        return employeeStatusRepository.findAll();
    }
}
