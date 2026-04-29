package com.complaint;

import com.complaint.model.User;
import com.complaint.model.enums.Role;
import com.complaint.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ComplaintManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComplaintManagementApplication.class, args);
    }

    @Bean
    CommandLineRunner seedDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed admin user
            if (userRepository.findByEmail("admin@complaint.com").isEmpty()) {
                User admin = User.builder()
                        .name("System Admin")
                        .email("admin@complaint.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN)
                        .phone("9999999999")
                        .department("IT")
                        .active(true)
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Admin user seeded: admin@complaint.com / Admin@123");
            }

            // Seed a regular user
            if (userRepository.findByEmail("user@complaint.com").isEmpty()) {
                User user = User.builder()
                        .name("John Doe")
                        .email("user@complaint.com")
                        .password(passwordEncoder.encode("User@123"))
                        .role(Role.USER)
                        .phone("8888888888")
                        .department("Finance")
                        .active(true)
                        .build();
                userRepository.save(user);
                System.out.println("✅ Regular user seeded: user@complaint.com / User@123");
            }
        };
    }
}
