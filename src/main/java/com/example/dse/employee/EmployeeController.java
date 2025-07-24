package com.example.dse.employee;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public org.springframework.data.domain.Page<Employee> getAllEmployees(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return employeeRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Integer id) {
        Optional<Employee> emp = employeeRepository.findById(id);
        return emp.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Integer id, @RequestBody Employee employeeDetails) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    employee.setEmployee_number(employeeDetails.getEmployee_number());
                    employee.setFullname(employeeDetails.getFullname());
                    employee.setNic(employeeDetails.getNic());
                    employee.setGender(employeeDetails.getGender());
                    employee.setDob(employeeDetails.getDob());
                    employee.setMobilenumber(employeeDetails.getMobilenumber());
                    employee.setEmail(employeeDetails.getEmail());
                    employee.setDesignation_id(employeeDetails.getDesignation_id());
                    employee.setEmployeestatus_id(employeeDetails.getEmployeestatus_id());
                    return ResponseEntity.ok(employeeRepository.save(employee));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
