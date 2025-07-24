package com.example.dse.user;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/userstatus")
public class UserStatusController {
    @GetMapping
    public List<Map<String, Object>> getUserStatuses() {
        // Example: 1 = Active, 0 = Inactive
        return Arrays.asList(
            Map.of("id", 1, "name", "Active"),
            Map.of("id", 0, "name", "Inactive")
        );
    }
}
