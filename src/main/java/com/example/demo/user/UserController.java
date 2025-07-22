package com.example.demo.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public org.springframework.data.domain.Page<User> getAllUsers(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        if (user.getAddeddatetime() == null) {
            user.setAddeddatetime(java.time.LocalDateTime.now());
        }
        // Hash the password before saving
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(userDetails.getUsername());
                    if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
                    }
                    user.setStatus(userDetails.getStatus());
                    user.setAddeddatetime(userDetails.getAddeddatetime());
                    user.setEmployee(userDetails.getEmployee());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to get users with their employee id and fullname
    @GetMapping("/with-employee")
    public List<java.util.Map<String, Object>> getUsersWithEmployee() {
        List<User> users = userRepository.findAll();
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (User user : users) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("user_id", user.getId());
            if (user.getEmployee() != null) {
                map.put("employee_id", user.getEmployee().getId());
                map.put("employee_fullname", user.getEmployee().getFullname());
            } else {
                map.put("employee_id", null);
                map.put("employee_fullname", null);
            }
            map.put("username", user.getUsername());
            result.add(map);
        }
        return result;
    }
}
