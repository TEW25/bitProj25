package com.example.demo.user;

import java.time.LocalDateTime;

import com.example.demo.employee.Employee;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {
    @Id
    private Integer id;
    private String username;
    private String password;
    private String email;
    private Byte status;
    private LocalDateTime addeddatetime;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Byte getStatus() { return status; }
    public void setStatus(Byte status) { this.status = status; }
    public LocalDateTime getAddeddatetime() { return addeddatetime; }
    public void setAddeddatetime(LocalDateTime addeddatetime) { this.addeddatetime = addeddatetime; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
