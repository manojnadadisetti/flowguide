package com.flowguide.controller;

import com.flowguide.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status",  "UP",
            "service", "FlowGuide Notification Service",
            "port",    "8080"
        ));
    }

    @PostMapping("/welcome")
    public ResponseEntity<Map<String, String>> welcome(@RequestBody Map<String, String> body) {
        emailService.sendWelcomeEmail(body.get("email"), body.get("fullName"));
        return ResponseEntity.ok(Map.of("status", "sent", "type", "welcome"));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestBody Map<String, String> body) {
        emailService.sendVerificationEmail(
            body.get("email"),
            body.get("fullName"),
            body.get("verificationLink")
        );
        return ResponseEntity.ok(Map.of("status", "sent", "type", "verification"));
    }

    @PostMapping("/step-completed")
    public ResponseEntity<Map<String, String>> stepCompleted(@RequestBody Map<String, Object> body) {
        emailService.sendStepCompletedEmail(
            (String)  body.get("email"),
            (String)  body.get("fullName"),
            (String)  body.get("stepTitle"),
            (Integer) body.get("completedCount"),
            (Integer) body.get("totalCount")
        );
        return ResponseEntity.ok(Map.of("status", "sent", "type", "step_completed"));
    }

    @PostMapping("/onboarding-complete")
    public ResponseEntity<Map<String, String>> onboardingComplete(@RequestBody Map<String, String> body) {
        emailService.sendOnboardingCompleteEmail(body.get("email"), body.get("fullName"));
        return ResponseEntity.ok(Map.of("status", "sent", "type", "onboarding_complete"));
    }
}