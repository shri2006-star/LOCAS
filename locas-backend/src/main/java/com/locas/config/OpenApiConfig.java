package com.locas.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "LOCAS - Loan Origination & Credit Assessment System API",
                version = "1.0.0",
                description = "Enterprise Digital Lending Platform APIs covering Applicant Registration, KYC, Bureau Fetch, Automated Credit Scoring, Maker-Checker Underwriting, Offer Generation, Disbursement, EMI Tracking, NPA Early Warning, and Admin Reporting.",
                contact = @Contact(
                        name = "LOCAS Architecture Team",
                        email = "support@locas.bank.com"
                )
        ),
        security = @SecurityRequirement(name = "BearerAuth")
)
@SecurityScheme(
        name = "BearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer",
        description = "Enter JWT access token generated from /api/auth/login or /api/auth/register"
)
public class OpenApiConfig {
}
