package com.flowguide.config;

import com.flowguide.entity.OnboardingStep;
import com.flowguide.repository.OnboardingStepRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final OnboardingStepRepository stepRepository;

    public DataInitializer(OnboardingStepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }

    @Override
    public void run(String... args) {
        if (stepRepository.count() == 0) {
            logger.info("[INIT] Seeding 8 default onboarding steps...");
            stepRepository.saveAll(defaultSteps());
            logger.info("[INIT] Seeding complete.");
        } else {
            logger.info("[INIT] Onboarding steps already exist -- skipping seed.");
        }
    }

    private List<OnboardingStep> defaultSteps() {
        return List.of(
            step(1, "Welcome to FlowGuide",
                 "Get started by learning what FlowGuide can do for you.",
                 "profile", true, "hand-wave", "Takes about 1 minute."),
            step(2, "Complete Your Profile",
                 "Add your name, role, and avatar to personalise your experience.",
                 "profile", true, "user-circle", "Your profile is visible to your team."),
            step(3, "Verify Your Email",
                 "Click the link sent to your inbox to activate your account.",
                 "profile", true, "mail-check", "Check spam if you don't see it."),
            step(4, "Explore the Dashboard",
                 "Take a quick tour of the main dashboard features.",
                 "feature", false, "layout", "You can revisit this tour anytime."),
            step(5, "Set Up Notifications",
                 "Choose how and when you want to receive alerts.",
                 "feature", false, "bell", "You can change these in Settings later."),
            step(6, "Invite Your Team",
                 "Add colleagues to collaborate inside FlowGuide.",
                 "integration", false, "users-plus", "They will receive an email invitation."),
            step(7, "Connect Integrations",
                 "Link your tools like Slack, Jira, or Google Workspace.",
                 "integration", false, "plug", "Integrations can be added anytime."),
            step(8, "Onboarding Complete!",
                 "You are all set. Start using FlowGuide to its full potential.",
                 "feature", true, "check-circle", "Congratulations on completing setup!")
        );
    }

    private OnboardingStep step(int order, String title, String desc,
                                 String category, boolean required,
                                 String icon, String helpText) {
        OnboardingStep s = new OnboardingStep();
        s.setStepOrder(order);
        s.setTitle(title);
        s.setDescription(desc);
        s.setCategory(category);
        s.setIsRequired(required);
        s.setIcon(icon);
        s.setHelpText(helpText);
        return s;
    }
}