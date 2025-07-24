package com.example.dse.user;

import java.time.LocalDateTime;

import com.example.dse.employee.Employee;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {
    @Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
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
    public Byte getStatus() { return status; }
    public void setStatus(Byte status) { this.status = status; }
    public LocalDateTime getAddeddatetime() { return addeddatetime; }
    public void setAddeddatetime(LocalDateTime addeddatetime) { this.addeddatetime = addeddatetime; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
