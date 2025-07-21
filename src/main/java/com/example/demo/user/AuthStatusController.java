package com.example.demo.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.employee.Employee;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthStatusController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/status")
    public ResponseEntity<?> status(HttpSession session) {
        Object userId = session.getAttribute("user");
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        if (userId != null) {
            return userRepository.findById((Integer)userId)
                .map(user -> {
                    Employee emp = user.getEmployee();
                    result.put("logged_in", true);
                    result.put("user_id", user.getId());
                    result.put("fullname", emp != null ? emp.getFullname() : null);
                    result.put("designation_id", emp != null ? emp.getDesignation_id() : null);
                    return ResponseEntity.ok(result);
                })
                .orElseGet(() -> {
                    result.put("logged_in", false);
                    return ResponseEntity.status(401).body(result);
                });
        } else {
            result.put("logged_in", false);
            return ResponseEntity.status(401).body(result);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }
}

