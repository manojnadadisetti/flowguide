package com.flowguide.controller;

import com.flowguide.entity.User;
import com.flowguide.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET all users (Admin only)
    @GetMapping
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"Forbidden - Admin role required\"}");
        }
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // GET user by ID (Self or Admin)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id, HttpServletRequest request) {
        String currentEmail = (String) request.getAttribute("userEmail");
        String currentRole = (String) request.getAttribute("userRole");

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"User not found\"}");
        }

        User user = userOpt.get();
        if (!"admin".equalsIgnoreCase(currentRole) && !user.getEmail().equalsIgnoreCase(currentEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"Forbidden - Access denied to other profiles\"}");
        }

        return ResponseEntity.ok(user);
    }

    // PUT update user (Self or Admin)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody User userDetails, HttpServletRequest request) {
        String currentEmail = (String) request.getAttribute("userEmail");
        String currentRole = (String) request.getAttribute("userRole");

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"User not found\"}");
        }

        User user = userOpt.get();
        if (!"admin".equalsIgnoreCase(currentRole) && !user.getEmail().equalsIgnoreCase(currentEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"Forbidden - Access denied to other profiles\"}");
        }

        if (userDetails.getFullName() != null) user.setFullName(userDetails.getFullName());
        if (userDetails.getAvatarUrl() != null) user.setAvatarUrl(userDetails.getAvatarUrl());
        if (userDetails.getPhoneNumber() != null) user.setPhoneNumber(userDetails.getPhoneNumber());
        if (userDetails.getInterests() != null) user.setInterests(userDetails.getInterests());
        if (userDetails.getSkillLevel() != null) user.setSkillLevel(userDetails.getSkillLevel());
        if (userDetails.getDailyTargetMinutes() != null) user.setDailyTargetMinutes(userDetails.getDailyTargetMinutes());

        // Admins can update role / active status
        if ("admin".equalsIgnoreCase(currentRole)) {
            if (userDetails.getRole() != null) user.setRole(userDetails.getRole());
            if (userDetails.getIsActive() != null) user.setIsActive(userDetails.getIsActive());
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE user (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id, HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"Forbidden - Admin role required\"}");
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"User not found\"}");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"User deleted successfully\"}");
    }
}
