package com.flowguide.controller;

import com.flowguide.entity.AuditLog;
import com.flowguide.entity.User;
import com.flowguide.repository.AuditLogRepository;
import com.flowguide.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogController(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    // GET all logs (Admin only)
    @GetMapping
    public ResponseEntity<?> getAllLogs(HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        if (!"admin".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("{\"error\": \"Forbidden - Admin role required\"}");
        }
        List<AuditLog> logs = auditLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    // POST create log (User or Admin)
    @PostMapping
    public ResponseEntity<?> createLog(@RequestBody AuditLog logInput, HttpServletRequest request) {
        String email = (String) request.getAttribute("userEmail");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"User associated with token not found\"}");
        }

        AuditLog log = new AuditLog();
        log.setUser(userOpt.get());
        log.setAction(logInput.getAction());
        log.setEntityType(logInput.getEntityType());
        log.setEntityId(logInput.getEntityId());

        AuditLog savedLog = auditLogRepository.save(log);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLog);
    }
}
