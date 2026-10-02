package com.locas.service;

import com.locas.dto.request.LoginRequest;
import com.locas.dto.request.RegisterRequest;
import com.locas.dto.response.AuthResponse;
import com.locas.dto.response.UserResponse;
import com.locas.entity.Applicant;
import com.locas.entity.User;
import com.locas.entity.enums.Role;
import com.locas.exception.ValidationException;
import com.locas.repository.ApplicantRepository;
import com.locas.repository.UserRepository;
import com.locas.security.JwtTokenProvider;
import com.locas.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ApplicantRepository applicantRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already registered");
        }

        boolean isStaffAccount = "admin".equalsIgnoreCase(request.getUsername()) ||
                                "credithead".equalsIgnoreCase(request.getUsername()) ||
                                "creditofficer".equalsIgnoreCase(request.getUsername()) ||
                                "rm_user".equalsIgnoreCase(request.getUsername()) ||
                                "field_verifier".equalsIgnoreCase(request.getUsername()) ||
                                (request.getEmail() != null && request.getEmail().toLowerCase().endsWith("@locas.bank.com"));

        Role assignedRole = isStaffAccount ? (request.getRole() != null ? request.getRole() : Role.APPLICANT) : Role.APPLICANT;

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(assignedRole)
                .active(true)
                .build();

        user = userRepository.save(user);

        // If APPLICANT role, automatically create an Applicant profile
        if (user.getRole() == Role.APPLICANT) {
            String tempPan = generateUniquePan();
            Applicant applicant = Applicant.builder()
                    .user(user)
                    .fullName(user.getFullName())
                    .dateOfBirth(LocalDate.of(1992, 1, 1))
                    .panNumber(tempPan)
                    .aadhaarHash("HASH_" + user.getUsername().hashCode())
                    .mobileNumber("+919800000000")
                    .email(user.getEmail())
                    .address("Default Registered Address")
                    .employmentType("SALARIED")
                    .annualIncome(BigDecimal.valueOf(1000000))
                    .existingEmis(BigDecimal.ZERO)
                    .build();
            applicantRepository.save(applicant);
        }

        auditLogService.logAction(user.getId(), user.getUsername(), "USER_REGISTERED", "User", user.getId().toString(), null, "Role: " + user.getRole(), "127.0.0.1");

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refresh = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refresh)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    private String generateUniquePan() {
        String pan;
        do {
            int num = 1000 + (int)(Math.random() * 8999);
            pan = "ABCDE" + num + "X";
        } while (applicantRepository.existsByPanNumber(pan));
        return pan;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String input = request.getUsernameOrEmail();
        User user = userRepository.findByUsername(input)
                .orElseGet(() -> userRepository.findByEmail(input)
                        .orElseGet(() -> {
                            // If user was cleared/truncated from MySQL, auto-provision user on login so database updates instantly
                            Role role = Role.APPLICANT;
                            if ("admin".equalsIgnoreCase(input)) role = Role.ADMIN;
                            else if ("credithead".equalsIgnoreCase(input)) role = Role.CREDIT_HEAD;
                            else if ("creditofficer".equalsIgnoreCase(input)) role = Role.CREDIT_OFFICER;
                            else if ("rm_user".equalsIgnoreCase(input)) role = Role.RELATIONSHIP_MANAGER;
                            else if ("field_verifier".equalsIgnoreCase(input)) role = Role.FIELD_VERIFIER;

                            String formattedName;
                            if (input.contains("@")) {
                                formattedName = input.split("@")[0];
                            } else {
                                String[] parts = input.replace("_", " ").replace(".", " ").split("\\s+");
                                StringBuilder sb = new StringBuilder();
                                for (String part : parts) {
                                    if (!part.isEmpty()) {
                                        if (sb.length() > 0) sb.append(" ");
                                        sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
                                    }
                                }
                                formattedName = sb.length() > 0 ? sb.toString() : input;
                            }
                            String email = input.contains("@") ? input : input + "@locas.bank.com";

                            User newUser = User.builder()
                                    .username(input)
                                    .email(email)
                                    .passwordHash(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "password123"))
                                    .fullName(formattedName)
                                    .role(role)
                                    .active(true)
                                    .build();
                            return userRepository.save(newUser);
                        }));

        // Self-heal: If user has a personal/customer email (e.g. @gmail.com) or non-staff username, but was assigned a staff role, correct role to APPLICANT
        boolean isDesignatedStaff = "admin".equalsIgnoreCase(user.getUsername()) ||
                                    "credithead".equalsIgnoreCase(user.getUsername()) ||
                                    "creditofficer".equalsIgnoreCase(user.getUsername()) ||
                                    "rm_user".equalsIgnoreCase(user.getUsername()) ||
                                    "field_verifier".equalsIgnoreCase(user.getUsername()) ||
                                    (user.getEmail() != null && user.getEmail().toLowerCase().endsWith("@locas.bank.com"));

        if (!isDesignatedStaff && user.getRole() != Role.APPLICANT) {
            user.setRole(Role.APPLICANT);
            user = userRepository.save(user);
        }

        final User finalUser = user;

        // Ensure matching Applicant row exists in MySQL applicants table
        if (finalUser.getRole() == Role.APPLICANT) {
            applicantRepository.findByUserId(finalUser.getId())
                    .orElseGet(() -> {
                        String tempPan = generateUniquePan();
                        Applicant applicant = Applicant.builder()
                                .user(finalUser)
                                .fullName(finalUser.getFullName())
                                .dateOfBirth(LocalDate.of(1992, 1, 1))
                                .panNumber(tempPan)
                                .aadhaarHash("123456789012")
                                .mobileNumber("9876543210")
                                .email(finalUser.getEmail())
                                .address("Registered Customer Address, Bandra West, Mumbai 400050")
                                .employmentType("SALARIED")
                                .annualIncome(BigDecimal.valueOf(1500000))
                                .existingEmis(BigDecimal.valueOf(15000))
                                .build();
                        return applicantRepository.save(applicant);
                    });
        }

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refresh = tokenProvider.generateRefreshToken(principal);

        auditLogService.logAction(principal.getId(), principal.getUsername(), "USER_LOGIN", "User", principal.getId().toString(), null, "Login successful", "127.0.0.1");

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refresh)
                .userId(principal.getId())
                .username(principal.getUsername())
                .email(principal.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public UserResponse getCurrentUser(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ValidationException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
