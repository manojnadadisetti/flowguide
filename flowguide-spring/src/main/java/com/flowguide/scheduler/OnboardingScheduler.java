package com.flowguide.scheduler;

import com.flowguide.entity.User;
import com.flowguide.entity.UserProgress;
import com.flowguide.repository.OnboardingStepRepository;
import com.flowguide.repository.RefreshTokenRepository;
import com.flowguide.repository.UserProgressRepository;
import com.flowguide.repository.UserRepository;
import com.flowguide.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OnboardingScheduler {

    private static final Logger logger = LoggerFactory.getLogger(OnboardingScheduler.class);

    private final UserRepository            userRepository;
    private final UserProgressRepository    progressRepository;
    private final OnboardingStepRepository  stepRepository;
    private final RefreshTokenRepository    refreshTokenRepository;
    private final EmailService              emailService;

    public OnboardingScheduler(
            UserRepository userRepository,
            UserProgressRepository progressRepository,
            OnboardingStepRepository stepRepository,
            RefreshTokenRepository refreshTokenRepository,
            EmailService emailService) {
        this.userRepository         = userRepository;
        this.progressRepository     = progressRepository;
        this.stepRepository         = stepRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailService           = emailService;
    }

    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyReminders() {
        logger.info("[SCHEDULER] Running daily onboarding reminder job...");
        long totalSteps = stepRepository.count();

        List<User> users = userRepository.findByIsActiveTrue();
        for (User user : users) {
            List<UserProgress> pending = progressRepository
                    .findByUser_IdAndStatus(user.getId(), "pending");
            if (!pending.isEmpty()) {
                emailService.sendReminderEmail(user.getEmail(), user.getFullName(), pending.size());
                logger.info("[SCHEDULER] Reminder -> {} ({} pending)", user.getEmail(), pending.size());
            }
        }
        logger.info("[SCHEDULER] Daily reminders done.");
    }

    @Scheduled(fixedRate = 3_600_000)
    public void hourlyStatsLog() {
        long users    = userRepository.count();
        long steps    = stepRepository.count();
        long progress = progressRepository.count();
        logger.info("[SCHEDULER] Stats -> Users: {}, Steps: {}, Progress records: {}", users, steps, progress);
    }

    @Scheduled(cron = "0 0 8 * * MON")
    public void weeklyUnverifiedNudge() {
        logger.info("[SCHEDULER] Running weekly unverified-user nudge...");
        List<User> unverified = userRepository.findByIsVerifiedFalse();
        for (User user : unverified) {
            logger.info("[SCHEDULER] Unverified user: {} -- sending verification nudge", user.getEmail());
            emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFullName(),
                "http://localhost:3000/verify?email=" + user.getEmail()
            );
        }
        logger.info("[SCHEDULER] Weekly nudge done. Nudged: {}", unverified.size());
    }

    @Scheduled(fixedRate = 300_000)
    public void healthCheck() {
        logger.debug("[SCHEDULER] Health check OK -- app running.");
    }
}