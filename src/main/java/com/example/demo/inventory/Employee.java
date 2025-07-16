package com.example.demo.inventory;

import jakarta.persistence.*;

@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String employee_number;
    private String fullname;
    // ... other fields ...

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getEmployee_number() { return employee_number; }
    public void setEmployee_number(String employee_number) { this.employee_number = employee_number; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
}
