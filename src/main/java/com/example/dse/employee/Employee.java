package com.example.dse.employee;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String employee_number;
    private String fullname;
    private String nic;
    private String gender;
    private java.sql.Date dob;
    private String mobilenumber;
    private String email;
    private Integer designation_id;
    private Integer employeestatus_id;

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getEmployee_number() { return employee_number; }
    public void setEmployee_number(String employee_number) { this.employee_number = employee_number; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public java.sql.Date getDob() { return dob; }
    public void setDob(java.sql.Date dob) { this.dob = dob; }
    public String getMobilenumber() { return mobilenumber; }
    public void setMobilenumber(String mobilenumber) { this.mobilenumber = mobilenumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getDesignation_id() { return designation_id; }
    public void setDesignation_id(Integer designation_id) { this.designation_id = designation_id; }
    public Integer getEmployeestatus_id() { return employeestatus_id; }
    public void setEmployeestatus_id(Integer employeestatus_id) { this.employeestatus_id = employeestatus_id; }
}
