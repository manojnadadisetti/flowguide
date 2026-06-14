package com.flowguide.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to FlowGuide!");
            helper.setText(buildWelcomeHtml(fullName), true);
            mailSender.send(message);
            logger.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendVerificationEmail(String toEmail, String fullName, String verificationLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify your FlowGuide account");
            helper.setText(buildVerificationHtml(fullName, verificationLink), true);
            mailSender.send(message);
            logger.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendStepCompletedEmail(String toEmail, String fullName,
                                        String stepTitle, int completed, int total) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Step Completed: " + stepTitle);
            helper.setText(buildStepCompletedHtml(fullName, stepTitle, completed, total), true);
            mailSender.send(message);
            logger.info("Step completion email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send step email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendOnboardingCompleteEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Onboarding Complete!");
            helper.setText(buildCompletionHtml(fullName), true);
            mailSender.send(message);
            logger.info("Onboarding completion email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send completion email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendReminderEmail(String toEmail, String fullName, int pendingSteps) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("You have " + pendingSteps + " pending steps in FlowGuide");
            message.setText("Hi " + fullName + ",\n\nYou still have " + pendingSteps
                + " onboarding steps to complete.\n\nVisit: http://localhost:3000\n\nTeam FlowGuide");
            mailSender.send(message);
            logger.info("Reminder sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send reminder to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildWelcomeHtml(String fullName) {
        return "<html><body style='font-family:Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:24px;'>"
            + "<div style='max-width:560px;margin:auto;background:#fff;padding:32px;border-radius:10px;border:1px solid #e2e8f0;'>"
            + "<h1 style='color:#1d4ed8;margin-bottom:8px;'>Welcome to FlowGuide!</h1>"
            + "<p>Hi <strong>" + fullName + "</strong>, your account is ready.</p>"
            + "<p>Follow the guided onboarding steps to get fully set up.</p>"
            + "<a href='http://localhost:3000' style='display:inline-block;margin-top:16px;padding:12px 28px;"
            + "background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>Start Onboarding</a>"
            + "</div></body></html>";
    }

    private String buildVerificationHtml(String fullName, String link) {
        return "<html><body style='font-family:Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:24px;'>"
            + "<div style='max-width:560px;margin:auto;background:#fff;padding:32px;border-radius:10px;border:1px solid #e2e8f0;'>"
            + "<h2 style='color:#1d4ed8;'>Verify Your Email</h2>"
            + "<p>Hi <strong>" + fullName + "</strong>, click below to verify your email address.</p>"
            + "<a href='" + link + "' style='display:inline-block;margin-top:16px;padding:12px 28px;"
            + "background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>Verify Email</a>"
            + "<p style='color:#94a3b8;font-size:12px;margin-top:24px;'>This link expires in 24 hours.</p>"
            + "</div></body></html>";
    }

    private String buildStepCompletedHtml(String fullName, String stepTitle, int completed, int total) {
        int pct = (int) ((completed / (double) total) * 100);
        return "<html><body style='font-family:Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:24px;'>"
            + "<div style='max-width:560px;margin:auto;background:#fff;padding:32px;border-radius:10px;border:1px solid #e2e8f0;'>"
            + "<h2 style='color:#16a34a;'>&#10003; Step Completed!</h2>"
            + "<p>Hi <strong>" + fullName + "</strong>, you completed: <strong>" + stepTitle + "</strong></p>"
            + "<p>Progress: <strong>" + completed + " / " + total + " steps (" + pct + "%)</strong></p>"
            + "<div style='background:#e2e8f0;border-radius:99px;height:8px;margin:16px 0;'>"
            + "<div style='background:#1d4ed8;width:" + pct + "%;height:8px;border-radius:99px;'></div></div>"
            + "<a href='http://localhost:3000' style='display:inline-block;margin-top:16px;padding:12px 28px;"
            + "background:#1d4ed8;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>Continue</a>"
            + "</div></body></html>";
    }

    private String buildCompletionHtml(String fullName) {
        return "<html><body style='font-family:Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:24px;'>"
            + "<div style='max-width:560px;margin:auto;background:#fff;padding:32px;border-radius:10px;border:1px solid #e2e8f0;'>"
            + "<h1 style='color:#16a34a;'>&#127881; Onboarding Complete!</h1>"
            + "<p>Congratulations <strong>" + fullName + "</strong>! You have completed all steps.</p>"
            + "<p>You are now fully set up and ready to use FlowGuide.</p>"
            + "<a href='http://localhost:3000/dashboard' style='display:inline-block;margin-top:16px;padding:12px 28px;"
            + "background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>Go to Dashboard</a>"
            + "</div></body></html>";
    }
}