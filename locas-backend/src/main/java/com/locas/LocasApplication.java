package com.locas;

import com.locas.entity.Applicant;
import com.locas.entity.CreditPolicy;
import com.locas.entity.User;
import com.locas.entity.enums.ProductType;
import com.locas.entity.enums.Role;
import com.locas.repository.ApplicantRepository;
import com.locas.repository.CreditPolicyRepository;
import com.locas.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootApplication
public class LocasApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocasApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            ApplicantRepository applicantRepository,
            CreditPolicyRepository creditPolicyRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Credit Policies if empty
            if (creditPolicyRepository.count() == 0) {
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.HOME).maxFoirSalaried(BigDecimal.valueOf(50)).maxFoirSelfEmployed(BigDecimal.valueOf(60)).maxLtv(BigDecimal.valueOf(80)).minCreditScore(700).minIncome(BigDecimal.valueOf(300000)).maxLoanAmount(BigDecimal.valueOf(50000000)).baseInterestRate(BigDecimal.valueOf(8.50)).build());
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.PERSONAL).maxFoirSalaried(BigDecimal.valueOf(50)).maxFoirSelfEmployed(BigDecimal.valueOf(50)).maxLtv(BigDecimal.ZERO).minCreditScore(650).minIncome(BigDecimal.valueOf(250000)).maxLoanAmount(BigDecimal.valueOf(2500000)).baseInterestRate(BigDecimal.valueOf(11.50)).build());
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.VEHICLE).maxFoirSalaried(BigDecimal.valueOf(50)).maxFoirSelfEmployed(BigDecimal.valueOf(55)).maxLtv(BigDecimal.valueOf(85)).minCreditScore(680).minIncome(BigDecimal.valueOf(240000)).maxLoanAmount(BigDecimal.valueOf(5000000)).baseInterestRate(BigDecimal.valueOf(9.25)).build());
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.EDUCATION).maxFoirSalaried(BigDecimal.valueOf(45)).maxFoirSelfEmployed(BigDecimal.valueOf(45)).maxLtv(BigDecimal.ZERO).minCreditScore(650).minIncome(BigDecimal.valueOf(300000)).maxLoanAmount(BigDecimal.valueOf(7500000)).baseInterestRate(BigDecimal.valueOf(9.75)).build());
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.BUSINESS).maxFoirSalaried(BigDecimal.valueOf(60)).maxFoirSelfEmployed(BigDecimal.valueOf(60)).maxLtv(BigDecimal.valueOf(75)).minCreditScore(700).minIncome(BigDecimal.valueOf(500000)).maxLoanAmount(BigDecimal.valueOf(20000000)).baseInterestRate(BigDecimal.valueOf(12.00)).build());
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.GOLD).maxFoirSalaried(BigDecimal.valueOf(65)).maxFoirSelfEmployed(BigDecimal.valueOf(65)).maxLtv(BigDecimal.valueOf(75)).minCreditScore(600).minIncome(BigDecimal.valueOf(100000)).maxLoanAmount(BigDecimal.valueOf(10000000)).baseInterestRate(BigDecimal.valueOf(8.00)).build());
                creditPolicyRepository.save(CreditPolicy.builder().productType(ProductType.LAP).maxFoirSalaried(BigDecimal.valueOf(50)).maxFoirSelfEmployed(BigDecimal.valueOf(55)).maxLtv(BigDecimal.valueOf(70)).minCreditScore(680).minIncome(BigDecimal.valueOf(400000)).maxLoanAmount(BigDecimal.valueOf(30000000)).baseInterestRate(BigDecimal.valueOf(10.25)).build());
            }

            // Seed Users and Applicants if empty
            if (!userRepository.existsByUsername("sneha_nair")) {
                User u1 = userRepository.save(User.builder().username("sneha_nair").email("sneha.nair@locas.bank.com").passwordHash(passwordEncoder.encode("password123")).fullName("Sneha Nair").role(Role.APPLICANT).active(true).build());
                if (!applicantRepository.existsByPanNumber("ABCDE1234F")) {
                    applicantRepository.save(Applicant.builder().user(u1).fullName("Sneha Nair").dateOfBirth(LocalDate.of(1993, 5, 14)).panNumber("ABCDE1234F").aadhaarHash("123456789012").mobileNumber("9876543210").email("sneha.nair@locas.bank.com").address("Flat 402, Sunshine Heights, Bandra West, Mumbai 400050").employmentType("SALARIED").annualIncome(BigDecimal.valueOf(1800000)).existingEmis(BigDecimal.valueOf(25000)).build());
                }
            }
            if (!userRepository.existsByUsername("applicant_user")) {
                User u2 = userRepository.save(User.builder().username("applicant_user").email("applicant@locas.bank.com").passwordHash(passwordEncoder.encode("password123")).fullName("Sneha Nair").role(Role.APPLICANT).active(true).build());
                if (!applicantRepository.existsByPanNumber("DEFGH4567I")) {
                    applicantRepository.save(Applicant.builder().user(u2).fullName("Sneha Nair").dateOfBirth(LocalDate.of(1993, 5, 14)).panNumber("DEFGH4567I").aadhaarHash("456789012345").mobileNumber("9876543213").email("applicant@locas.bank.com").address("Flat 402, Sunshine Heights, Bandra West, Mumbai 400050").employmentType("SALARIED").annualIncome(BigDecimal.valueOf(1800000)).existingEmis(BigDecimal.valueOf(25000)).build());
                }
            }
            if (!userRepository.existsByUsername("creditofficer")) {
                userRepository.save(User.builder().username("creditofficer").email("officer@locas.bank.com").passwordHash(passwordEncoder.encode("password123")).fullName("Kavita Menon").role(Role.CREDIT_OFFICER).active(true).build());
            }
            if (!userRepository.existsByUsername("credithead")) {
                userRepository.save(User.builder().username("credithead").email("head@locas.bank.com").passwordHash(passwordEncoder.encode("password123")).fullName("Rajesh Sharma").role(Role.CREDIT_HEAD).active(true).build());
            }
        };
    }
}
